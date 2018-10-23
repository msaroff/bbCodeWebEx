/*eslint strict: ["error", "global"], no-implicit-globals: "off", no-unused-expressions: "off"*/ 'use strict'; /* global describe, it, */ // license: MPL-2.0

const {
	string: { toFixedLength, Guid, numberToRoundString, },
} = require('../');

describe('"toFixedLength" should', () => {

	it('cast its first argument into a string a string', () => {
		toFixedLength('abc').should.equal('abc');
		toFixedLength(x => x).should.equal('x => x');
		toFixedLength(12345).should.equal('12345');
	});

	it('truncate', () => {
		toFixedLength('xxabc', 3).should.equal('abc');
		toFixedLength(abcx => x, 6).should.equal('x => x'); // eslint-disable-line
		toFixedLength(12345, 3).should.equal('345');
	});

	it(`padd with '0' by default`, () => {
		toFixedLength('abc', 5).should.equal('00abc');
		toFixedLength(x => x, 7).should.equal('0x => x');
		toFixedLength(12345, 8).should.equal('00012345');
	});

	it(`padd with custom chars`, () => {
		toFixedLength('abc', 5, 'µ').should.equal('µµabc');
		toFixedLength(x => x, 7, 'y').should.equal('yx => x');
		toFixedLength(12345, 8, '⫶').should.equal('⫶⫶⫶12345');
	});

});

describe('"Guid" should', () => {

	it('work', () => {
		for (let i = 0; i < 100; ++i) {
			const id = Guid();
			id.should.match(/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-8[\da-f]{3}-[\da-f]{12}$/);
		}
	});

});

describe('"numberToRoundString" should', () => {

	it('work', () => {
		numberToRoundString(+1.23e1, 3).should.equal( '12.3');
		numberToRoundString(-1.23e1, 3).should.equal('-12.3');

		numberToRoundString(+1.23e2, 3).should.equal( '123');
		numberToRoundString(-1.23e2, 3).should.equal('-123');

		numberToRoundString(+1.23e3, 3).should.equal( '1.23k');
		numberToRoundString(-1.23e3, 3).should.equal('-1.23k');

		numberToRoundString(+1.23e5, 3).should.equal( '123k');
		numberToRoundString(-1.23e5, 3).should.equal('-123k');

		numberToRoundString(+1.23e7, 3).should.equal( '12.3M');
		numberToRoundString(-1.23e7, 3).should.equal('-12.3M');

		numberToRoundString(+1.23e9, 3).should.equal( '1.23G');
		numberToRoundString(-1.23e9, 3).should.equal('-1.23G');

		numberToRoundString(+1.23e-1, 3).should.equal( '123m');
		numberToRoundString(-1.23e-1, 3).should.equal('-123m');

		numberToRoundString(+1.23e-3, 3).should.equal( '1.23m');
		numberToRoundString(-1.23e-3, 3).should.equal('-1.23m');

		numberToRoundString(+1.23e-6, 3).should.equal( '1.23µ');
		numberToRoundString(-1.23e-6, 3).should.equal('-1.23µ');

		numberToRoundString(+1.2345678e4, 6).should.equal( '12.3456k');
		numberToRoundString(-1.2345678e4, 6).should.equal('-12.3456k');

	});
});
