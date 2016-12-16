import { System } from '../secs';
import game from '../services/game';

export default class RenderSystem extends System {
	static criteria = new System.Criteria([ 'sprite' ]);

	onAdd(entity) {
		game.add.existing(entity.get('sprite'));
	}

	onRemove(entity) {
		console.log('REMOVING');
		game.world.remove(entity.get('sprite'), true);
	}

	update() {
		for (let [ , entity ] of this.entities) {
		}
	}

	render() {
		for (let [ , entity ] of this.entities) {
			game.debug.body(entity.get('sprite'));
		}
	}
}
