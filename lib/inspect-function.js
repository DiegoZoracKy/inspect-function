#!/usr/bin/env node
'use strict';

const isArrayLike = p => p.match(/^\[+/) || null;
const isObjectLike = p => p.match(/^{+/) || null;
const matchObjectProperty = p => p.match(/^([^{]+):(.*)/) || null;
const unpackArrayOrObject = p => p.replace(/^[\[{]|[\]}]$/g, '');

const destructureParameter = (param, options) => {
	let destructured = getParametersArray(unpackArrayOrObject(param));

	if (isArrayLike(param)) {
		return destructured.map(destructuredParam => getDestructuredParameterName(destructuredParam, options));
	}

	if (isObjectLike(param)) {
		return destructured.reduce((paramValue, destructuredParam) => {
			let objectProperty = matchObjectProperty(destructuredParam);
			if(objectProperty){
				let [, key, value] = objectProperty.map(v => v.trim());
				paramValue[key] = getDestructuredParameterName(value, options);
			} else {
				paramValue[destructuredParam] = getDestructuredParameterName(destructuredParam, options);
			}

			return paramValue;
		}, {});
	}
};

const getDestructuredParameterName = (param, list) => {
	if(isArrayLike(param) || isObjectLike(param)){
		return destructureParameter(param, list);
	}

	list.push(param);
	return param;
}

function getDestructuredParametersNames(parameters) {
	const parametersNames = [];
	inspectFunction(fnTest).parameters.names.forEach(param => {
		console.log('!', getDestructuredParameterName(param, parametersNames));
	});
	return parametersNames;
}


/**
 * Returns the parameters signature stringified
 * @param  {Function} fn Function
 * @return {String} Parameters signature stringified
 */
function getParametersStringfied(fn) {
	let fnString = fn.constructor === String ? fn.replace(/\s/g, '') : fn.toString().replace(/\s/g, '');

	// Is an Arrow function with only one argument defined without parenthesis
	if (!fnString.match(/^function/) && !fnString.match(/^\(/)) {
		let matchArrowWithoutParenthesis = fnString.match(/^(.*?)=>/);
		if(matchArrowWithoutParenthesis){
			return matchArrowWithoutParenthesis[1];
		}
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

/**
 * Get parameters and its default values
 * @param  {Function} fn Function to be inspected
 * @return {Array}      Returns an Array with all parameters along with its default values
 */
function getParametersArray(paramsString) {
	let startIndex = 0;
	let skipComma = 0;

	const paramsFound = paramsString.split('').reduce((paramsFound, chr, i, arr) => {
		if (chr.match(/\[|\{|\(/)) {
			skipComma += 1;
		}

		if (chr.match(/\]|\}|\)/)) {
			skipComma -= 1;
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

function getParametersInfo(paramsArray) {
	let names = [];
	let expected = [];
	let defaultValues = {};

	paramsArray.forEach((param) => {
		let paramSplit = param.split(/=(.+)/);
		let name = paramSplit[0];
		let defaultValue = paramSplit[1];
		expected.push(name);
		if(defaultValue){
			defaultValues[name] = defaultValue;
		}

		names = names.concat(getDestructuredParameterNames(name));
	});

	return { parameters: { expected, defaultValues, names } };
}

function getDestructuredParameterNames(name){
	let desttructuredParameterNames = [];
	getDestructuredParameterName(name, desttructuredParameterNames);
	return desttructuredParameterNames;
}

function getSignatureFromParametersArray(name, paramsArray) {
	return `${name}(${paramsArray.map(v => v.replace(/^([^=]*)=/, `$1 = `)).join(', ')});`
}

function getNameFromSourceCode(fn) {
	let fnString = fn.constructor === String ? fn.replace(/(\r\n|\r|\n)/g, '') : fn.toString().replace(/(\r\n|\r|\n)/g, '');
	fnString = fnString.replace(/function\(/g, '');
	fnString = fnString.replace(/^const|let|var/, '');

	let pattern = /([^ (]*)\(/;
	let match = fnString.match(/([^ (]*)\(/);
	if(!match){
		match = fnString.match(/([^ (]*)\s?=/);
	}
	if(match){
		return match[1].trim();
	}
}

/**
 * Inspects a function and returns informations about it
 * @param  {Function} fn   Function to be inspected
 * @param  {String}   name Name of the function to be used at the result set (it will supersed the one found during the inspection)
 * @return {Object}        Returns and object with fn, name, parameters, parameters, signature
 */
function inspectFunction(fn, name) {
	name = name || fn.name || getNameFromSourceCode(fn) || '';
	const parametersDefinitions = getParametersArray(getParametersStringfied(fn));
	const { parameters } = getParametersInfo(parametersDefinitions);
	parameters.definitions = parametersDefinitions;
	const signature = getSignatureFromParametersArray(name, parametersDefinitions);

	return {
		fn: fn.constructor === Function ? fn : null,
		name,
		parameters,
		signature
	}
}

module.exports = inspectFunction;