const _ = require('lodash');
import siren from '../services/siren';

export default class Entity {
	static count = 0;

	static uuid() {
		return `${Date.now()}|${Math.floor(Math.random() * 100000000)}|${this.count++}`;
	}

	constructor(game, components) {
		this.game = game;
		this.id = this.constructor.uuid();
		this.components = {};
		this.addAll(components);
	}

	init() {}

	has(key) { return !!this.get(key); }

	hasAll(...keys) { return keys.every((key) => this.has(key)); }

	hasSome(...keys) { return keys.some((key) => this.has(key)); }

	hasNone(...keys) { return keys.every((key) => !this.has(key)); }

	get(key) { return this.components[key]; }

	getAll(key) { return this.components; }

	set(key, component) {
		if (!component) {
			component = key;
			key = _.lowerFirst(component.constructor.name);
		}
		let isNew = !this.has(key);
		this.components[key] = component;
		if (typeof component.apply === 'function') component.apply(this, key);
		if (isNew) siren.emit('entity.component.add', this, key);
		return this;
	}

	add(key, component) {
		if (!component) {
			component = key;
			key = _.lowerFirst(component.constructor.name);
		}
		if (this.has(key)) throw new Error(`Entity already has component: ${key}`);
		return this.set(key, component);
	}

	addAll(components = {}) {
		let isArray = Array.isArray(components);
		for (let key in components) {
			let args = [ components[key] ];
			if (!isArray) args.unshift(key);
			this.add(...args);
		}
		return this;
	}

	remove(key) {
		if (!this.has(key)) throw new Error(`Tried removing nonexistent component: ${key}`);
		delete this.components[key];
		siren.emit('entity.component.remove', this, key);
		return this;
	}

	removeAll(...keys) {
		if (!keys.length) keys = Object.keys(this.components);
		for (let key of keys) this.remove(key);
		return this;
	}
}
