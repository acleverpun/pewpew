import { System } from '../secs';
import Sprite from '../display/sprite';

export default class Render3System extends System {
	static criteria = new System.Criteria([ 'model' ]);

	onAdd(entity) {
		entity.add(new Sprite(entity.components.position));
	}

	update() {
		for (let [ , entity ] of this.entities) {
		}
	}
}
