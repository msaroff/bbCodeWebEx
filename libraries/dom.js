(function(global) { 'use strict'; const factory = function es6lib_dom(exports) { // license: MIT

/**
 * The functions in this module use the global windows context (document, URL, self, top, etc.) by default.
 * To have any of the functions of this module operate on a different scope, call them with that scope as this,
 * e.g. `cerateElement.call(iframe.contentWindow, 'a', { ...});` to create an Element in an iframe.
 */
exports.window = global.window;
/* eslint-disable no-invalid-this */

/**
 * Creates a DOM Element and sets properties/attributes and children.
 * @param  {string}          tagName     Type of the new Element to create.
 * @param  {object}          properties  Optional. Object (not Array) of properties, which are deeply copied onto the new element.
 * @param  {Array<Element>}  childList   Optional. Array of elements or strings (as Text nodes) to set as the children of the new element. Nested Array are recursively flattened.
 * @return {Element}                     The new DOM element.
 */
exports.createElement = createElement; function createElement(tagName, properties, childList) {
	const document = (this || global).window.document;
	const element = document.createElement(tagName);
	if (Array.isArray(properties)) { childList = properties; properties = null; }
	properties && (function assign(target, source) { Object.keys(source).forEach(key => {
		const value = source[key], now = target[key];
		if (typeof value === 'object' && (typeof now === 'object' || typeof now === 'function')) {
			assign(now, value);
		} else {
			target[key] = value;
		}
	}); })(element, properties);
	childList && (function append(child) {
		if (Array.isArray(child)) { child.forEach(append); return; }
		child && element.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
	})(childList);
	return element;
}

/**
 * Creates a new style Element of the given css string.
 */
exports.createStyleElement = createStyleElement; function createStyleElement(css) {
	const element = (this || global).window.document.createElement('style');
	element.type = 'text/css';
	element.textContent = css;
	return element;
}

/**
 * Adds a css string to the document.
 * @param {string}  css  Style to add to the end of the document head.
 * @return {Element}     The new style Element.
 */
exports.addStyle = addStyle; function addStyle(css) {
	return (this || global).window.document.querySelector('head').appendChild(createStyleElement(css));
}

/**
 * Triggers a 'click' event on a DOM Element, often causing it's default click action.
 * @return {Element}         The clicked Element
 */
exports.clickElement = clickElement; function clickElement(element) {
	const evt = (this || global).window.document.createEvent('MouseEvents');
	evt.initEvent('click', true, true);
	element.dispatchEvent(evt);
	return element;
}

/**
 * Invokes a save dialog for a Blob or an Url object or strings target.
 * @param  {Blob|Url|string}  content  The Blob or url to save.
 * @param  {string}           name     The suggested file name.
 */
exports.saveAs = saveAs; function saveAs(content, name) {
	const window = (this || global).window;
	const isBlob = typeof content.type === 'string';

	const link = Object.assign(window.document.createElement('a'), {
		download: name,
		target: '_blank', // fallback
		href: isBlob ? window.URL.createObjectURL(content) : content,
	});
	clickElement.call(window, link);
	isBlob && global.setTimeout(() => window.URL.revokeObjectURL(link.href), 1000);
}

/**
 * Attempts to open a file picker dialog. Usually requires a direct user action to succeed.
 * @param  {object?}          options  An optional object whose properties are copied to the underlying input element.
 *                                     Useful properties are 'accept' and 'multiple'.
 * @return {Promise<File>}             A Promise to a (possibly empty) Array of Files.
 *                                     Should reject if the dialog fails to open.
 */
exports.loadFile = loadFile; function loadFile(options) { return new Promise((resolve, reject) => {
	const window = (this || global).window, document = window.document; let done = false, open = false;

	const input = Object.assign(document.createElement('input'), { type: 'file', }, options);
	function onBlur() { open = true; } // file picker has opened
	const timer = global.setTimeout(() => {
		if (open || remove()) { return; }
		// file picker didn't open or change
		reject(new Error('Could not select file'));
	}, 500);
	function onFocus() { global.setTimeout(() => {
		if (remove()) { return; }
		resolve([ ]); // file picker was opened and closed, but no files were selected
	}, 500); } // after dialog close, wait for 'change'
	function onChange(event) { try {
		if (remove()) { return; }
		resolve(Array.from(input.files)); // actually got file(s)
	} catch (error) { reject(error); } }
	function remove() {
		if (done) { return true; } done = true;
		global.clearTimeout(timer);
		input.removeEventListener('change', onChange);
		window.removeEventListener('focus', onFocus);
		window.removeEventListener('blur', onBlur);
		input.remove();
		return false;
	}
	input.addEventListener('change', onChange);
	window.addEventListener('focus', onFocus);
	window.addEventListener('blur', onBlur);
	document.head.appendChild(input);
	clickElement.call(window, input);
}); }

/**
 * Loads the data referenced by a Blob (or File) object.
 * @param  {Blob}    blob  The Blob to read.
 * @param  {string}  type  Optional. The type/encoding of the returned data. May be 'string' (default, utf8),
 *                         'arrayBuffer', 'dataURL' or any string encoding accepted by <FileReader>.readAsText(..., type).
 * @return {Promise<String|ArrayBuffer}  Promise to the data read.
 */
exports.readBlob = readBlob; function readBlob(blob, type) {
	return new Promise(function(resolve, reject) {
		const reader = new (this || global).window.FileReader;
		reader.onerror = reject;
		reader.onloadend = () => resolve(reader.result);

		if (type == null || type === 'string') {
			reader.readAsText(blob);
		} else if ((/^dataU[rR][iIlL]$/).test(type)) {
			reader.readAsDataURL(blob);
		} else if ((/^(?:arrayB|b)uffer$/).test(type)) {
			reader.readAsArrayBuffer(blob);
		} else {
			reader.readAsText(blob, type);
		}
	});
}

/**
 * Attempts to write data to the users clipboard.
 * @param  {string|object}  data  Ether a plain string or an object of multiple pairs { [mimeType]: data, } to write.
 * @param  {natural}        time  Optional. Maximum runtime of this asynchronous operation after which it will be canceled and rejected.
 * @return {Promise}              Promise that rejects if the timeout or an error occurred. If it resolves the operation should have succeeded.
 */
exports.writeToClipboard = writeToClipboard; function writeToClipboard(data, time) { return new Promise(function(resolve, reject) {
	const document = (this || global).window.document; let done = false;
	function onCopy(event) { try {
		if (done) { return; } done = true;
		document.removeEventListener('copy', onCopy);
		const transfer = event.clipboardData;
		transfer.clearData();
		if (typeof data === 'string') {
			transfer.setData('text/plain', data);
		} else {
			Object.keys(data).forEach(mimeType => transfer.setData(mimeType, data[mimeType]));
		}
		event.preventDefault();
		resolve();
	} catch (error) { reject(error); } }
	global.setTimeout(() => {
		if (done) { return; } done = true;
		document.removeEventListener('copy', onCopy);
		reject(new Error('Timeout after '+ (time || 1000) +'ms'));
	}, time || 1000);
	document.addEventListener('copy', onCopy);
	document.execCommand('copy', false, null);
}); }

/**
 * Attempts to read data from the users clipboard.
 * @param  {string|[string]|null}   types  An optional (Array of) mime types to read.
 * @param  {natural}                time   Optional. Maximum runtime of this asynchronous operation after which it will be canceled and rejected.
 * @return {Promise<string|object>}        Promise to the current clipboard data as string. If types was an array, it returns an object of { [mimeType]: data, } pairs.
 */
exports.readFromClipboard = readFromClipboard; function readFromClipboard(types, time) { return new Promise(function(resolve, reject) {
	const document = (this || global).window.document; let done = false;
	function onPaste(event) { try {
		if (done) { return; } done = true;
		document.removeEventListener('paste', onPaste);
		const transfer = event.clipboardData;
		if (typeof types === 'string' || !types) {
			resolve(transfer.getData(types || 'text/plain'));
		} else {
			resolve(types.reduce((data, mimeType) => ((data[mimeType] = transfer.getData(mimeType)), data), { }));
		}
		event.preventDefault();
	} catch (error) { reject(error); } }
	global.setTimeout(() => {
		if (done) { return; } done = true;
		document.removeEventListener('paste', onPaste);
		reject(new Error('Timeout after '+ (time || 1000) +'ms'));
	}, time || 1000);
	document.addEventListener('paste', onPaste);
	document.execCommand('paste', false, null);
}); }

/**
 * Listen for a DOM Event on an Element only once and removes the listener afterwards.
 */
exports.once = once; function once(element, event, callback, capture) {
	function handler() {
		element.removeEventListener(event, handler, capture);
		callback.apply(this, arguments);
	}
	element.addEventListener(event, handler, capture);
	return handler;
}

exports.whileVisible = whileVisible; function whileVisible(callback, time) {
	let handle; const document = (this || global).window.document;
	function check() {
		if (document.hidden) {
			handle && global.clearInterval(handle); return;
		} else {
			!handle && (handle = global.setInterval(callback, time));
		}
	}
	check();
	document.addEventListener('visibilitychange', check);
	return function cancel() {
		document.addEventListener('visibilitychange', check);
		handle && global.clearTimeout(handle);
	};
}

/**
 * Get the closest parent element (or the element itself) that matches a selector.
 * @param  {Element}  element   The child element whose parent is searched for
 * @param  {string}   selector  The selector the parent has to match
 * @return {Element||null}      'element', if it matches 'selector' or the first parent of 'element' that matches 'selector', if any
 */
exports.getParent = getParent; function getParent(element, selector) {
	while (element && (!element.matches || !element.matches(selector))) { element = element.parentNode; }
	return element;
}

/**
 * Builds the strongest possible selector of tagNames, ids and classes for an Element (at its current position in the document).
 * @param  {Element}  element  The Element in question.
 * @return {string}            String that matches /^(?!>)((?:^|>){{tagName}}(#{{id}})?(.{{class}})*)*$/
 */
exports.getSelector = getSelector; function getSelector(element) {
	const document = element.ownerDocument, strings = [ ];
	while (element && element !== document) {
		strings.add(
			element.tagName
			+ (element.id ? '#'+ element.id : '')
			+ (element.className ? '.'+ element.className.replace(/ +/g, '.') : '')
		);
		element = element.parentNode;
	}
	return strings.join('>');
}


exports.notify = notify; function notify(options) {
	const window = (this || global).window, Notification = window.Notification;
	return new Promise((resolve, reject) => {
		function doIt() {
			const self = new Notification(options.title, options);
			self.onclick = resolve;
			self.onerror = reject;
			self.onclose = reject;
			self.onshow = global.clearTimeout.bind(null, global.setTimeout(reject, options.timeout || 1500));
		}

		if (Notification.permission === 'granted') {
			doIt();
		} else if (Notification.permission !== 'denied') {
			Notification.requestPermission(permission => {
				if (permission === 'granted') {
					doIt();
				} else {
					reject(new Error('Permission denied'));
				}
			});
		} else  {
			reject(new Error('Permission denied'));
		}
	});
}

/**
 * Promise that resolves once the 'DOMContentLoaded' event is/was fired.
 */
exports.DOMContentLoaded = new Promise((resolve, reject) => {
	const document = global.document;
	if (typeof document !== 'object') { reject(new Error('No `document` global')); return; }
	if (document.readyState !== 'interactive' && document.readyState !== 'complete') {
		document.addEventListener('DOMContentLoaded', resolve);
	} else {
		resolve();
	}
});

}; if (typeof define === 'function' && define.amd) { define([ 'exports', ], factory); } else { const exp = { }, result = factory(exp) || exp; if (typeof exports === 'object' && typeof module === 'object') { module.exports = result; } else { global[factory.name] = result; } } })((function() { return this; })()); // eslint-disable-line

