module.exports = function (broccoli) {
  let standard = require('./lib/index')
  let mergeTrees = require('broccoli-merge-trees')

    // lint plugin code
  var plugin = standard('lib')

    // lint tests
  var test = standard('test/fixture')

  var format = standard('test/format-fixture', {
    format: 'eslint/lib/formatters/compact'
  })

  var fix = standard('tmp/fix-fixture', {
    fix: true
  })

  return mergeTrees([plugin, test, format, fix], { overwrite: true })
}
