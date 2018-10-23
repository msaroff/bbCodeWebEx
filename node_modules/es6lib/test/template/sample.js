/* eslint-disable */ 'use strict';
/* global requireEs6 */

const { TemplateEngine, ForEach, ForOf, While, If, Value, Index, Key, Call, End, NoMap, } = require('./../../template/engine.js');


const test = exports.test = arg => (new TemplateEngine(
	arg && new String.constructor('return '+ arg)()
	|| { trim: 'parts', mapper: s => '['+ s +']', }
))`
beforestart ${ 'veryfirst' } docStart
${ ForEach('outer', ['first', 'second', 'third']) }
	1stLine ${ Value }
	${ ForEach('inner', ['alpa', 'betha', 'gamma']) }
		${ If(Call([Index('outer'), Index('inner')], (a, b) => (a == b))) }
			2ndLine ${ Value } 2ndEnd (${ Index('outer') })

			newLine
		${ End.If }
		${ Call([Value('outer'), Value('inner')], (o, i) => o+i) }
		${ ForOf('reverse', { first: 'tsrif', second: 'dnoces', third: 'driht', }) }
			${ If(Call([Value('outer'), Key('reverse')], (v, k) => (v === k))) }
				key: ${ Key }, value: ${ Value }
			${ End.If }
		${ End.ForOf }
	${ End.ForEach }
	1stEnd
${ End.ForEach }

${ While(function*(){
	yield 1;
	yield 2;
	yield 3;
	return 'not iterated';
}) }
	${ Index }: ${ Value }
	${ If((v, i, a) => a[i-1]) }
		(prev: ${ Call((v, i, a) => a[i-1]) })
	${ End }
${ End }
<!-- ${ NoMap('just a unmapped value') } -->
docEnd ${ 'varylast' } afterend`;
