(function(global) { 'use strict'; const factory = function es6lib_string(exports) { // license: MIT

/**
 * Pads or truncates a string on its left/start so that string.length === length.
 * @param  {string}   string  Input, will be casted to string.
 * @param  {natural}  length  Length the output will have, defaults to string.length
 * @param  {char}     fill    String whose first character is used to add padding if needed, defaults to '0'
 * @return {string}           string of .length length
 */
exports.toFixedLength = toFixedLength; function toFixedLength(string, length, fill) {
	if (length > (string += '').length) {
		fill = fill ? (fill+'')[0] : '0';
		return fill.repeat(length - string.length) + string;
	} else {
		return string.slice(string.length - length);
	}
}

/**
 * Generates a fixed-length string of random characters to a base.
 * @param {number}  chars  The numbers of chars to return, i.e. the returned string's .length.
 * @param {number}  base   Optional. The numerical base of the random characters, encoded as [1-9a-z], must be <= 36. Default: 16.
 */
const randomHex = exports.randomHex = (function() { try {
	if (global.process && global.process.versions && global.process.versions.node) {
		const rand = require('cry'+'pto').randomBytes;
		return function randomHex(chars, base) {
			base = +base || 16;
			const data = rand(Math.ceil(chars * Math.log2(base) / 7));
			return toFixedLength(Array.prototype.map.call(data, _=>_.toString(base)).join(''), chars);
		};
	} else {
		if (!global.crypto) { require('chr'+'ome').Cu.importGlobalProperties([ 'crypto', ]); }
		const rand = global.crypto.getRandomValues.bind(global.crypto);
		const Uint32Array = global.Uint32Array;
		return function randomHex(chars, base) {
			base = +base || 16;
			const data = rand(new Uint32Array(Math.ceil(chars * Math.log2(base) / 28)));
			return toFixedLength(Array.prototype.map.call(data, _=>_.toString(base)).join(''), chars);
		};
	}
} catch (_) { return null; } })();

/**
 * Generates a cryptographically random GUID, e.g.: 6f2e78a1-c4f3-4895-858b-347f92fb2d14
 */
exports.Guid = Guid; function Guid() {
	const data = randomHex(32);
	return [ data.slice(0, 8), data.slice(8, 12), '4'+ data.slice(13, 16), '8'+ data.slice(17, 20), data.slice(20, 32), ].join('-');
}

/**
 * @param  {uint}   time input time in seconds
 * @return {string}      the time part of new Date(time * 1000).toUTCString(), hurs only if !== 0
 */
exports.secondsToHhMmSs = secondsToHhMmSs; function secondsToHhMmSs(time) {
	time = +time +.5<<0;
	const hours = Math.floor(time / 3600); time = time % 3600;
	const ret = Math.floor(time / 60) +':'+ (time % 60 < 10 ? ('0' + time % 60) : (time % 60));
	if (hours) { return hours + (ret.length > 4 ? ':' : ':0') +ret; }
	return ret;
}

/**
 * @param  {string} time hh:mm:SS.ss
 * @return {uint}        time in seconds
 */
exports.hhMmSsToSeconds = hhMmSsToSeconds; function hhMmSsToSeconds(time) {
	time = time.split(':').map(parseFloat);
	while(time.length > 1) {
		time[0] = time[1] + 60 * time.shift();
	}
	return time[0];
}

/**
 * outputs a time/duration as a human readable string like '12 ms', '3 months'
 * @param  {uint}   time
 * @param  {float}  tolerance tolerance to use smaler unit than possible, e.g. '45 days' instead of '1 month' with tolerance = 1.5
 * @return {string}           s.o.
 */
exports.timeToRoundString = timeToRoundString; function timeToRoundString(time, tolerance) {
	time = +time; tolerance = +tolerance || 1;
	const many = [ 'ms', 'seconds', 'minutes', 'hours', 'days', 'months', 'years', ];
	const one = [ 'ms', 'second', 'minute', 'hour', 'day', 'month', 'year', ];
	const sizes = [ 1000, 60, 60, 24, 30.4375, 12, Number.MAX_VALUE, ];
	if (!time) { return '0'+ many[0]; }
	let sign = '';
	if (time < 0) { time *= -1; sign = '-'; }
	let i = 0;
	while (time > sizes[i] * tolerance) {
		time = Math.floor(time / sizes[i]);
		i++;
	}
	return sign + time +' '+ (time === 1 ? one[i] : many[i]);
}

/**
 * outputs a number as a human readable string like '12.3µ', '42', '1.05T'
 * @param  {number} number  input
 * @param  {uint}   digits  significant digits in the output
 * @return {string}         s.o.
 */
const exponentAliases = { '-9': 'p', '-6': 'µ', '-3': 'm', 0: '', 3: 'k', 6: 'M', 9: 'G', 12: 'T', };
exports.numberToRoundString = numberToRoundString; function numberToRoundString(number, digits) {
	if (typeof number !== 'number') { return '0'; }
	digits = (+digits > 3) ? +digits : 3;
	const match = number.toExponential(digits + 2).match(/(-?)(.*)e(.*)/);
	const exponent = +match[3];
	const unit = Math.floor(exponent / 3) * 3;
	const shift = exponent - unit;
	const mantissa = shift ? match[2].replace(/(\d)\.(\d)(\d)(\d*)/, (x, _1, _2, _3, _R) =>
		shift === 1
		? (_1 + _2 +'.'+ _3 + _R.slice(0, digits - 3))
		: (_1 + _2 + _3 + (digits <= 3 ? '' : +'.'+ _R.slice(0, digits - 3)))
	) : match[2].slice(0, digits + 1);
	return match[1] + mantissa + (exponentAliases[unit] != null ? exponentAliases[unit] : "e"+ unit);
}

/**
 * Turns a (url) query string into an object (similar to URLSearchParams).
 * @param  {string}            query     The query string.
 * @param  {string || RegExp}  key       Sequence used to separate key/value-pairs, defaults to anyPositiveNumberOf('&', '#', '?').
 * @param  {string || RegExp}  value     Sequence used to separate keys from values, defaults to '=', value may be optional (in the query).
 * @param  {function}          decoder   Optional. Function used to decode value segments. Defaults to id function.
 * @return {QueryObject}                 QueryObject instance that has properties as read from the query.
 */
exports.QueryObject = QueryObject; function QueryObject(query, key, value, decoder) {
	value = value || '='; decoder = decoder || function(id) { return id; };
	const self = (this instanceof QueryObject) ? this : Object.create(QueryObject.prototype);
	String.prototype.split.call(query, key || (/[&#?]+/))
	.map(string => string.split(value))
	.forEach(pair => pair[0] && (self[pair[0]] = decoder(pair[1])));
	return self;
}
/**
 * Turns the QueryObject back into a query string.
 * @param  {string}    keySep    Separator between key/value-pairs, defaults to '&'.
 * @param  {string}    valueSep  Separator between key and value, defaults to '='.
 * @param  {function}  encoder   Optional function used to encode value segments.
 * @return {string}              the query string representation of this
 */
QueryObject.prototype.toString = function(keySep, valueSep, encoder) {
	const self = this;
	valueSep = valueSep || '='; encoder = encoder || function(id) { return id; };
	return Object.keys(self).map(key => {
		return key + valueSep + (self[key] !== null ? encoder(self[key]) : '');
	}).join(keySep || '&');
};

/**
 * String similarity norm, inspired by http://www.catalysoft.com/articles/StrikeAMatch.html
 * @param  {string}   s1  Commutative input.
 * @param  {string}   s2  Commutative input.
 * @param  {natural}  n   Optional. Length of sequences to match. Defaults to 2.
 * @return {float}        Similarity of s1 and s1. Between 1 iff the two strings are equal and 0 iff s1 and s2 share no substring of length >= n (for n >= 2).
 */
exports.fuzzyMatch = fuzzyMatch; function fuzzyMatch(s1, s2, n) {
	n = Math.abs(n << 0) || 2;
	const l1 = s1.length - n + 1;
	const l2 = s2.length - n + 1;
	if (l1 <= 0 || l2 <= 0) { return +(s1 === s2); }
	const used = new Array(l2);
	let total = 0;
	for (let i = 0; i < l1; ++i) {
		let j = -1;
		while ( // find s1.substr in s2 that wasn't used yet
			((j = s2.indexOf(s1.substring(i, i + n), j + 1)) !== -1)
			&& used[j]
		) { void 0; }
		if (j !== -1) {
			total++;
			used[j] = true;
		}
	}
	return (l1 + l2) ? 2 * total / (l1 + l2) : 0;
}

/**
 * Uses fuzzyMatch to determine how many of a shorter strings n-grams are uniquely contained in a longer string.
 */
exports.fuzzyIncludes = fuzzyIncludes; function fuzzyIncludes(s1, s2, n) {
	n = Math.abs(n << 0) || 2;
	const l1 = s1.length - n + 1;
	const l2 = s2.length - n + 1;
	const ll = Math.min(l1, l2);
	if (ll <= 0) { return +(s1 === s2); }
	const match = fuzzyMatch(s1, s2, n);
	return match && ll ? match / 2 * (l1 + l2) / ll : 0;
}

/**
 * Replaces HTML control characters in a string with their escape entities.
 * @param  {string}  html  A string possibly containing control characters.
 * @return {string}        A string without any control characters, whose unescapeHtml() is the input.
 */
exports.escapeHtml = exports.encodeHtml = escapeHtml; function escapeHtml(html) {
	return html.replace(htmlEscapeRegExp, c => htmlEscapeObject[c]);
}
const htmlEscapeObject = { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;', '/': '&#47;', '--': '-&#45;', };
const htmlEscapeRegExp = new RegExp(Object.keys(htmlEscapeObject).join('|'), 'g'); // also correct for multi char strings
// const htmlEscapeRegExp = new RegExp('['+ Object.keys(htmlEscapeObject).join('') +']', 'g'); // faster ??

/**
 * Decodes any HTML entities in a string with their utf8 representation.
 * Note: this function will only be present in a browser environment.
 * @param  {string}  html  The markup whose entities should be decoded.
 * @return {string}        The same markup without any HTML entities.
 */
try {
	const htmlUnscapeElement = global.document.createElement('textarea');
	exports.unescapeHtml = exports.decodeHtml = function(html) { htmlUnscapeElement.innerHTML = html; return htmlUnscapeElement.value; };
} catch (error) { }

/**
 * Escapes a string so that it can be placed within another string when generating JavaScript code.
 * @param  {string}  string  String that should be placed within another string.
 * @return {string}          Escaped string such that eval('"'+ result +'"') === string
 */
exports.escapeForString = exports.escapeString = escapeForString; function escapeForString(string) {
	return String.prototype.replace.call(string != null ? string : '', /([\\\$\`\'\"])/g, '\\$1').replace(/\n/g, '\\n\\\n');
}
exports.escapeForTemplateString = escapeForTemplateString; function escapeForTemplateString(string) {
	return String.prototype.replace.call(string != null ? string : '', /(\\|\$\{|\`)/g, '\\$1');
}

exports.toString = toString; function toString(any) {
	try {
		if (/^(boolean|number|string)$/.test(typeof any)) { return any +''; }
		if (/^function$/.test(typeof any)) { return '[function '+ (any.name || '<unnamed>') +']'; }
		if (/^symbol$/.test(typeof any)) { return any.toString(); }
		if (any === undefined) { if (arguments.length === 0 && this === exports) { return exports +''; }  return ''; } // eslint-disable-line no-invalid-this
		if (Array.isArray(any)) { return any.map(toString).join(', '); }
		const string = any +'';
		const match = /^\[object (\w+)\]$/.test(string);
		if (match) { try {
			return match[1] + JSON.stringify(any);
		} catch (e) { } }
		return string;
	} catch (e) {
		return Object.prototype.toString.call(any);
	}
}

exports.removeTags = removeTags; function removeTags(html) {
	const options = this || { }; // eslint-disable-line no-invalid-this
	const newLine = options.newLine || '\n';
	const space = options.space || '';
	const linkReplacer = options.linkReplacer || function(link, href, text) {
		return '['+ text +'] ('+ href +')';
	};
	return String.prototype.replace.call(html, /<a[^>]+?href="?([^>"]*)"?[^]*?>([^]*?)<\/a>/g, linkReplacer)
	.replace(/(<\/?.*?>)+/g, tag => (/<(?:br|\/div)>/).test(tag) ? newLine : space);
}

exports.removeEmptyLines = removeEmptyLines; function removeEmptyLines(string) { // TODO: test
	String.prototype.replace.call(string != null ? string : '', (/(\n|\r|\r\n)([ \t]*(\n|\r|\r\n))+/g), '$1');
}

}; if (typeof define === 'function' && define.amd) { define([ 'exports', ], factory); } else { const exp = { }, result = factory(exp) || exp; if (typeof exports === 'object' && typeof module === 'object') { module.exports = result; } else { global[factory.name] = result; } } })((function() { return this; })()); // eslint-disable-line
