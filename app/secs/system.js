import Criteria from './criteria';

export default class System {
	static Criteria = Criteria;
	static criteria = new Criteria();

	active = true;

	constructor() {
		this.entities = new Map();
	}

	init() {}

	get(id) { return this.entities.get(id); }

	getAll() { return this.entities; }

	getCriteria() { return this.constructor.criteria; }

	add(entity) {
		this.entities.set(entity.id, entity);
		if (typeof this.onAdd === 'function') this.onAdd(entity);
		return this;
	}

	addAll(...entities) {
		for (let entity of entities) this.add(entity);
		return this;
	}

	remove(entity) {
		if (typeof entity === 'object') entity = entity.id;
		if (typeof this.onRemove === 'function') this.onRemove(entity);
		this.entities.delete(entity);
		return this;
	}

	removeAll(...entities) {
		for (let entity of entities) this.remove(entity);
		return this;
	}

	has(entity) {
		if (typeof entity === 'object') entity = entity.id;
		return this.entities.has(entity);
	}

	hasAll(...entities) {
		return entities.every((entity) => this.has(entity));
	}

	sync(entity) {
		let matches = this.constructor.criteria.matches(entity);
		let exists = this.has(entity);
		if (matches && !exists) this.add(entity);
		if (!matches && exists) this.remove(entity);
		return this;
	}

	syncAll(...entities) {
		if (!entities.length) entities = this.entities;
		for (let entity of entities) this.sync(entity);
		return this;
	}

	toggle(active) {
		return (this.active = (typeof active === 'boolean') ? active : !this.active);
	}

	start() { return this.toggle(true); }

	stop() { return this.toggle(false); }

	// update() {}

	// render() {}
}
