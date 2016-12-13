export default class Secs {
	constructor() {
		this.systems = new Map();
		this.entities = {};
	}

	addSystem(system) {
		this.systems.set(system.getCriteria(), system);
		if (system.active) this.startSystem(system);
	}

	removeSystem() {
	}

	addEntity() {
	}

	removeEntity() {
	}
}
