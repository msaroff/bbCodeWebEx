/*eslint strict: ["error", "global"], no-implicit-globals: "off", no-unused-expressions: "off"*/ 'use strict'; /* global assert, describe, expect, it, */ // license: MPL-2.0

describe('"noop" should', () => {

	const { noop, } = require('../functional.js');

	it('always stay noop', () => {
		assert(noop() === noop, 'call');
		assert(noop.apply(null, [ ]) === noop, 'apply');
		assert(new noop === noop, 'new');
		assert(Reflect.construct(noop, [ ]) === noop, 'constuct');
		assert(noop.blob === noop, 'property');
		assert(noop.prototype === noop, '.prototype');
		assert(noop.blob() === noop, 'member');
		assert(noop[Symbol()] === noop, 'Symbol() property');
	});

	it('not be modified', () => {
		noop.blob = 42;
		expect(noop.blob).to.equal(noop);
		Object.defineProperty(noop, 'blob', { vlaue: 42, });
		expect(noop.blob).to.equal(noop);
		(() => Object.defineProperty(noop, 'arguments', { vlaue: 42, })).should.not.throw();
	});

	it('not be freezable', () => {
		(() => Object.freeze(noop)).should.throw(TypeError);
	});

	it('cast to falsy primitives', () => {
		expect(+noop).to.be.NaN;
		expect(''+ noop).to.equal('');
	});

	it('have a special Object.prototype.toString', () => {
		expect(Object.prototype.toString.call(noop)).to.equal('[object no-op]');
	});

	it('have only deletable properties', () => {
		(() => delete noop.blob).should.not.throw(); // throws in node 6.2.2, but shouldn't
		(() => delete noop.arguments).should.not.throw();
	});

	it('have the imutable .__proto__ == null', () => {
		expect(Object.getPrototypeOf(noop)).to.be.null;
		expect(noop.__proto__).to.be.null; // eslint-disable-line no-proto
		Object.setPrototypeOf(noop, Object.prototype);
		expect(Object.getPrototypeOf(noop)).to.be.null;
		expect(noop.__proto__).to.be.null; // eslint-disable-line no-proto
	});

	it('have no enumerable properties', () => {
		expect(Object.keys(noop).length).to.equal(0);
	});

	it('have no property descriptors', () => {
		expect(Object.getOwnPropertyDescriptor(noop, 'blob')).to.be.undefined;
		expect(Object.getOwnPropertyDescriptor(noop, 'caller')).to.be.undefined;
		expect(Object.getOwnPropertyDescriptor(noop, 'arguments')).to.be.undefined;
		expect(Object.getOwnPropertyDescriptor(noop, 'prototype')).to.be.undefined;
	});

	it('not have anything ``in´´ it', () => {
		expect('blob' in noop).to.be.false;
		expect('caller' in noop).to.be.false;
		expect('arguments' in noop).to.be.false;
		expect('prototype' in noop).to.be.false;
	});

});
