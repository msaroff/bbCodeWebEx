(function(global) { 'use strict'; const factory = function es6lib_concurrent(exports) { // license: MIT

const P_resolve = Promise.resolve.bind(Promise), P_reject = Promise.reject.bind(Promise), resolved = P_resolve();

const SymbolIterator = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ? Symbol.iterator : '[[Symbol.iterator]]';

const setTimeout = global.setTimeout || (function() { try { return require('sdk/'+'timers').setTimeout; } catch (_) { return null; } });

const Self = new WeakMap;

/**
 * Returns a new Promise that has its `resolve` and `reject` functions as own properties.
 */
exports.Resolvable = Resolvable; function Resolvable() {
	let resolve, reject; const promise = new Promise((_y, _n) => ((resolve = _y), (reject = _n)));
	promise.resolve = resolve;
	promise.reject = reject;
	return promise;
}

/**
 * Returns a new Promise with its `resolve` and `reject` functions as an object of { promise, resolve, reject, }.
 */
exports.PromiseCapability = PromiseCapability; function PromiseCapability() {
	let resolve, reject; const promise = new Promise((_y, _n) => ((resolve = _y), (reject = _n)));
	return { promise, resolve, reject, };
}

/**
 * @param  {natural}  ms  Time to "sleep" in milliseconds
 * @return {Promise}      Resolves to undefined after 'ms' milliseconds
 */
exports.sleep = sleep; function sleep(ms) {
	return new Promise(done => setTimeout(done, ms));
}

/**
 * Returns a Promise that resolves to whether a promise resolves or rejects.
 * @param  {Promise<any>}      promise  A Promise that may resolve or reject.
 * @return {Promise<boolean>}           A Promise that resolves to: true if promise rejects and false if promise resolves.
 */
exports.rejects = rejects; function rejects(promise) {
	return P_resolve(promise).then(() => false, () => true);
}

/**
 * Returns a Promise that resolves to whether the first promise resolves before the second.
 * @param  {Promise<any>}      _true   Promise whose resolution results in true.
 * @param  {Promise<any>}      _false  Promise whose resolution results in false.
 * @return {Promise<boolean>}          A Promise that resolves to true/false as described above, or rejects if either Promise rejects first.
 */
exports.before = before; function before(_true, _false) {
	return Promise.race([ P_resolve(_true).then(() => true), P_resolve(_false).then(() => false), ]);
}

/**
 * Returns a new node-style callback with a 'promise' property that will be resolved/rejected when the callback gets called.
 */
exports.promiseCallback = promiseCallback; function promiseCallback() {
	let callback; const promise = new Promise((resolve, reject) => (callback = function(err, res) {
		err ? reject(err) : resolve(res);
	}));
	callback.promise = promise;
	return callback;
}

/**
 * Turns an asynchronous callback method into one that returns a promise
 * @param  {function}  callUlater  Method that takes an callback(error, value) as last argument
 * @return {function}              Method that returns a Promise to it's asynchronous value
 */
exports.promisify = promisify; function promisify(callUlater) {
	return function promisifyed(/*arguments*/) {
		return new Promise((resolve, reject) => {
			callUlater.call(this, ...arguments, (err, res) => err ? reject(err) : resolve(res)); // eslint-disable-line no-invalid-this
		});
	};
}

exports.promisifyAll = promisifyAll; function promisifyAll(object, prefix, keys) {
	prefix = prefix || '';
	keys = keys || Object.keys(object);
	keys.forEach(key => (object[prefix + key] = promisify(object[key])));
}

/**
 * Turns a method that returns a promise into one that accepts a callback as last parameter.
 * @param  {function}  promiser  Method that returns a Promise to it's asynchronous value
 * @return {function}            Method that takes an callback(error, value) as last argument
 */
exports.promised = promised; function promised(promiser) {
	return function(/*...args, callback*/) {
		const callback = Array.prototype.pop.call(arguments);
		promiser.apply(this, arguments) // eslint-disable-line no-invalid-this
		.then(callback.bind(null, null), callback);
	};
}

/**
 * Asynchronous task spawner. Subset of Task.js. Executes immediately.
 * @param  {function*}  generator  Generator function that yields promises to asynchronous values which are returned to the generator once the promises are fulfilled
 * @param  {object}     thisArg    'this' in generator
 * @param  {Arguments}  args       Arguments for generator
 * @return {Promise}               Promise of the return value of the generator
 */
exports.spawn = spawn; function spawn(generator, thisArg, args, callSync) {
	const iterator = apply(generator, thisArg, args || [ ]);

	function next(arg) {
		return handle(iterator.next(arg));
	}
	function _throw(arg) {
		return handle(iterator.throw(arg));
	}
	function handle(result) {
		if (result.done) {
			return P_resolve(result.value);
		} else {
			return P_resolve(result.value).then(next, _throw);
		}
	}

	if (callSync) {
		try { return next(undefined); } catch (error) { return P_reject(error); }
	} else {
		return resolved.then(next);
	}
}
const { apply, } = Reflect;

/**
 * Asynchronous task spawner. Subset of Task.js. Executes when called. Forwards this and arguments.
 * @param  {function*}         generatorFunc      Generator function that yields promises to asynchronous values which are returned to the generator once the promises are fulfilled.
 * @param  {function|object}   options
 * @param  {function}          options.catch      Function that can .catch() exceptions thrown in generator. Default if `options` is a function.
 * @param  {bool}              options.callSync   If trueisch, the first step into the `generatorFunc` will happen synchronously (and may throw synchronously);
 * @return {function}                     Async (member) function.
 */
const _async = exports.async = exports._async = function _async(generator, options = { }) {
	return options.catch
	? function async(/*arguments*/) {
		return spawn(generator, this, arguments, options.callSync).catch(options.catch); // eslint-disable-line no-invalid-this
	}
	: function async(/*arguments*/) {
		return spawn(generator, this, arguments, options.callSync); // eslint-disable-line no-invalid-this
	};
};

/**
 * Creates an async class constructor with async methods and accessors.
 * @param  {function}        constructor  Optional, may be omitted. The class constructor. If it is a GeneratorFunction, it will be wrapped in a class
 *                                        (with a new prototype) that spawns that Generator, otherwise it will be used directly as a normal constructor.
 *                                        If omitted, the `.constructor` property of `prototype` will be used instead.
 * @param  {function|null}   extending    Optional, may be omitted, only allowed if `constructor` is a Generator. The base class that should be extended.
 * @param  {object}          prototype    Object whose propertyDescriptors will be copied onto the resulting classes .prototype.
 *                                        Any Generators as value, getter or setter will be wrapped with `async()`.
 *                                        The new Properties will be created as non-enumerable.
 *                                        If `constructor` and `extending` are omitted, the `.constructor` and `.extends` properties of `prototype`
 *                                        will be used instead and be deleted afterwards.
 * @return {class|function}               The new or modified constructor. @see `constructor` param
 */
exports.asyncClass = asyncClass; function asyncClass(constructor, extending, prototype) {
	if (arguments.length === 1) {
		prototype = constructor; constructor = prototype.constructor;
		extending = prototype.extends === undefined ? Object : prototype.extends;
		delete prototype.constructor; delete prototype.extends;
	}
	if (arguments.length === 2) { prototype = extending; extending = Object; }

	const ctor = !isGenerator(constructor) ? constructor
	: class ctor extends extending {
		constructor(/*arguments*/) {
			return P_resolve(extending ? super() : null) // eslint-disable-line constructor-super
			.then(() => spawn(constructor, this, arguments))
			.then(value =>
				value != null && (typeof value === 'object' || typeof value === 'function')
				? value : this
			);
		}
	};
	Object.defineProperty(ctor, 'name', { value: constructor.name, });
	Object.defineProperty(ctor, 'length', { value: constructor.length, });
	Object.keys(prototype).forEach(key => {
		const desc = Object.getOwnPropertyDescriptor(prototype, key);
		if ('value' in desc) {
			const { value, } = desc;
			if (isGenerator(value)) { desc.value = _async(value); }
		} else { // accessors
			const { get, set, } = desc;
			if (isGenerator(get)) { desc.get = _async(get); }
			if (isGenerator(set)) { desc.set = _async(set); }
		}
		desc.enumerable = false;
		Object.defineProperty(ctor.prototype, key, desc);
	});
	return ctor;
}
function isGenerator(func) {
	return typeof func === 'function' && func.constructor && func.constructor.name === 'GeneratorFunction';
}

/**
 * Turns a readable Stream into an asynchronous iterator over it's 'data' and 'end' events.
 * Receives and yields the values of 'data' events until after ether 'end' or 'error' is emitted.
 * If the Stream ends due to 'error', a P_reject(error) is returned as the last value.
 * If the Stream ends due to 'end', that events data is returned as the last value.
 * To stop listening on the stream, end the iterator and clear it's data, call throw().
 * Do not call next() while the previous promise is pending.
 * @param   {stream}    stream  EventEmitter, that emits 'data' and an 'end' event.
 */
const StreamIterator = exports.StreamIterator = class StreamIterator {

	// TODO: re-write class and constructor documentation block
	constructor(stream, options = { }) {
		options.setStream !== false && Object.defineProperty(this, 'stream', { value: stream, enumerable: true, });
		const self = {
			events: {
				next  : options.next   ? Array.isArray(options.next)   ? options.next   : [ options.next,   ] : [ 'data', ],
				throw : options.throw  ? Array.isArray(options.throw)  ? options.throw  : [ options.throw,  ] : [ 'error', ],
				return: options.return ? Array.isArray(options.return) ? options.return : [ options.return, ] : [ 'end', ],
			},
			stream: stream,
			buffer: [ ],
			done: false,

			promise: null,
			nextData: null,

			next(data) {
				if (self.done) { return; }
				if (self.promise) {
					self.nextData(data);
					self.promise = self.nextData = null;
				} else {
					self.buffer.push(P_resolve(data));
				}
			},
			throw(error) {
				self.return(P_reject(error));
			},
			return(data) {
				if (self.done) { return; }
				if (data != null) { self.next(data); }
				self.done = true;
				self.promise = self.nextData = null;
				const { stream, } = self;
				Object.keys(self.events).forEach(type => self.events[type].forEach(event => stream.on(event, self[type])));
			},
		};
		Self.set(this, self);

		Object.keys(self.events).forEach(type => self.events[type].forEach(event => stream.on(event, self[type])));

		stream.resume && stream.resume(); // TODO: should this stay?
	}

	/**
	 * Returns an iteration result containing a Promise to the next value that was or will be emitted by this.stream.
	 * If the stream emits an error event, the returned 'value' is a Promise rejected with that error exactly once, after all previously emitted data has been consumed.
	 * After ended or emitted an error, the 'value' will be null, not a Promise to null, and 'done' will me true.
	 * The value/error emitted in the last event will not have 'done' set to true.
	 * @return  {IteratorResult}  Object literal of { value, done, }.
	 * @throws  {Error}           If .next() is called while the previously returned value is still pending.
	 */
	next() {
		const self = Self.get(this);
		if (self.buffer.length) {
			return { value: self.buffer.shift(), done: false, };
		}
		if (self.done) {
			return { value: null, done: true, };
		}
		if (!self.promise) {
			self.promise = new Promise(done => (self.nextData = done));
			return { value: self.promise, done: false, };
		}
		return { value: P_reject(new Error('No data available, await previous promise before iterating')), done: false, };
	}

	/**
	 * Closes the iteration and removes all listeners from this.stream.
	 * @param  {any}   error  Optional. If != null, the iteration will terminate abnormally with this error.
	 */
	destroy(error) {
		Self.get(this).return(error);
	}

	[SymbolIterator]() {
		return this;
	}

	get [Symbol.toStringTag]() {
		return 'Stream Iterator';
	}

	/* // it would be nice if these were called when the iteration gets cancelled, but they are not.
	retrun() {
		this.destroy(); return { value: null, done: true, };
	}
	throw() {
		this.destroy(); return { value: null, done: true, };
	}
	*/
};

/**
 * Iterates an iterator of Promises and calls the callback with each resolved value.
 * @param  {iterable|ReadableStream}  iterable  Iterable over Promises. If it is not an iterable, it is assumed to be a ReadableStream and will be wrapped in a StreamIterator.
 *                                              .next() will not be called before the previous value resolved.
 *                                              If a Promise is rejected, the iteration gets aborted, rejected with that error and the error gets throw()'n into the iterator.
 * @param  {Function}                 callback  Called with each resolved value the iterator yields.
 *                                              If it throws an error, the iteration gets aborted, rejected with that error and the error gets throw()'n into the iterator.
 * @return {Promise}                            Promise(undefined), resolved when the iterator is done.
 */
const forOn = exports.forOn = _async(function*(iterable, callback) {
	const isIterable = typeof iterable[SymbolIterator] === 'function'; // TODO: this doesn't work ...
	for (const value of isIterable ? iterable : new StreamIterator(iterable)) {
		(yield callback((yield value)));
	}
});

/**
 * Iterates 'iterable' the same way 'forOn' does, but accumulated the values of the iterable like Array.prototype.reduce does.
 * @param  {iterable|ReadableStream}  iterable  @see forOn.iterable
 * @param  {Function}                 callback  Function (previous, current) => next. @see forOn.callback and @see Array.prototype.reduce
 * @param  {any}                      initial   Optional. Initial accumulator value. @see Array.prototype.reduce
 * @return {Promise<any>}                       Promise to the final accumulated value.
 * @throws {TypeError}                          If the iteration ends without yielding a single value and 'initial' was not supplied.
 */
forOn.reduce = function(iterable, callback, initial) {
	let value = initial, first = arguments.length <= 2;
	return forOn(iterable, (data) => {
		if (first) { value = data; first = false; return null; }
		return P_resolve(callback(value, data)).then(done => (value = done));
	}).then(() => first ? P_reject(new TypeError('reduce of empty iterable with no initial value')) : value);
};

/**
 * Periodically calls callback until it returns a true'ish value.
 * @param  {Function}  callback  Function to repeatedly call.
 *                               If it returns a Promise, the next iteration won't start while the Promise is still pending.
 * @param  {natural|Function}   waitFor   Number of minimum ms between iterations.
 * @return {Promise}             Promise to the true'ish value callback finally returns.
 * @throws {Promise}             Retuned Promise is rejected if callback throws or returns a rejected Promise.
 */
exports.periodic = periodic; function periodic(callback, waitFor) {
	// TODO: test
	typeof waitFor === 'function' || (waitFor = (function() { return this; }).bind(waitFor || 0));
	return new Promise((resolve, reject) => {
		let expected = now(), index = 0;
		function ping() {
			let value; try { value = callback(); } catch (error) { return void reject(error); }
			(value && typeof value.then === 'function') ? value.then(pong, reject) : pong(value);
		}
		function pong(value) {
			if (value) { return void resolve(value); }
			try { expected += waitFor(++index); } catch (error) { return void reject(error); }
			setTimeout(ping, expected - now());
		}
		setTimeout(ping, waitFor(0));
	});
}
const { now, } = global.Date;

/**
 * Instantly asynchronously executes a callback as soon as possible.
 * @param  {function}  callback  Callback that will be executed without this or arguments.
 */
exports.instantly = instantly; function instantly(callback) {
	resolved.then(callback);
}

}; if (typeof define === 'function' && define.amd) { define([ 'exports', ], factory); } else { const exp = { }, result = factory(exp) || exp; if (typeof exports === 'object' && typeof module === 'object') { module.exports = result; } else { global[factory.name] = result; if (typeof QueryInterface === 'function') { global.exports = result; global.EXPORTED_SYMBOLS = [ 'exports', ]; } } } })((function() { return this; })()); // eslint-disable-line
