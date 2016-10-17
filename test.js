'use strict'
let assert = require('assert')
let fs = require('fs')
let buildLog = fs.readFileSync('broccoli-build.out').toString()

it('basic errors reported', () => {
  assert(buildLog.indexOf('Strings must use singlequote') !== -1, 'Detects single quotes')
  assert(buildLog.indexOf('Extra semicolon') !== -1, 'Detects semicolon')
})
it('correct number of errors', () => {
  assert(buildLog.split('\n').length === 14, 'Proper number of errors found')
})
it('Respects settings from package.json', () => {
  assert(buildLog.indexOf('testGlobal') === -1, 'Global defined in package.json is respected')
})
it('Format Option', () => {
  assert(buildLog.indexOf('format.js: line 1') !== -1, 'Format option works correctly')
})
it('Fix Option', () => {
  let fixedFile = fs.readFileSync('tmp/fix-fixture/fix.js').toString()
  assert(fixedFile === 'let formatJS = \'foo\'\nformatJS\n', 'Fix option works correctly')
})
