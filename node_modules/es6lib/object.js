(function(global) { 'use strict'; const factory = function es6lib_object(exports) { // This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.

/**
 * Deeply freezes an object structure by crawling the objects enumerable own properties (Object.keys()).
 * Can handles cyclic structures.
 * @param  {object}  object  An object that is part of the structure to freeze.
 * @return {object}          The object passed in.
 */
exports.deepFreeze = deepFreeze; function deepFreeze(object) {
	const done = new WeakSet;
	(function doIt(object) {
		if (typeof object !== 'object' || object === null || done.has(object)) { return; }
		done.add(object);
		Object.freeze(object);
		Object.keys(object).forEach(key => doIt(object[key]));
	})(object);
	return object;
}

/**
 * Checks the type of build in objects, e.g. 'Object', 'Date', 'Array', ...
 * @param  {object}  object           Object to check
 * @param  {string}  constructorName  Name of the (native) constructor Function
 * @return {bool}                     true, if object is instance of the constructor
 */
exports.checkNativeType = checkNativeType; function checkNativeType(object, constructorName) {
	return Object.prototype.toString.call(object).indexOf(constructorName, 8) === 8;
}

/**
 * Deeply copies the enumerable own property values from one object to an other.
 * If a property is an object of a not build-in type (i.e. not a Date, Window, Element, etc.),
 * it's properties will recursively copied to ether the existing property value on target
 * or an new object (or Array if the source property is an Array).
 * Build-in types will not be cloned but simply assigned to the clone.
 * Can NOT handle cyclic structures (of none-native objects).
 * @return {object}          target
 */
exports.copyProperties = copyProperties; function copyProperties(target, source) {
	source != null && Object.keys(source).forEach(key => {
		let to = target[key]; const value = source[key];
		if (typeof to !== 'object') {
			target[key] = value;
		} else if (checkNativeType(value, "Object")) {
			to == null && (to = target[key] = { });
			copyProperties(to, value);
		} else if (Array.isArray(value)) {
			to == null && (to = target[key] = [ ]);
			copyProperties(to, value);
		} else {
			target[key] = value;
		}
	});
	return target;
}

/**
 * Same as copyProperties but can handle cyclic structures.
 */
exports.cloneOnto = cloneOnto; function cloneOnto(target, source) {
	const done = new WeakMap([ [ source, target, ], ]);
	source && (function doIt(target, source) {
		Object.keys(source).forEach(key => {
			const sourceValue = source[key];
			if (checkNativeType(sourceValue, "Object")) {
				const targetValue = done.get(sourceValue);
				if (targetValue) {
					target[key] = targetValue;
				} else {
					!target[key] && (target[key] = { });
					doIt(target[key], sourceValue);
				}
			} else if (Array.isArray(sourceValue)) {
				const targetValue = done.get(sourceValue);
				if (targetValue) {
					target[key] = targetValue;
				} else {
					!target[key] && (target[key] = [ ]);
					doIt(target[key], sourceValue);
				}
			} else {
				target[key] = sourceValue;
			}
		});
	})(target, source);
	return target;
}

/**
 * Same as copyProperties except that assignments will fail silently, instead of throwing.
 */
exports.tryCopyProperties = tryCopyProperties; function tryCopyProperties(target, source) {
	source && Object.keys(source).forEach(key => {
		if (checkNativeType(source[key], "Object")) {
			try { !target[key] && (target[key] = { }); } catch (e) { }
			tryCopyProperties(target[key], source[key]);
		} else if (Array.isArray(source[key])) {
			try { !target[key] && (target[key] = { }); } catch (e) { }
			tryCopyProperties(target[key], source[key]);
		} else {
			try { target[key] = source[key]; } catch (e) { }
		}
	});
	return target;
}

/**
 * Set 'value' as enumerable but unconfigurable and unwritable property 'key' of 'object'.
 * @return {object}   The value that was set.
 */
exports.setConst = setConst; function setConst(object, key, value) {
	Object.defineProperty(object, key, { value: value, enumerable: true, });
	return value;
}

/**
 * Set 'value' as unenumerable but configurable and writable property 'key' of 'object'.
 * @return {object}   The value that was set.
 */
exports.setHidden = setHidden; function setHidden(object, key, value) {
	Object.defineProperty(object, key, { value: value, configurable: true, writable: true, });
	return value;
}

/**
 * Set 'value' as unenumerable, unconfigurable and unwritable property 'key' of 'object'.
 * @return {object}   The value that was set.
 */
exports.setHiddenConst = setHiddenConst; function setHiddenConst(object, key, value) {
	Object.defineProperty(object, key, { value: value, });
	return value;
}

/**
 * Copies the complete descriptors of the enumerable own properties from one object to an other.
 * @return {object}      The target object.
 */
exports.assignDescriptors = assignDescriptors; function assignDescriptors(to, from) {
	Object.keys(from).forEach(key => {
		Object.defineProperty(to, key, Object.getOwnPropertyDescriptor(from, key));
	});
	return to;
}

/**
 * Returns a Map where all the values are Sets, so that the map is effectively a multi map.
 * @param  {class}  MapType  The map type the MultiMap is derived from. (Map or WeakMap).
 * @return {class}           A MultiMap constructor.
 */
const MultiMapOf = MapType => class extends MapType {
	/**
	 * Creates a new MiltiMap.
	 * @param  {iterable}  init  Same as the Map constructor argument, only that the values must be iterable.
	 */
	constructor(init) {
		super();
		if (init == null) { return; }
		for (const [ key, value, ] of init) {
			super.set(key, new Set(value));
		}
	}

	/**
	 * Removes all existing values in a key range and puts 'value' as in that range.
	 * @param {any}  key    Any key the parent map accepts.
	 * @param {any}  value  Any value.
	 */
	set(key, value) {
		const set = this.get(key);
		set.clear();
		set.add(value);
	}

	/**
	 * Adds 'value' to the range of 'key' and creates the key range if it does not exist yet.
	 * @param {any}  key    Any key the parent map accepts.
	 * @param {any}  value  Any value.
	 */
	add(key, value) {
		const set = this.get(key);
		set.add(value);
	}

	/**
	 * Retrieves a mutable key range.
	 * @param  {any}  key    Any key the parent map accepts.
	 * @return {Set}         The key range. Changing the values in this Set will influence the MultiMap.
	 */
	get(key) {
		let set = super.get(key);
		if (!set) {
			set = new Set;
			super.set(key, set);
		}
		return set;
	}

	/**
	 * Removes values from a key range.
	 * @param  {any}      key    Any key the parent map accepts.
	 * @param  {any}      value  Optional. If provided, only this one value is removed from the range (if present), otherwise the entire range is cleared.
	 * @return {natural}         The number of elements removed from the range.
	 */
	delete(key, value) {
		const set = super.get(key);
		if (!set) { return 0; }
		if (arguments.length < 2) {
			const size = set.size;
			set.clear();
			return size;
		}
		return +set.delete(value);
	}

	/**
	 * @return {natural}  The number of unique key-value pairs in this.
	 */
	get size() {
		if (typeof this.forEach !== 'function') { return undefined; }
		let count = 0;
		this.forEach(range => (count += range.size));
		return count; // eslint-disable-line consistent-return
	}
};
exports.MultiMap = MultiMapOf(Map);
exports.WeakMultiMap = MultiMapOf(WeakMap);


}; if (typeof define === 'function' && define.amd) { define([ 'exports', ], factory); } else { const exp = { }, result = factory(exp) || exp; if (typeof exports === 'object' && typeof module === 'object') { module.exports = result; } else { global[factory.name] = result; if (typeof QueryInterface === 'function') { global.exports = result; global.EXPORTED_SYMBOLS = [ 'exports', ]; } } } })((function() { return this; })()); // eslint-disable-line

