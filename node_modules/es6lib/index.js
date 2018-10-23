(function(global) { 'use strict'; const factory = function es6lib(exports) { // license: MIT

const req = arguments.length > 1 ? arguments[1] : require;

return new Proxy({ __proto__: null, }, { get(self, key) {
	if (self[key]) { return self[key]; }
	return (self[key] = req('./'+ key));
}, });

// NOTE: if loaded via AMD, this needs require
}; if (typeof define === 'function' && define.amd) { define([ 'exports', 'require', ], factory); } else { const exp = { }, result = factory(exp) || exp; if (typeof exports === 'object' && typeof module === 'object') { module.exports = result; } else { global[factory.name] = result; } } })((function() { return this; })()); // eslint-disable-line

