'use strict'
let assert = require('assert')
let fs = require('fs')
let buildLog = fs.readFileSync('broccoli-build.out').toString()

it('basic errors reported', () => {
  assert(buildLog.indexOf('Strings must use singlequote') !== -1, 'Detects single quotes')
  assert(buildLog.indexOf('Extra semicolon') !== -1, 'Detects semicolon')
})
it('correct number of errors', () => {
  assert.equal(buildLog.split('\n').length, 30, 'Proper number of errors found')
})
it('Respects settings from package.json', () => {
  assert(buildLog.indexOf('testGlobal') === -1, 'Global defined in package.json is respected')
})
it('Format Option', () => {
  assert(buildLog.indexOf('format.js: line 1') !== -1, 'Format option works correctly')
})
it('Fix Option', () => {
  let fixedFile = fs.readFileSync('tmp/fix-fixture/fix.js').toString()
  assert.equal(fixedFile, 'let formatJS = \'foo\'\nformatJS\n', 'Fix option works correctly')
})
it('testGenerator generators proper passing and failing tests', () => {
	assert(buildLog.indexOf('assert.ok(true, \'1.js should pass Standard\');') !== -1, 'Generates proper passing test');
	assert(buildLog.indexOf('assert.ok(false, \'2.js should pass Standard1:20 - Strings must use singlequote. (quotes)1:27 - Extra semicolon. (semi)\');') !== -1, 'Generates proper failing test');
})
