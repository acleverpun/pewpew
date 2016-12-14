export default class Siren {
	constructor() {
		this.events = {};
	}

	on(event, fn) {
		if (!this.events[event]) this.events[event] = new Set();
		this.events[event].add(fn);
		return this;
	}

	off(event, fn) {
		let listeners = this.events[event];
		if (fn) listeners.delete(fn);
		if (!listeners.size || !fn) delete this.events[event];
	}

	emit(event, ...args) {
		let listeners = this.events[event];
		if (!listeners) return;
		for (let fn of listeners) fn(...args);
	}

	many(event, fn, count) {
		let wrapper = (...args) => {
			if (--count === 0) this.off(event, wrapper);
			fn(...args);
		};
		return this.on(event, wrapper);
	}

	once(event, fn) { return this.many(event, fn, 1); }
}
