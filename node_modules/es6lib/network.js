(function(global) { 'use strict'; const factory = function es6lib_network(exports) { // license: MIT

/**
 * Constructs an XMLHttpRequest from the given url and options and returns a Promise
 * that is fulfilled with the request once the result is loaded or canceld with an ProgressEvent if an error occurs.
 * @param {string} url     Destination url, may be omitted in favor of the url or src property of the options object.
 * @param {object} options optional object of:
 *     @property {string}  url || src        Optional replacement for the url parameter
 *     @property {string}  method            HTTP request method
 *     @property {bool}    needAbort         If trueisch, the returned Promise has an abort() method that aborts the XHR and rejects the Promise
 *     @property {bool}    xhr               Set to false to not set the 'X-Requested-With' header to 'XMLHttpRequest'
 *     @property {string}  user              HTTP user name
 *     @property {string}  password          HTTP password
 *     @property {object}  header            HTTP header key/value-pairs (strings)
 *     @property {string}  responseType      XHR response type, influences the type of the promised request.response
 *     @property {uint}    timeout           requests timeout
 *     @property {string}  overrideMimeType  overwrites the mime type of the requests body
 *     @property {any}     body              body to send with the request
 *     @property {bool}    mozAnon           mozilla privileged code only, don't send any session/login data
 *     @property {bool}    mozSystem         mozilla privileged code only, allow cross side request
 */
exports.HttpRequest = HttpRequest; function HttpRequest(url, options) { const promise = new Promise((resolve, reject) => {
	let o; if (typeof url === 'string') { o = options || { }; }
	else { o = url || { }; url = o.url || o.src; }

	const request = new XMLHttpRequest(o);

	function cancelWith(reason) {
		const error = new ProgressEvent(reason);
		request.dispatchEvent(error);
		reject(error);
	}
	o.needAbort && (promise.abort = function() {
		request.abort();
		cancelWith('canceled');
	});

	request.open(o.method || 'get', url, true, o.user, o.password);

	o.responseType            && (request.responseType = o.responseType);
	o.timeout                 && (request.timeout = o.timeout);
	o.overrideMimeType        && request.overrideMimeType(o.overrideMimeType);
	(o.xhr == null || o.xhr)  && request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	o.header                  && Object.keys(o.header).forEach(key => request.setRequestHeader(key, o.header[key]));

	request.onerror = reject;
	request.ontimeout = reject;
	request.onload = function(event) {
		if (request.status >= 200 && request.status < 300) {
			resolve(request);
		} else {
			cancelWith('bad status');
		}
	};
	request.send(o.body);
}); return promise; }

// compatibility fixes
let XMLHttpRequest, ProgressEvent;
if (global.process && global.process.versions && global.process.versions.node) {
	try { XMLHttpRequest = require('xhr'+'2'); ProgressEvent = XMLHttpRequest.ProgressEvent; } catch(_) { } /* global require */
} else {
	XMLHttpRequest = global.XMLHttpRequest || (() => { try { return require('sdk/net'+'/xhr').XMLHttpRequest; } catch(_) { return null; } })();
	try { new global.ProgressEvent(''); ProgressEvent = global.ProgressEvent; }
	catch (error) { ProgressEvent = function(reason) { const error = global.document.createEvent('ProgressEvent'); error.initEvent(reason, false, false); return error; }; }
}
HttpRequest.available = !!XMLHttpRequest;

/**
 * Converts an ArrayBuffer into a binary string, where each char represents a byte of the buffer.
 * @param  {ArrayBuffer}   buffer   The input buffer.
 * @return {string}                 String with .length === buffer.length.
 */
exports.arrayBufferToString = function arrayBufferToString(buffer) {
	buffer = new Uint8Array(buffer);
	const ret = new Array(buffer.length);
	for (let i = 0, length = buffer.length; i < length; ++i) {
		ret[i] = String.fromCharCode(buffer[i]);
	}
	return ret.join('');
};

/**
 * Map object from file extensions to mime-types.
 * @type {object}
 */
exports.mimeTypes = {
	'3gp': 'video/3gpp',
	bmp: 'image/bmp',
	css: 'text/css',
	htm: 'text/html',
	epub: 'application/epub+zip',
	flv: 'video/x-flv',
	gif: 'image/gif',
	html: 'text/html',
	ico: 'image/x-icon',
	jpeg: 'image/jpeg',
	jpg: 'image/jpeg',
	js: 'application/javascript',
	json: 'application/json',
	mp4: 'video/mp4',
	pdf: 'application/pdf',
	png: 'image/png',
	svg: 'image/svg+xml',
	ttf: 'application/octet-stream',
	txt: 'text/plain',
	webm: 'video/webm',
	woff2: 'application/font-woff2',
	woff: 'application/font-woff',
	xhtml: 'application/xhtml+xml',
};

return exports;

}; if (typeof define === 'function' && define.amd) { define([ 'exports', ], factory); } else { const exp = { }, result = factory(exp) || exp; if (typeof exports === 'object' && typeof module === 'object') { module.exports = result; } else { global[factory.name] = result; } } })((function() { return this; })()); // eslint-disable-line

