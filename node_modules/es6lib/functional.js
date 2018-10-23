(function(global) { 'use strict'; const factory = function es6lib_functional(exports) { // license: MIT
/* global performance */

/**
 * Object/Function that returns itself when called and on every property access.
 * Turns into the empty string or NaN when casted to a primitive,
 * simulates a .__proto__ of null and ignores any property assignments or definitions.
 * But it throws when preventExtensions is called on it.
 */
exports.noop = (typeof Proxy !== 'undefined') && (function(noop) {
	const target = function() { return noop; }.bind();
	delete target.name; delete target.length;

	return (noop = new Proxy(target, {
		setPrototypeOf     () { return true; },
		getPrototypeOf     () { return null; },
		preventExtensions  () { throw new TypeError(`noop needs to be extensible`); }, // need to freeze the target or throw
		defineProperty     () { return true; },
		set                () { return true; },
		has                () { return false; },
		get                (_, key) { switch (key) {
			case Symbol.toPrimitive: return function(type) { return type === 'number' ? NaN : ''; };
			case Symbol.toStringTag: return 'no-op';
			case '__proto__': return null;
			default: return noop;
		} },
	}));
})();

/**
 * @deprecated
 */
exports.apply = function apply(callback, self, args, arg) {
	try { console.error('es6lib/functional.js apply() is deprecated'); } catch (_) { }
	const haveArg = arguments.length > 3;
	switch (((args && args.length) + haveArg) || 0) {
		case 0: return self ? callback.call(self) : callback();
		case 1: return callback.call(self, haveArg ? arg : args[0]);
		case 2: return callback.call(self, args[0], haveArg ? arg : args[1]);
		case 3: return callback.call(self, args[0], args[1], haveArg ? arg : args[2]);
		default: {
			if (haveArg) {
				args = Array.prototype.slice.call(args);
				args.push(arg);
			}
			return callback.apply(self, args);
		}
	}
};

/**
 * Tests whether a function can be used as a constructor, without attempting to call that function.
 * @param  {function}  func  Function object to test.
 * @return {Boolean}         True iff func has a [[Construct]] internal method.
 *                           That is, if it returns false, then func is not a function or constructing it with new would throw 'TypeError: <local id> is not a constructor'.
 *                           If it returns true, it may still throw 'TypeError: Illegal constructor.', but is is a constructor.
 */
exports.isConstructable = isConstructable; function isConstructable(func) {
	try {
		construct(Ctor, [ ], func);
		return true;
	} catch (_) {
		return false;
	}
}
class Ctor { }
const { construct, } = Reflect;

/**
 * Console.log's it's arguments, useful to log intermediate values.
 * @param  {...any} discard  Any number of arguments that are logged and then discarded.
 * @param  {any}    retVal   The last argument that is logged and then returned.
 * @return {any}             The last argument.
 */
const log = exports.log = exports.debugLog = function log() {
	consoleLog.apply(console, arguments);
	return arguments[arguments.length - 1];
};
const { console, } = global, consoleLog = console.log;

/**
 * Returns a function that executes a callback after it has not been called for a certain time.
 * The arguments and this reference passed to the callback will be those of the last call to the returned function.
 * @param  {function}  callback  The function to call.
 * @param  {natural}   time      The cool down duration in ms.
 * @return {function}            Asynchronous, debounced version of callback.
 */
exports.debounce = debounce; function debounce(callback, time) {
	let timer = null;
	return function() {
		clearTimeout(timer);
		timer = setTimeout(() => callback.apply(this, arguments), time); // eslint-disable-line no-invalid-this
	};
}

/**
 * Wraps a (void to void) function such that it is called asynchronously and at most once every 'time' ms.
 * The callback gets called exactly once asap after any number of calls, but is never called more than once every 'time' ms
 * @param  {function}  callback  The function to wrap.
 * @param  {[type]}    time      The minimum time between two calls in milliseconds.
 * @return {[type]}              The throttled function.
 */
exports.throttle = throttle; function throttle(callback, time) {
	let pending = false, last = 0;
	return function() {
		if (pending) { return; }
		const wait = last + time - Date.now();
		pending = true;
		setTimeout(() => {
			last = Date.now();
			pending = false;
			callback();
		}, wait > 0 ? wait : 0); // mustn't be << 0 in chrome 53+
	};
}

/**
 * Systems non-absolute but continuous high resolution time
 * @return {uint}   hrtime in ms, accuracy ~µs
 */
const hrtime = exports.hrtime = (function() {
	if (typeof performance !== 'undefined') {
		return performance.now.bind(performance); // browser
	} else if (typeof global.process !== 'undefined' && typeof global.process.hrtime === 'function') {
		const { hrtime, } = global.process;
		return function () { const pair = hrtime(); return pair[0] * 1e3 + pair[1] / 1e6; }; // node
	} else {
		return require('chr' + 'ome').Cu.now; /* global require, */ // firefox add-on
	}
})();

/**
 * Timer that saves a high resolution time upon creation
 * @param    {uint}     start  start time can (but shouldn't) be passed to overwrite the start time
 * @return   {function}        function that returns the time difference between Timer creation an it's call
 * @example  timer = new Timer; doStuff(); diff1 = timer(); doMore(); diff2 = timer();
 */
exports.Timer = Timer; function Timer() {
	const start = hrtime();
	return function() { return hrtime() - start; };
}

/**
 * Counter
 * @param  {Number}   start initial counter value
 * @return {function}       a function that increments start by one at each call and returns the implemented value
 * @method {Number}   get   returns the current value (without incrementing it)
 */
exports.Counter = Counter; function Counter(start) {
	start = +start || 0;
	return Object.assign(function() { return ++start; }, { get: function() { return start; }, }); // eslint-disable-line prefer-arrow-callback
}

/**
 * Logger
 * @param {...[type]} outer first args
 */
// (...outer) => (...inner) => log(...outer, ...inner);
exports.Logger = Logger; function Logger() {
	const outer = arguments;
	return function() {
		const args = [];
		args.push.apply(args, outer);
		args.push.apply(args, arguments);
		return log.apply(null, args);
	};
}

/**
 * callback that blocks an events propagation and default action
 */
exports.blockEvent = blockEvent; function blockEvent(event) {
	event.preventDefault();
	event.stopPropagation && event.stopPropagation();
}

/**
 * Wraps a function in a simple Map based cache. The cache key is the first argument passed to the resulting function.
 * @param  {function}  func   The function whose results are to be cached.
 * @param  {Map}       cache  Optional object with .has(), .get() and .set() functions (e.g. a WeakMap or Map).
 *                            Defaults to a map that is weak for object values but also permits primitives.
 * @return {function}         The func parameter wrapped such that its return values will be cached with the first argument as the key. All arguments are forwarded to func.
 */
exports.cached = cached; function cached(func, cache) {
	cache = cache || {
		weak: new WeakMap, strong: new Map,
		for(key) { return (typeof key === 'object' && key !== null) || typeof key === 'function' ? this.weak : this.strong; },
		set(key, value) { this.for(key).set(key, value); },
		has(key) { this.for(key).has(key); },
		get(key) { this.for(key).get(key); },
	};
	return function(arg) {
		if (cache.has(arg)) { return cache.get(arg); }
		const result = func.apply(this, arguments); // eslint-disable-line no-invalid-this
		cache.set(arg, result);
		return result;
	};
}

}; if (typeof define === 'function' && define.amd) { define([ 'exports', ], factory); } else { const exp = { }, result = factory(exp) || exp; if (typeof exports === 'object' && typeof module === 'object') { module.exports = result; } else { global[factory.name] = result; } } })((function() { return this; })()); // eslint-disable-line

