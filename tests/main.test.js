#!/usr/bin/env node
'use strict';

const inspectFunction = require('../');
const assert = require('assert');

describe('inspectFunction', function() {

	const functionsSchemas = getTestData();

	Object.keys(functionsSchemas).forEach(key => {
		const inspectResult = inspectFunction(functionsSchemas[key][key]);

		describe(`${inspectResult.signature}`, function() {
			it(`Must find the same length of parameters`, function() {
				assert.equal(functionsSchemas[key].parameters.length, inspectResult.parameters.length);
			});

			it(`Must find the same parameters names`, function() {
				functionsSchemas[key].parameters.sort();
				inspectResult.parametersNames.sort();
				assert.equal(true, functionsSchemas[key].parameters.every((param, i) => param === inspectResult.parametersNames[i]));
			});
		});

	});

});



function getTestData(){
	const functionsSchemas = {
		arrowWithoutParenthesis: {
			parameters: ['param'],
			arrowWithoutParenthesis: param => console.log(a)
		},

		arrow: {
			parameters: ['paramA', 'paramB', 'c'],
			arrow: (paramA, paramB, c) => console.log(a, b, c)
		},

		arrowWithBraces: {
			parameters: ['a', 'b', 'c'],
			arrowWithBraces: (a, b, c) => {
				return console.log(a, b, c)
			}
		},

		arrowWithoutParenthesisWithBraces: {
			parameters: ['a'],
			arrowWithoutParenthesisWithBraces: a => {
				return console.log(a)
			}
		},

		function: {
			parameters: ['a', 'b', 'c'],
			function: function(a, b, c){
				console.log(a, b, c)
			}
		},

		functionWithName: {
			parameters: ['a'],
			functionWithName: function withName(a) {
				console.log(a)
			}
		},

		arrowWithBracesWithDefaultParameters: {
			parameters: ['option', 'a', 'b', 'arr', 'arr2', 'e', 'z'],
			arrowWithBracesWithDefaultParameters: (option, a = 2, b= {c:1}, arr = ([]), arr2 = [1,2,3], e = { a: {
				b: 3,
				d: ([{}])}
			},z) => (a = 2, b= {c:1}, arr = [], d =function(z){}, e = { a: {
				b: 3,
				d: x => x}
			}, fn = d => s, fn2 = d => {return s})
		},

		functionWithDefaultParameters: {
			parameters: ['option', 'a', 'b', 'arr', 'e', 'z'],
			functionWithDefaultParameters: function (option, a = 2, b= {c:1}, arr = ([]), e = { a: {
				b: 3,
				d: ([{}])}
			},z) {return (a = 2, b= {c:1}, arr = [], d =function(z){}, e = { a: {
				b: 3,
				d: x => x}
			}, fn = d => s, fn2 = d => {return s})}
		},

		functionWithNameWithDefaultParameters: {
			parameters: ['option', 'a', 'b', 'arr', 'e', 'z'],
			functionWithNameWithDefaultParameters: function someFnName(option, a = 2, b= {c:1}, arr = ([]), e = { a: {
				b: 3,
				d: ([{}])}
			},z) { return (a = 2, b= {c:1}, arr = [], d =function(z){}, e = { a: {
				b: 3,
				d: x => x}
			}, fn = d => s, fn2 = d => {return s})}
		},

		functionsWithHardDefaultParameters: {
			parameters: ['option', 'bz', 'arr', 'arr2', 'dk', 'e', 'fn', 'fn2', '[destru,cturing]', 'c', '{dd,ee,ff}', 'g'],
			functionsWithHardDefaultParameters: function (option = 2, bz= {c:1}, arr = [], arr2=[1,2,4], dk =function(z){}, e = { a: {
				b: 3,
				d: x => x}
			}, fn = d => s, fn2 = d => {return s}, [destru, cturing]= [1], c, {dd, ee , ff} = {dd: {b: 1, c:2, arr:[1,6]}}, g) {  return  (x = 2, b= {c:1}, arr = [], d =function(z){}, e = { a: {
				b: 3,
				d: x => x}
			}, fn = d => s, fn2 = d => {return z})}
		},

		functionsWithNameWithHardDefaultParameters: {
			parameters: ['option', 'bz', 'arr', 'arr2', 'dk', 'e', 'fn', 'fn2', '[destru,cturing]', 'c', '{dd,ee,ff}', 'g'],
			functionsWithNameWithHardDefaultParameters: function someFnName(option = 2, bz= {c:1}, arr = [...z, ...k], arr2=[1,2,4, ...k], dk =function(z){}, e = { a: {
				b: 3,
				d: x => x}
			}, fn = d => s, fn2 = d => {return s}, [destru, cturing]= [1], c, {dd, ee , ff} = {dd: {b: 1, c:2, arr:[1,6]}}, g) {  return  (x = 2, b= {c:1}, arr = [], d =function(z){}, e = { a: {
				b: 3,
				d: x => x}
			}, fn = d => s, fn2 = d => {return z})}
		},

		arrowWithBracesWithHardDefaultParameters: {
			parameters: ['option', 'bz', 'arr', 'arr2', 'dk', 'e', 'fn', 'fn2', '[destru,cturing]', 'c', '{dd,ee,ff}', 'g'],
			arrowWithBracesWithHardDefaultParameters: (option = 2, bz= {c:1}, arr = [...z], arr2=[1,2,4,...k], dk =function(z){}, e = { a: {
				b: 3,
				d: x => x}
 			}, fn = d => s, fn2 = d => {return s}, [destru, cturing]= [1], c, {dd, ee , ff} = {dd: {b: 1, c:2, arr:[1,6]}}, g) => {  return  (x = 2, b= {c:1}, arr = [], d =function(z){}, e = { a: {
				b: 3,
				d: x => x}
			}, fn = d => s, fn2 = d => {return z})}
		}
	};

	return functionsSchemas;
}