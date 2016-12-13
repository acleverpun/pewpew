export default class Criteria {
	constructor(all = [], any = [], none = []) {
		this.all = new Set(all);
		this.any = new Set(any);
		this.none = new Set(none);
	}

	// Returns whether the criteria matches the given entity
	matches(entity) {
		for (let component of this.all) if (!entity.has(component)) return false;
		for (let component of this.none) if (entity.has(component)) return false;
		let hasAny = false;
		for (let component in this.any) {
			if (entity.has(component)) return true;
			hasAny = true;
		}
		return !hasAny;
	}

	// Returns whether the criteria involves the given component
	involves(component) {
		return this.all.has(component) || this.any.has(component) || this.none.has(component);
	}
}
