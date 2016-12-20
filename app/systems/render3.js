const THREE = require('three');
import { System } from '../secs';
import Model from '../display/model';
import Sprite from '../display/sprite';

const width = 300;
const height = 300;

export default class Render3System extends System {
	static criteria = new System.Criteria([ 'modelFile' ]);

	constructor() {
		super(...arguments);

		this.clock = new THREE.Clock();
		this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		this.renderer.setSize(width, height);
		this.canvas = this.renderer.domElement;
		document.body.appendChild(this.canvas);

		this.scene = new THREE.Scene();
		this.scene.add(new THREE.AmbientLight(0xffffff));
		this.camera = new THREE.OrthographicCamera(-width, width, height, -height, 1, 1000);
		this.camera.position.set(0.0, 100, 400);
	}

	onAdd(entity) {
		entity.add(new Model(this.scene, entity.get('modelFile')));
		entity.add(new Sprite(entity.components.position));
	}

	update() {
		let dt = this.clock.getDelta();
		for (let [ , entity ] of this.entities) {
			let model = entity.get('model');
			if (model.isLoaded) model.value.update(dt);
		}
	}

	render() {
		this.renderer.render(this.scene, this.camera);
		const canvas = document.getElementsByTagName('canvas')[1];
		const baseTexture = PIXI.BaseTexture.fromCanvas(canvas);
		for (let [ , entity ] of this.entities) {
			entity.components.sprite.setTexture(new PIXI.Texture(baseTexture, new Phaser.Rectangle(0, 0, 50, 100)));
			// entity.components.sprite.setTexture(new PIXI.Texture(baseTexture, new Phaser.Rectangle(80, 0, 50, 100)));
		}
	}
}
