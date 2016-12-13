const THREE = require('three');
require('../blend-character');

const width = 300;
const height = 300;
let ctr = 0;

export default class Model {
	constructor(game, scene, file) {
		this.scene = scene;
		this.model = new THREE.BlendCharacter();
		this.isLoaded = false;

		this.model.load(file, () => this.init());
	}

	init() {
		const origin = { x: -width, y: height };

		const radius = this.model.geometry.boundingSphere.radius;
		this.scene.add(this.model);

		this.model.rotation.x = Math.PI / 4;
		this.model.rotation.y = Math.PI;
		this.model.position.x = origin.x + radius / 2;
		if (ctr++ === 1) this.model.position.x = origin.x + radius * 2;
		this.model.position.y = origin.y - radius / 2;
		this.model.stopAll();
		this.model.play('idle', 1);

		this.isLoaded = true;
	}
}
