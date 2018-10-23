(function(global) { 'use strict'; const factory = function es6lib_observer(exports) { // This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0. If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.

const Self = new WeakMap();

exports.onElementChanged = onElementChanged; function onElementChanged(element, attributeFilter, callback) {
	const observer = new (element.ownerDocument || element).defaultView
	.MutationObserver(_=>_.forEach(mutation => {
		if (mutation.target.getAttribute(mutation.attributeName) !== mutation.oldValue) {
			try { callback(mutation.target, mutation.oldValue); } catch(error) { console.error(error); }
		}
	}));
	observer.observe(element, { subtree: false, attributes: true, attributeOldValue: true, attributeFilter: attributeFilter, });
	return observer;
}

/* eslint-disable */ // the code below works, but is old and probably inefficient

exports.InsertObserver = exports.CreationObserver = CreationObserver; function CreationObserver(element) {
	const listeners = [/*{ callback: function(){}, selector: string [, single: true] }*/];
	const observer = new MutationObserver(_=>_.forEach(_=>_.addedNodes.forEach(element => {
		elementCreated(listeners, element);
		element.querySelectorAll && element.querySelectorAll('*').forEach(element => {
			elementCreated(listeners, element);
		});
	})));
	observer.listeners = listeners;
	observer.element = element || global.document;
	Self.set(this, observer);
};
function elementCreated(listeners, element) {
	element.matches && listeners.forEach(function(listener, index) {
		if (element.matches(listener.selector)) {
			global.setTimeout(() => listener.callback(element), 0);
			if (listener.single) {
				delete listeners[index];
			}
		}
	});
}
CreationObserver.prototype.add = function(selector, callback, single) {
	const self = Self.get(this);
	if (self.listeners.find(function(item) { return item.selector == selector && item.callback == callback && !item.single === !single; })) { return; }
	self.listeners.push({ selector: selector, callback: callback, single: single });
	self.listeners.length == 1 && self.observe(self.element, { subtree: true, childList: true, });
};
CreationObserver.prototype.remove = function(selector, callback, single) {
	const self = Self.get(this);
	const length = self.listeners.length;
	self.listeners.filter(function(item) { return !item.selector == selector && item.callback == callback && !item.single == !single; });
	self.listeners.length === 0 && self.disconnect();
	return length - self.listeners.length;
};
CreationObserver.prototype.removeAll = function() {
	const self = Self.get(this);
	const length = self.listeners.length;
	self.listeners.length = 0;
	self.disconnect();
	return length;
};
CreationObserver.prototype.once = CreationObserver.prototype.single = function(selector, callback) {
	const element = Self.get(this).element.querySelector(selector);
	if (element) {
		setTimeout(callback.bind(undefined, element), 0);
	} else {
		this.add(selector, callback, true);
	}
};
CreationObserver.prototype.on = CreationObserver.prototype.all = function(selector, callback) {
	const alreadyExisting = Self.get(this).element.querySelectorAll(selector);
	this.add(selector, callback, false);

	for (const element of alreadyExisting) {
		global.setTimeout(() => callback(element), 0);
	}
};

/* eslint-enable */

class RemoveObserver {

	/**
	 * Remove listener of a parent node. Observe the removal of any of it's child nodes.
	 * @param {DomNode}  node  The parent node of the nodes to observe.
	 */
	constructor(node) {
		RemoveObserver_init(this, node);
	}

	/**
	 * Invokes a callback once a child node or any of it's parents is removed from their parent.
	 * Guaranteed to fire if a node that was part of the DOM gets removed from it in any way.
	 * Listens to a single removal of node.
	 * @param  {Node}      child     The element to observe.
	 * @param  {function}  callback  The function to execute on the nodes removal.
	 * @return {Node?}               The child's parentNode, iff child has one.
	 */
	static on(child, callback) {
		const parent = child.parentNode;
		if (!parent) { return null; }
		RemoveObserver_init(parent, parent); // ensure RemoveObserverPrivate(parent)
		return RemoveObserver.prototype.on.call(parent, child, callback);
	}

	/**
	 * Removes a listener added by RemoveObserver.on().
	 * @param  {Node}      child     The reference element.
	 * @param  {function}  callback  The function that should not be executed on the nodes removal anymore.
	 * @return {bool}                True iff a listener was actually removed.
	 */
	static off(child, callback) {
		if (!child) { return false; }
		const parent = child.parentNode;
		if (!parent) { return false; }
		const self = Self.get(parent);
		if (!self) { return false; }
		return RemoveObserver.prototype.off.call(parent, child, callback);
	}

	// The DOM Node this RemoveObserver observes.
	get node() { return Self.get(this).node; }

	/**
	 * Same as the static RemoveObserver.on, only that child must be a direct child of this.node.
	 * Faster when adding listeners for a lot of children of the same element.
	 */
	on(child, callback) {
		const self = Self.get(this);
		if (child.parentNode !== self.node) { throw new Error('The observed node must be a direct child of the node passed into the constructor'); }
		let _child = self.children.get(child);
		if (!_child) {
			if (!self.children.size) { self.attach(); }
			_child = new Set;
			self.children.set(child, _child);
		}
		_child.add(callback);
		return this;
	}

	/**
	 * Same as the static RemoveObserver.off, only that it can only remove listeners of direct children of this.node.
	 */
	off(child, callback) {
		const self = Self.get(this);
		const _child = self.children.get(child);
		if (!_child || !_child.delete(callback)) { return false; }
		if (_child.size) { return true; }
		self.children.delete(child);
		if (!self.children.size) { self.detach(); }
		return true;
	}

} exports.RemoveObserver = Object.freeze(RemoveObserver);

// there are no properties on a RemoveObserver, every object that went as ref through this function can be used as this in any of the RemoveObserver methods
function RemoveObserver_init(ref, node) {
	let self = Self.get(node);
	if (!self) {
		self = new RemoveObserverPrivate(node);
		Self.set(node, self);
	}
	Self.set(ref, self);
}

/// Private back end class for RemoveObserver. Can not be accessed. There will never be more than one instance per DOM Node.
class RemoveObserverPrivate {
	constructor(node) {
		this.children = new Map;
		this.node = node;
		this.observer = null;
		this.check = this.check.bind(this);
		this.removed = this.removed.bind(this);
	}
	// called then a child was removed
	check(child) {
		const _child = this.children.get(child);
		if (!_child) { return; }
		_child.forEach(callback => { try {
			callback(child);
		} catch (error) { console.error(error); } });
		this.children.delete(child);
		if (!this.children.size) { this.detach(); }
	}
	// called when the node was removed from it's parent
	removed(_this_node) {
		this.children.forEach((_child, child) => {
			_child.forEach(callback => { try {
				callback(child);
			} catch (error) { console.error(error); } });
		});
		this.detach();
	}
	// listens for the removal of children and of the node from it's parent
	attach() {
		this.observer = new (this.node.ownerDocument || this.node).defaultView
		.MutationObserver(_=>_.forEach(_=>_.removedNodes.forEach(this.check)));
		this.observer.observe(this.node, { childList: true, });
		RemoveObserver.on(this.node, this.removed);
	}
	// stops listening of removals and releases all resources
	detach() {
		if (!this.observer) { return; }
		this.children = new Map;
		this.observer.disconnect();
		this.observer = null;
		RemoveObserver.off(this.node, this.removed);
	}
}

}; if (typeof define === 'function' && define.amd) { define([ 'exports', ], factory); } else { const exp = { }, result = factory(exp) || exp; if (typeof exports === 'object' && typeof module === 'object') { module.exports = result; } else { global[factory.name] = result; } } })((function() { return this; })()); // eslint-disable-line
