/*eslint strict: ["error", "global"], no-implicit-globals: "off", no-unused-expressions: "off"*/ 'use strict'; /* global describe, expect, it, */ // license: MPL-2.0

const {
	concurrent: { promisify, promised, spawn, async, StreamIterator, forOn, sleep, },
} = require('../');

function nodeReturn(value, callback) {
	callback(null, value, 'ignored');
}

function nodeReturnThis(callback) {
	callback(null, this, 'ignored'); // eslint-disable-line no-invalid-this
}

function nodeThrow(error, callback) {
	callback(error, 'ignored');
}

function promiseReturn(value) {
	return new Promise(resolve => resolve(value));
}

function promiseReturnThis() {
	return new Promise(resolve => resolve(this)); // eslint-disable-line no-invalid-this
}

function promiseThrow(error) {
	return new Promise((resolve, reject) => reject(error));
}

function* pointlessGenerator(values) {
	values = values.map((value, index) => index % 2 ? promiseReturn(value) : promiseThrow(value));
	const out = [ ];
	for (const promise of values) {
		try {
			out.push(yield promise);
		} catch (error) {
			out.push(error);
		}
	}
	return out;
}

const EventEmitter = require('events');

describe('"promisify"ed should', () => {
	const sut = promisify;

	it('return', () => {
		return sut(nodeReturn)(42).should.eventually.equal(42);
	});

	it('forward `this´', () => {
		return sut(nodeReturnThis).call(42).should.eventually.equal(42);
	});

	it('throw', () => {
		return sut(nodeThrow)(42).should.be.rejectedWith(42);
	});

});

describe('"promised"ed should', () => {
	const sut = promised;

	it('return', done => {
		function callback(error, value) {
			if (error) { return void done(error); }
			value.should.equal(42);
			done();
		}
		sut(promiseReturn)(42, callback);
	});

	it('forward `this´', done => {
		function callback(error, value) {
			if (error) { return void done(error); }
			value.should.equal(42);
			done();
		}
		sut(promiseReturnThis).call(42, callback);
	});

	it('throw', done => {
		function callback(error, _value) {
			error.should.equal(42);
			done();
		}
		sut(promiseThrow)(42, callback);
	});

});

describe('"spawn"ed should', () => {
	const sut = spawn;

	it('directly return', () => {
		return sut(function*() { return 23; }).should.become(23); // eslint-disable-line require-yield
	});

	it('directly throw', () => {
		return sut(function*() { throw new RangeError; }).should.rejectedWith(RangeError); // eslint-disable-line require-yield
	});

	it('be async', () => {
		let closure = false;
		const ret = sut(function*() { return closure; }).should.become(true); // eslint-disable-line require-yield
		closure = true;
		return ret;
	});

	it('mind timing', () => {
		let closure = NaN;
		const ret = sut(function*() {
			(yield sleep(2));
			closure++;
			(yield sleep(4));
			return closure;
		}).should.become(2);
		closure = 0;
		setTimeout(() => closure++, 4);
		return ret;
	});

	it('work', () => {
		const values = [ 'a', 1, null, true, { }, String('blob'), ];
		return sut(pointlessGenerator, null, [ values, ]).should.become(values);
	});

});

describe('"StreamIterator" should', () => {

	it('directly end on end', async(function*() {
		const emitter = new EventEmitter, values = [ ];
		const sut = new StreamIterator(emitter);

		emitter.emit('end', 'blob');

		const promise = spawn(function*() {
			let pair; while ((pair = sut.next()) && !pair.done) {
				values.push((yield pair.value));
			}
			return true;
		});

		(yield promise).should.equal(true);

		values.should.deep.equal([ 'blob', ]);
	}));

	it('iterate data and end events', async(function*() {
		const emitter = new EventEmitter, values = [ ];
		const sut = new StreamIterator(emitter);

		const promise = spawn(function*() {
			let pair; while ((pair = sut.next()) && !pair.done) {
				values.push((yield pair.value));
			}
			return true;
		});

		emitter.emit('data', 1);
		emitter.emit('data', 2);
		setTimeout(() => {
			emitter.emit('data', 3);
			emitter.emit('data', 4);
		});
		setTimeout(() => {
			emitter.emit('data', 5);
			emitter.emit('data', 6);
			emitter.emit('end', 7);
		}, 3);

		(yield promise).should.equal(true);

		values.should.deep.equal([ 1, 2, 3, 4, 5, 6, 7, ]);
	}));

});

describe('"forOn" should', () => {
	const sut = forOn;

	it('directly return on end', async(function*() {
		const emitter = new EventEmitter, values = [ ];
		const iterable = new StreamIterator(emitter);
		const promise = sut(iterable, value => values.push(value));

		// let destroyed = false;
		// iterable.destroy = () => destroyed = true;

		emitter.emit('end');

		expect(yield promise).to.equal(undefined);

		// assert(destroyed, 'iterable was not destroyed');
		values.should.deep.equal([ ]);
	}));

	it('directly throw on error', async(function*() {
		const emitter = new EventEmitter, values = [ ];
		const promise = sut(new StreamIterator(emitter), value => values.push(value));

		emitter.emit('error', 17);

		let cought;
		(yield promise.catch(error => (cought = error)));
		cought.should.equal(17);

		values.should.deep.equal([ ]);
	}));

	it('throw on error later on', async(function*() {
		const emitter = new EventEmitter, values = [ ];
		const promise = sut(new StreamIterator(emitter), value => values.push(value));

		emitter.emit('data', -1);
		emitter.emit('data', -2);
		emitter.emit('error', 17);

		let cought;
		(yield promise.catch(error => (cought = error)));
		cought.should.equal(17);

		values.should.deep.equal([ -1, -2, ]);
	}));

	it('directly rethrow', async(function*() {
		const emitter = new EventEmitter, values = [ ];
		const promise = sut(new StreamIterator(emitter), _ => { throw new RangeError; });

		emitter.emit('data', 42);

		let cought;
		(yield promise.catch(error => (cought = error)));
		cought.should.be.instanceOf(RangeError);

		values.should.deep.equal([ ]);
	}));

	it('iterate data and end events', async(function*() {
		const emitter = new EventEmitter, values = [ ];
		const promise = sut(new StreamIterator(emitter), value => values.push(value));

		emitter.emit('data', 1);
		emitter.emit('data', 2);
		setTimeout(() => {
			emitter.emit('data', 3);
			emitter.emit('data', 4);
		});
		setTimeout(() => {
			emitter.emit('data', 5);
			emitter.emit('data', 6);
			emitter.emit('end', 7);
		}, 3);

		expect(yield promise).to.equal(undefined);

		values.should.deep.equal([ 1, 2, 3, 4, 5, 6, 7, ]);
	}));

});

describe('"forOn.reduce" should with initial value', () => {
	const sut = forOn.reduce;

	it('directly return on end', async(function*() {
		const emitter = new EventEmitter, values = [ ];
		const promise = sut(new StreamIterator(emitter), value => values.push(value), 23);

		emitter.emit('end');

		expect(yield promise).to.equal(23);
		values.should.deep.equal([ ]);
	}));

	it('throw on emty streams without initial value', async(function*() {
		const emitter = new EventEmitter, values = [ ];
		const promise = sut(new StreamIterator(emitter), value => values.push(value));

		emitter.emit('end');

		let cought;
		(yield promise.catch(error => (cought = error)));
		expect(cought).to.be.instanceOf(TypeError);

		values.should.deep.equal([ ]);
	}));

	it('directly throw on error', async(function*() {
		const emitter = new EventEmitter, values = [ ];
		const promise = sut(new StreamIterator(emitter), value => values.push(value), null);

		emitter.emit('error', 17);

		let cought;
		(yield promise.catch(error => (cought = error)));
		expect(cought).to.equal(17);

		values.should.deep.equal([ ]);
	}));

	it('throw on error later on', async(function*() {
		const emitter = new EventEmitter, values = [ ];
		const promise = sut(new StreamIterator(emitter), (prev, value) => (values.push(value - prev), 0.5), 0.5);

		emitter.emit('data', -1);
		emitter.emit('data', -2);
		emitter.emit('error', 17);

		let cought;
		(yield promise.catch(error => (cought = error)));
		expect(cought).to.equal(17);

		values.should.deep.equal([ -1.5, -2.5, ]);
	}));

	it('directly rethrow', async(function*() {
		const emitter = new EventEmitter;
		const promise = sut(new StreamIterator(emitter), value => { throw value; }, 42);

		emitter.emit('data', null);

		let cought;
		(yield promise.catch(error => (cought = error)));
		cought.should.equal(42);
	}));

	it('iterate data and end events', async(function*() {
		const emitter = new EventEmitter;
		const promise = sut(new StreamIterator(emitter), (a, b) => a + b);

		emitter.emit('data', 1);
		emitter.emit('data', 2);
		setTimeout(() => {
			emitter.emit('data', 3);
			emitter.emit('data', 4);
		});
		setTimeout(() => {
			emitter.emit('data', 5);
			emitter.emit('data', 6);
			emitter.emit('end', 7);
		}, 3);

		expect(yield promise).to.equal([ 1, 2, 3, 4, 5, 6, 7, ].reduce((a, b) => a + b));
	}));

});
