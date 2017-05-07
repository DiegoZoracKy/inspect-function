# inspect-function

[![Build Status](https://api.travis-ci.org/DiegoZoracKy/inspect-function.svg)](https://travis-ci.org/DiegoZoracKy/inspect-function)

Inspects a function and returns informations about it (e.g. name, parameters names, parameters and default values, signature).
Useful when creating automated tasks, e.g., docs generations.

## Installation

```bash
npm install inspect-function
```

## Usage

`inspectFunction(fn, name);`

```javascript
// The module
const inspectFunction = require('inspect-function');

// Just a function to test
const testFunction = (a = 'z', b = [1,2,3], c) => console.log(a,b,c);

// Inspects
const result = inspectFunction(testFunction);

// If the second param, `name`, is passed in.
// This will be the value of result.name
// `result` will be:
{
	"name": "testFunction",
	"parameters": [
		"a='z'",
		"b=[1,2,3]",
		"c"
	],
	"parametersNames": [
		"a",
		"b",
		"c"
	],
	"signature": "testFunction(a = 'z', b = [1,2,3], c);"
}
```