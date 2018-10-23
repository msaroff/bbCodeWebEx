(function(global) { 'use strict'; const factory = function es6lib_template(exports) { // license: MIT

/**
 * 'ForEach' control flow element, repeats all elements between this value and the corresponding
 * End value will be repeated as often as often as 'arrays' .forEach function will call a callback.
 * @param  {any}       name   Identifier that can be used to get specific @see Index or @see Value in nested loops.
 * @param  {arraylike} array  The array or array like structure to iterate over, uses its .forEach function.
 *                            While iterating, the forEach-callbacks second value will be the @see Index.
 * @return {ControlFlowElement}  Object that starts the loop.
 */
const ForEach = exports.ForEach = function ForEach(name, array) { return { command: ForEach, array: array || name, name, }; };

/**
 * Same as @see ForEach, only that it uses Object.keys(object) to get ist's @see Index'es
 * @param  {any}     name    Identifier that can be used to get specific @see Index or @see Value in nested loops.
 * @param  {object}  object  Object that will be iterated over for every key in Object.keys(object).
 * @return {ControlFlowElement}  Object that starts the loop.
 */
const ForOf = exports.ForOf = function ForOf(name, object) { return { command: ForOf, object: object || name, name, }; };

/**
 * Loop while 'generator' yields values
 * @param  {any}        name       Identifier that can be used to get specific @see Index or @see Value in nested loops.
 * @param  {function*}  generator  Generator function that will be iterated over.
 *                                 @see Index will be incremented at each call to the generator.
 * @return {ControlFlowElement}    Object that starts the loop.
 */
const While = exports.While = function While(name, generator) { return { command: While, generator: generator || name, name, }; };

/**
 * 'If' control flow element, includes all elements between this and the corresponding End only if 'value' is true
 * or returns true, in case it's a function
 * @param {any|function|Predicate}   value  Block will be included if and only if value is trueisch.
 *                     If value is a function, it will be considered truisch if it returns a truisch value.
 *                     when called with (value, index, array) of the current iteration.
 *                     Same for 'Call' objects which will be called as specified in @see Predicate.
 *                     Otherwise the value will be considered thueisch if !!value === true.
 * @return {ControlFlowElement}  Object that starts the if branch.
 */
const If = exports.If = function If(value) { return { command: If, value, }; };

/**
 * Gets the value of ether the innermost or a named iteration, may be used without calling for the current iteration.
 * @param  {any}  name  'name' specified in the opening iteration.
 * @return {ControlFlowElement}  Object that will be replaced by the value.
 */
const Value = exports.Value = function Value(name) { return { command: Value, name, }; };

/**
 * Gets the index (or key) of ether the innermost or a named iteration, may be used without calling for the current iteration.
 * @param  {any}  name  'name' specified in the opening iteration.
 * @return {ControlFlowElement}  Object that will be replaced by the index.
 */
const Index = exports.Index = function Index(name) { return { command: Index, name, }; };

/**
 * Alias for Index
 */
exports.Key = Index;

/**
 * Gets an array or object currently iterated over.
 * May be used without calling for the current iteration or called with a name for an outer iteration.
 * If the iteration is over a generator (@see While) it returns an array of all values yielded so far.
 * @param  {any}  name  'name' specified in the opening iteration.
 * @return {ControlFlowElement}  Object that will be replaced by the array/object.
 */
const Iterated = exports.Iterated = function Iterated(name) { return { command: Iterated, name, }; };

/**
 * Specifies a function that will be called with custom arguments args or (value, index, array) of the current iteration
 * @param  {array of Value|Index}   args      Optional arguments for the callbach will be mapped to values and indices
 *                                            according to @see Value and @see Index. Defaults to [ Value, Index, Iterated, ].
 * @param  {Function}               callback  the callback function
 * @param  {any}                    thisArg   'this' in the callback
 * @return {ControlFlowElement}     Object that will be replaced by callback's return value.
 */
const Call = exports.Call = function Call(args, callback, thisArg) {
	if (!Array.isArray(args)) { thisArg = callback; callback = args; args = null; }
	return { command: Call, args, callback, thisArg, };
};

// read-only-assign 'command' properties to each ControlFlowElement function, so that they can be used like their return values
Object.keys(exports).forEach(key => Object.defineProperty(exports[key], 'command', { value: exports[key], }));

/**
 * Ends a ControlFlowElement's branch
 * Using End's properties (ForEach/ForOf/While/If) introduces type safety and is encouraged.
 * @return {ControlFlowElement}  Object that ends the current branch.
 */
const End = exports.End = (End => Object.freeze(Object.assign(End, {
	ForEach: { command: End, value: ForEach, },
	ForOf: { command: End, value: ForOf, },
	While: { command: End, value: While, },
	If: { command: End, value: If, },
	command: End,
})))({ });

/**
 * Excludes a value from the mapping.
 * @param {any}  value  Value that will be directly used instead of beeing mapped.
 */
const NoMap = exports.NoMap = function NoMap(value) { return { command: NoMap, value, toString: noMaptoString, }; };
function noMaptoString() { return this && this.value || ''; } // eslint-disable-line no-invalid-this

/**
 * Creates a new template engine instance that can ether be called
 * as "TemplateEngine(options)" with (additional) Options
 * or as a template string processor ("TemplateEngine`template${string}`").
 * So calling "TemplateEngine(options)`template${string}`" will process the string with the given options.
 * @param  {object|Function}   options   Object containing
 *         @attribute  {string}    trim    Trimming options, may contain
 *                     'front' which removes any whitespaces at the front of the result or
 *                     'parts' which removes most whritspaces before and after skiped or control values.
 *         @attribute  {function}  mapper  Function that all value parts of the result will b passed through.
 *                     May receive any type of (single) value and its result will be casted to string.
 *         @attribute  {bool}      raw     Use raw string parts.
 * @param  {Array, ...any}    strings, ...vars  Arguments when called via "TemplateEngine`template${string}`".
 * @return {Function|string}  If called with options (with or without 'new') the same function with bound options.
 *                            If called as template string function, the processed string.
 */
const TemplateEngine = exports.TemplateEngine = function TemplateEngine(options) {
	const self = (this instanceof TemplateEngine) ? this : Object.create(TemplateEngine.prototype);

	// not called as template string processor (yet)
	if (!(Array.isArray(options) && arguments.length === options.length)) {
		// called with options
		if (typeof options === 'object') {
			self.options = Object.assign(self.options || { }, options);
		}
		// called with mapper function
		else if (typeof options === 'function') {
			self.options && (self.options.mapper = options) || (self.options = { mapper: options, });
		}
		else {
			throw new TypeError('Invalid arguments for TemplateEngine: '+ options +', and '+ (arguments.length - 1) +' more');
		}
		return TemplateEngine.bind(self);
	}

	const vars = new Array(arguments.length - 1);
	for (let i = 0, length = arguments.length - 1; i < length; ++i) {
		vars[i] = arguments[i + 1];
	}

	self.options = self.options || { };
	self.options.trim = self.options.trim || '';

	// all string parts of the template string
	self.strings = self.options.raw ? options.raw : options;
	// all value parts that are ether ControlFlowElements or values to be mapped and concatted into the result string
	self.vars = vars;
	// the result stack, mix of string and processed value parts
	self.parts = [ ];
	// iteration stack of { array, index, name, }
	self.stack = [ self.stackBase, ];

	self.findBrackets();

	// start processing recursively
	self.processRange(0, vars.length);
	self.parts.pop();

	// console.log('self', self);

	// map, trim and concat result
	self.map();
	self.trim();
	return self.parts.join('');
};
/**
 * All methods are implicitly private since TemplateEngine never returns an instance.
 */
TemplateEngine.prototype = {
	cunstructor: TemplateEngine,
	/// Base element of each instances iteration stack so that Value, Index and Iterated return appropriate values when called outside iterations.
	stackBase: Object.freeze({ array: Object.freeze([ ]), index: -1, name: undefined, }),

	/**
	 * Iterates over all value parts (odd entries in this.parts) and
	 * replaces them with their value if they are a NoMap-object,
	 * replaces them with '' if they are emptyValueNoStrip,
	 * replaces them with options.mapper(value) if options.mapper is a function
	 */
	map() {
		const parts = this.parts, mapper = this.options.mapper;

		// forEch odd indexed part of parts, i.e. all value parts
		for (let index = 1, length = parts.length, part = parts[index]; index < length; part = parts[index += 2]) {
			if (!(part && (part.command === NoMap || part === emptyValueNoStrip || part === emptyValue))) {
				parts[index] = mapper(part);
			}
		}
	},

	/**
	 * Removes any leading whitespaces if options.trim contains 'front',
	 * whitespace lines between parts if options.trim contains 'parts'
	 * and emptyValue values in any case.
	 */
	trim() {
		const parts = this.parts, trim = this.options.trim;

		const empty = (/^[ \t\n\r]*$/);
		const atBack = (/(\n|\r|\r\n)[ \t]*$/);
		const atFront = (/^(\n|\r|\r\n)[ \t]*/);

		(/front/).test(trim) && (this.parts[0] = this.parts[0].replace(/^[ \t]*\n/, ''));

		if (/parts/.test(trim)) {
			// forEch odd indexed part of parts, i.e. all value parts
			for (let index = 1, length = parts.length; index < length; index += 2) {
				if (parts[index] === emptyValue) {
					delete parts[index];
					if (parts[index - 1] && empty.test(parts[index - 1])) {
						delete parts[index - 1];
					}
					if (parts[index + 1] && empty.test(parts[index + 1])) {
						delete parts[index + 1];
					}
					if (
						parts[index - 1] && parts[index + 1]
						&& atBack.test(parts[index - 1]) && atFront.test(parts[index + 1])
					) {
						parts[index - 1] = parts[index - 1].replace(atBack, '');
					}
				}
			}
		}
	},

	/**
	 * @return {object} The topmost iteration stack entry
	 */
	top() {
		return this.stack[this.stack.length - 1];
	},

	/**
	 * @param  {any} name The iterations name
	 * @return {object} The topmost iteration stack entry with name === name
	 * @throws {TypeError} If name is not defined, i.e. there is no entry with name === name in this.stack
	 */
	find(name) {
		for (let height = this.stack.length - 1; height >= 0; --height) {
			if (this.stack[height].name === name) {
				return this.stack[height];
			}
		}
		throw new TypeError('"'+ name +'" is not a known iteration identifier');
	},

	processRange(startIndex, endIndex) {
		// console.log('_processRange', startIndex, endIndex, this.top());

		let loopIndex = startIndex;
		do {
			// console.log('loop', loopIndex, this.vars[loopIndex]);

			// push string part no matter what
			this.parts.push(this.strings[loopIndex]);

			const current = this.vars[loopIndex];

			if (!current || !(/object|function/).test(typeof current) || !current.command) {
				this.parts.push(current);
			} else { switch (current.command) {
				case Value: {
					const tupel = (current === Value ? this.top() : this.find(current.name));
					this.parts.push(tupel.array[tupel.index]);
				} break;
				case End: {
					this.parts.push(emptyValue);
				} break;
				case If: {
					const top = this.top();
					if ((
							!current.value
						) || (
							(typeof current.value === 'function')
							&& !current.value(top.array[top.index], top.index, top.array)
						) || (
							current.value && current.value.command === Call
							&& !this.executeCall(current.value)
						)
					) { // skip ...
						this.parts.push(emptyValueNoStrip);
						loopIndex = current.closing;
					} else {
						this.parts.push(emptyValue);
					}
				} break;
				case ForEach: {
					this.parts.push(emptyValue);
					loopIndex = this.forEach(loopIndex, current);
				} break;
				case Index: {
					this.parts.push((current === Index ? this.top() : this.find(current.name)).index);
				} break;
				case ForOf: {
					this.parts.push(emptyValue);
					loopIndex = this.forOf(loopIndex, current);
				} break;
				case Call: {
					this.parts.push(this.executeCall(current));
				} break;
				case While: {
					this.parts.push(emptyValue);
					loopIndex = this.while(loopIndex, current);
				} break;
				case Iterated: {
					this.parts.push((current === Iterated ? this.top() : this.find(current.name)).array);
				} break;
				default: {
					this.parts.push(current);
				}
			} }
		} while (++loopIndex <= endIndex);
	},

	forEach(startIndex, element) {
		const array = element.array, name = element.name, stopIndex = element.closing;
		// console.log('_forEach', startIndex, array, stopIndex);

		const tupel = { array, name, };
		this.stack.push(tupel);
		array.forEach((item, index) => {
			tupel.index = index;
			this.processRange(startIndex + 1, stopIndex);
		});
		this.stack.pop();
		return stopIndex;
	},

	forOf(startIndex, element) {
		const object = element.object, name = element.name, stopIndex = element.closing;
		// console.log('_forOf', startIndex, array, stopIndex);

		const tupel = { array: object, name, };
		this.stack.push(tupel);
		Object.keys(object).forEach(index => {
			tupel.index = index;
			this.processRange(startIndex + 1, stopIndex);
		});
		this.stack.pop();
		return stopIndex;
	},

	while(startIndex, element) {
		const generator = element.generator, name = element.name, stopIndex = element.closing;
		// console.log('_while', startIndex, generator, stopIndex);

		const top = this.top();
		const array = [];
		const tupel = { array, name, index: -1, };
		this.stack.push(tupel);
		for (const value of generator(top.array[top.index], top.index, top.array)) {
			array.push(value);
			tupel.index++;
			this.processRange(startIndex + 1, stopIndex);
		}
		this.stack.pop();
		return stopIndex;
	},

	findBrackets() {
		const stack = [];
		const opening = [ ForEach, ForOf, While, If, ];
		this.vars.forEach((value, index) => {
			if (!value) { return; }
			if (value.command === End) {
				const top = stack.pop();
				if (!top) { throw Error('Unexpected End'+ (value.value ? ('.'+ value.value.name) : '') +' at value '+ index); }
				if (value.value === undefined || value.value === top.command) {
					top.closing = index;
				} else {
					throw Error('End mismatch at value '+ index +'. Expected '+ top.command.name +' saw '+ value.value.name);
				}
			} else
			if (~opening.indexOf(value.command)) {
				stack.push(value);
			}
		});
		if (stack.length) { throw Error('Expected End for '+ stack.pop().command.name +' saw <end of string>'); }
	},

	executeCall(element) {
		const callback = element.callback, args = element.args, thisArg = element.thisArg;
		// console.log('stack', this.stack);
		if (!args) {
			const top = this.top();
			return callback.call(thisArg, top.array[top.index], top.index, top.array);
		}
		return callback.apply(thisArg, args.map(value => {
			const tupel = value.command === value ? this.top() : this.find(value.name);
			// console.log('tupel', tupel, value);
			if (value.command === Value) {
				return tupel.array[tupel.index];
			} else if (value.command === Index) {
				return tupel.index;
			} else if (value.command === Iterated) {
				return tupel.array;
			}
			throw new Error('Call\'s arguments must be Value or Index');
		}));
	},
};

/**
 * Marks parts that will be filtered out, but are first included to maintain the condition
 * that every odd part is a value and every even part is a string part.
 * NoStrip version will be replaced by '' instead of being removed.
 */
function emptyValue() { }
function emptyValueNoStrip() { }
emptyValue.toString = emptyValueNoStrip.toString = function() { return ''; };

}; if (typeof define === 'function' && define.amd) { define([ 'exports', ], factory); } else { const exp = { }, result = factory(exp) || exp; if (typeof exports === 'object' && typeof module === 'object') { module.exports = result; } else { global[factory.name] = result; } } })((function() { return this; })()); // eslint-disable-line

