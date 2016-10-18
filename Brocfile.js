module.exports = function (broccoli) {
  const standard = require('./lib/index')
  const mergeTrees = require('broccoli-merge-trees')

  // lint plugin code
  const plugin = standard('lib',{logOutput:true})

  // Tests
  const test = standard('test/fixture',{logOutput:true})

  const format = standard('test/format-fixture', {
    format: 'eslint/lib/formatters/compact',
    logOutput:true
  })

  const fix = standard('tmp/fix-fixture', {
    fix: true,
    logOutput:true
  })

  const testGenerator = standard('test/test-generator-fixture', {
    testGenerator: 'qunit',
    logOutput:true
  })

  return mergeTrees([plugin, test, format, fix, testGenerator], { overwrite: true })
}
