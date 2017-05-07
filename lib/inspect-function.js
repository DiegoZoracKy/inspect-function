#!/usr/bin/env node

'use strict';

function getParametersStringfied(fn) {
	let fnString = fn.toString().replace(/\s/g, '');

	// Is an Arrow function with only one argument defined without parenthesis
	if (!fnString.match(/^function/) && !fnString.match(/^\(/)) {
		return fnString.match(/^(.*?)=>/)[1];
	}

	let positionOfOpeningParenthesis;
	let positionOfClosingParenthesis;
	let nextParenthesisIsOk = true;

	let fnStringChrs = fnString.split('');
	for (let i = 0; i < fnStringChrs.length; i++) {
		const chr = fnStringChrs[i];

		if (typeof positionOfOpeningParenthesis === 'undefined' && chr === '(') {
			positionOfOpeningParenthesis = i;
			continue;
		}

		if (nextParenthesisIsOk && chr === '(') {
			nextParenthesisIsOk = false;
			continue;
		}

		if (!nextParenthesisIsOk && chr === ')') {
			nextParenthesisIsOk = true;
			continue;
		}

		if (nextParenthesisIsOk && chr === ')') {
			positionOfClosingParenthesis = i;
			nextParenthesisIsOk = true;
			break;
		}

	}

	return fnString.substring(positionOfOpeningParenthesis + 1, positionOfClosingParenthesis);
}

function getParametersArray(fn) {
	const paramsString = getParametersStringfied(fn);
	let startIndex = 0;
	let skipComma;

	const paramsFound = paramsString.split('').reduce((paramsFound, chr, i, arr) => {
		if (chr.match(/\[|\{|\(/)) {
			skipComma = true;
		}

		if (chr.match(/\]|\}|\)/)) {
			skipComma = false;
		}

		if (!skipComma && (chr === ',' || i === arr.length - 1)) {
			const lastIndex = i === arr.length - 1 ? i + 1 : i;
			const paramFound = paramsString.substring(startIndex, lastIndex);
			startIndex = lastIndex + 1;
			paramsFound.push(paramFound);
		}
		return paramsFound;
	}, []);

	return paramsFound;
}

function getNamesFromParametersArray(paramsArray) {
	return paramsArray.map(v => v.match(/^[^=]+/)[0]);
}

function getSignatureFromParametersArray(name, paramsArray) {
	return `${name}(${paramsArray.map(v => v.replace(/^([^=]*)=/, `$1 = `)).join(', ')});`
}

function inspectFunction(fn, name) {
	name = name || fn.name || '';
	const parameters = getParametersArray(fn);
	const parametersNames = getNamesFromParametersArray(parameters);
	const signature = getSignatureFromParametersArray(name, parameters);

	return {
		fn,
		name,
		parameters,
		parametersNames,
		signature
	}
}

module.exports = inspectFunction;