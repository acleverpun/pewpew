import Criteria from './criteria';

export default class System {
	static Criteria = Criteria;
	static criteria = new Criteria();

	active = true;

	constructor() {
		this.entities = new Map();
	}

	get(id) { return this.entities.get(id); }

	getAll() { return this.entities; }

	getCriteria() { return this.constructor.criteria; }

	add(entity) {
		this.entities.set(entity.id, entity);
		return this;
	}

	addAll(...entities) {
		for (let entity of entities) this.add(entity);
		return this;
	}

	remove(entity) {
		for (let [ id, ent ] of this.entities) {
			if (entity === ent || entity === id) {
				this.entities.delete(id);
				break;
			}
		}
		return this;
	}

	removeAll(...entities) {
		for (let entity of entities) this.remove(entity);
		return this;
	}

	has(entity) {
		if (typeof entity === 'string') return this.entities.has(entity);
		for (let [ , ent ] of this.entities) if (entity === ent) return true;
		return false;
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
		this.active = (typeof active === 'boolean') ? active : !this.active;
		return this.active;
	}

	start() { return this.toggle(true); }

	stop() { return this.toggle(false); }
}
