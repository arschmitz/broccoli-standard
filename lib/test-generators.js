const escape = require('js-string-escape')

function render (errors) {
  return errors.map(function renderLine (error) {
    return error.line + ':' + error.column + ' - ' + error.message + ' (' + error.ruleId + ')'
  }).join('\n')
}

function qunit (relativePath, errors, results) {
  const passed = !results.errorCount || results.errorCount.length === 0

  let messages = relativePath + ' should pass Standard'

  if (results.messages) {
    messages += '\n\n' + render(results.messages)
  }

  return 'QUnit.module(\'Standard | ' + escape(relativePath) + '\');\n' +
    'QUnit.test(\'should pass Standard\', function(assert) {\n' +
    '  assert.expect(1);\n' +
    '  assert.ok(' + passed + ', \'' + escape(messages).replace(/\\n/g, '') + '\');\n' +
    '});\n'
}

function mocha (relativePath, errors, results) {
  const passed = !results.errorCount || results.errorCount.length === 0

  let messages = relativePath + ' should pass Standard'

  if (results.messages) {
    messages += '\n\n' + render(results.messages)
  }

  let output =
    'describe(\'Standard | ' + escape(relativePath) + '\', function() {\n' +
    '  it(\'should pass Standard\', function() {\n'

  if (passed) {
    output +=
      '    // Standard passed\n'
  } else {
    output +=
      '    // Standard failed\n' +
      '    var error = new chai.AssertionError(\'' + escape(messages).replace(/\\n/g, '') + '\');\n' +
      '    error.stack = undefined;\n' +
      '    throw error;\n'
  }

  output +=
    '  });\n' +
    '});\n'

  return output
}

module.exports = {qunit, mocha}
