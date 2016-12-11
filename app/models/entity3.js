const THREE = require('three');
require('../blend-character');
import Entity from './entity';

export default class Entity3 extends Entity {

	constructor(game, position, key) {
		super(game, position, key);
		this.model = new THREE.BlendCharacter();
	}

}
