const THREE = require('three');
require('../blend-character');

const width = 300;
const height = 300;
let ctr = 0;

export default class Model {
	constructor(scene, file) {
		this.scene = scene;
		this.value = new THREE.BlendCharacter();
		this.isLoaded = false;

		this.value.load(file, () => this.init());
	}

	init() {
		const origin = { x: -width, y: height };

		const radius = this.value.geometry.boundingSphere.radius;
		this.scene.add(this.value);

		this.value.rotation.x = Math.PI / 4;
		this.value.rotation.y = Math.PI;
		this.value.position.x = origin.x + radius / 2;
		if (ctr++ === 1) this.value.position.x = origin.x + radius * 2;
		this.value.position.y = origin.y - radius / 2;
		this.value.stopAll();
		this.value.play('idle', 1);

		this.isLoaded = true;
	}
}
