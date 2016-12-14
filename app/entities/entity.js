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
		// this.addMultiple(components);
	}

	init() {}

	set(key, component) {
		if (!component) {
			component = key;
			key = _.lowerFirst(component.constructor.name);
		}
		let isNew = !this.has(key);
		this.components[key] = component;
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
		for (let key in components) {
		}
	}
}
