/* eslint-disable */ 'use strict';

const chai = require('chai');
global.chaiAsPromised = require('chai-as-promised');

chai.should();
chai.use(chaiAsPromised);

global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;
