# [broccoli](https://github.com/joliss/broccoli)-standard [![Build Status](https://travis-ci.org/arschmitz/broccoli-standard.png?branch=master)](https://travis-ci.org/arschmitz/broccoli-standard)

> Standardize your JavaScript using [Standard](https://github.com/feross/standard/)

This plugin is heavily inspired by and based on broccoli-eslint by makepanic [makepanic/broccoli-eslint](https://github.com/makepanic/broccoli-eslint).

## Install

```bash
npm install --save broccoli-standard
```

## Example

```js
var standard = require('broccoli-standard');
tree = standard(node, options);
```

## API

### standard(node, options)

#### options


##### format

Type: `String`
Default: `'eslint/lib/formatters/stylish'`

Path path to a custom formatter (See [eslint/tree/master/lib/formatters](https://github.com/eslint/eslint/tree/master/lib/formatters) for alternatives).

##### fix

Type: `Boolean`
Default: `true`

If the source and output files should be fixed with the standard fix option

##### throwOnError

Type: `Boolean`
Default: 'false'

If an error should be thrown or not when an error is found processing the file

