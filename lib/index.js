const Filter = require('broccoli-persistent-filter')
const standard = require('standard')
const fs = require('fs')
const path = require('path')

/**
 * Calculates the severity of a eslint.linter.verify result
 * @param {Array} result Eslint verify result array
 * @param {Object} config Eslint eslint/lib/config
 * @return {Number} If the returned number is greater than 0 the result contains errors.
 */
function getResultSeverity (result, config) {
  // Count all errors
  return result.reduce((previous, message) => {
    let severity

    if (message.fatal) {
      return previous + 1
    }

    severity = message.messages[0] ? message.messages[0].severity : 0

    if (severity === 2) {
      return previous + 1
    }

    return previous
  }, 0)
}

/**
 * Uses the content of each file in a given tree and runs eslint validation on it.
 * @param {Object} inputNode from broccoli.makeNode
 * @param {{format: String}} options Filter options
 * @returns {StandardValidationFilter} Filter object
 * @constructor
 */
var StandardValidationFilter = function (inputNode, options = {}) {
  this.formatter = require('eslint/lib/formatters/stylish')
  if (!(this instanceof StandardValidationFilter)) {
    return new StandardValidationFilter(inputNode, options)
  }
  // set inputTree
  Filter.call(this, inputNode)
  this.node = inputNode
  this.console = options.console || console
  this.options = {
    format: options.format ? options.format : undefined,
    throwOnError: options.throwOnError ? options.throwOnError : false,
    logOutput: options.logOutput ? options.logOutput: false,
    fix: options.fix ? options.fix : false,
    ignore () {
      return false
    }
  }
  if (typeof options.testGenerator === 'string') {
    const testGenerators = require('./test-generators')

    this.testGenerator = testGenerators[options.testGenerator]
    if (!this.testGenerator) {
      throw new Error(`Could not find '${this.internalOptions.testGenerator}' test generator.`)
    }
  } else {
    this.testGenerator = options.testGenerator
  }

  // set formatter
  this.formatter = require(this.options.format ? this.options.format : 'eslint/lib/formatters/stylish')
}

module.exports = StandardValidationFilter
StandardValidationFilter.prototype = Object.create(Filter.prototype)
StandardValidationFilter.prototype.constructor = StandardValidationFilter
StandardValidationFilter.prototype.extensions = ['js']
StandardValidationFilter.prototype.targetExtension = 'js'
StandardValidationFilter.prototype.processString = function (content, relativePath) {
  return new Promise((resolve, reject) => {
    let config
    let messages = []
    let output = content

    if (this.options.ignore(relativePath)) {
      return content;
    }
    // verify file content
    standard.lintText(content, this.options, (err, report) => {
      if (err) {
        reject(err)
      }

      if (report.results.length) {
        // prepare message format
        messages.push({
          filePath: relativePath,
          messages: report.results[0].messages
        })

        // log formatter output
        if (messages[0].messages.length > 0 && this.options.logOutput) {
          this.console.log(this.formatter(messages, config))
        }

        if (report.results[0].output) {
          // Fix is true so over write the original file
          fs.writeFileSync(path.join(this.node, relativePath), report.results[0].output, {
            encoding: 'utf8'
          })
          output = report.results[0].output
        }
        if (this.testGenerator) {
          output = this.testGenerator(relativePath, messages, report.results[0])
          if (this.options.logOutput) {
            this.console.log(output)
          }
        }

        if (getResultSeverity(report.results, config) > 0 && this.options.throwOnError) {
          throw new Error('Lint Errors!')
        }
        resolve({output, report})
      }
    })
  })
}
