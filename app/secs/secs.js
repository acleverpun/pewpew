import siren from '../services/siren';

export default class Secs {
	constructor() {
		this.systems = new Map();
		this.entities = new Map();

		siren.on('entity.component.add', (...args) => this.onUpdateComponent(...args));
		siren.on('entity.component.remove', (...args) => this.onUpdateComponent(...args));
	}

	addSystem(system) {
		this.systems.set(system.getCriteria(), system);
		for (let [ , entity ] of this.entities) if (system.matches(entity)) system.add(entity);
		if (system.active) this.startSystem(system);
		system.init();
		return this;
	}

	removeSystem(system) {
		this.stopSystem(system);
		this.systems.delete(system.getCriteria());
		return this;
	}

	getSystem(system) {
		if (typeof system.getCriteria === 'function') system = system.getCriteria();
		return this.systems.get(system);
	}

	toggleSystem(system, active) { return this.getSystem(system).toggle(active); }

	startSystem(system) { return this.toggleSystem(system, true); }

	stopSystem(system) { return this.toggleSystem(system, false); }

	addEntity(entity) {
		this.entities.set(entity.id, entity);
		for (let [ criteria, system ] of this.systems) if (criteria.matches(entity)) system.add(entity);
		entity.init();
		return this;
	}

	removeEntity(entity) {
		if (typeof entity === 'object') entity = entity.id;
		this.entities.delete(entity);
		for (let [ , system ] of this.systems) if (system.has(entity)) system.remove(entity);
		return this;
	}

	update(dt) {
		for (let [ , system ] of this.systems) {
			if (typeof system.update === 'function' && !system.active && system.entities.size) system.update();
		}
	}

	render() {
		for (let [ , system ] of this.systems) {
			if (typeof system.draw === 'function' && !system.active && system.entities.size) system.draw();
		}
	}

	onUpdateComponent(entity, componentName) {
		console.log('onUpdateComponent', entity, componentName);
		for (let [ criteria, system ] of this.systems) if (criteria.involves(componentName)) system.sync(entity);
	}
}
