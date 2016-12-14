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
			key = component.type;
		}
	}
}
