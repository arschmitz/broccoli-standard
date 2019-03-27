'use strict'
let assert = require('assert')
let fs = require('fs')
let buildLog = fs.readFileSync('broccoli-build.out').toString()
const rawFiles = buildLog.split('{{fileBreak}}').filter(file => file !== '')
const files = rawFiles.reduce((collection, file) => {
	const fileArray = file.split('\n').filter(line => line !== '')
	const fileName = fileArray[0]

	fileArray.shift()
	collection[fileName] = fileArray

	return collection
}, {})

it('basic errors reported', () => {
  assert(/Strings must use singlequote/.test(files['test/fixture/2.js'][0]), 'Detects single quotes')
  assert(/Extra semicolon/.test(files['test/fixture/2.js'][1]), 'Detects single quotes')
  assert(/no-unused-expressions/.test(files['test/fixture/2.js'][2]), 'Detects unused expressions')
  assert(/no-unused-expressions/.test(files['test/fixture/2.js'][3]), 'Detects unused expressions')
})
it('correct number of errors', () => {
  assert.equal(files['test/fixture/1.js'].length, 0, 'Proper number of errors found in fixtures/1.js')
  assert.equal(files['test/fixture/2.js'].length, 6, 'Proper number of errors found in fixtures/2.js')
})
it('Respects settings from package.json', () => {
  assert(buildLog.indexOf('testGlobal') === -1, 'Global defined in package.json is respected')
})
it('Format Option', () => {
  const compactOutput = `test/format-fixture/format.js: line 1, col 21, Error - Extra semicolon. (semi)
test/format-fixture/format.js: line 2, col 1, Error - Expected an assignment or function call and instead saw an expression. (no-unused-expressions)
2 problems`

  assert.equal(files['test/format-fixture/format.js'].join('\n'), compactOutput, 'Format option works correctly')
})
it('Fix Option', () => {
  let fixedFile = fs.readFileSync('tmp/fix-fixture/fix.js').toString()
  assert.equal(fixedFile, 'let formatJS = \'foo\'\nformatJS\n', 'Fix option works correctly')
})
it('testGenerator generators proper passing and failing tests', () => {
	const passingTestText = `
QUnit.module('Standard | 1.js');
QUnit.test('should pass Standard', function(assert) {
  assert.expect(1);
  assert.ok(true, '1.js should pass Standard');
});
`
	const failingTestText = `
QUnit.module('Standard | 2.js');
QUnit.test('should pass Standard', function(assert) {
  assert.expect(1);
  assert.ok(false, '2.js should pass Standard1:20 - Strings must use singlequote. (quotes)1:27 - Extra semicolon. (semi)2:1 - Expected an assignment or function call and instead saw an expression. (no-unused-expressions)4:1 - Expected an assignment or function call and instead saw an expression. (no-unused-expressions)');
})
`
	assert(files['test/test-generator-fixture/1.js'].join('\n').indexOf('assert.ok(true, \'1.js should pass Standard\');') !== -1, 'Generates proper passing test');
	assert(files['test/test-generator-fixture/2.js'].join('\n').indexOf(failingTestText)== -1, 'Generates proper failing test');
})
