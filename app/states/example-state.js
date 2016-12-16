const THREE = require('three');
import STATE_EVENTS from '../constants/state-events';
import Secs from '../secs/secs';
import Render3System from '../systems/render3';
import RenderSystem from '../systems/render';
import Player from '../entities/player';
import Model from '../display/model';

const width = 300;
const height = 300;

export default class ExampleState extends Phaser.State {
	map = null;
	layer = null;

	create() {
		this.secs = new Secs();

		window.PEW.state = this;
		this.map = this.add.tilemap('example-map');
		this.map.addTilesetImage('background');
		this.map.setCollision([ 1 ]);

		this.layer = this.map.createLayer('Example Map');
		this.layer.resizeWorld();
		// this.layer.debug = true;

		this.three();

		this.secs.addSystem(new RenderSystem());
		this.secs.addSystem(new Render3System());

		const modelFile = 'assets/models/marine/marine_anims_core.json';
		this.player = new Player({
			position: new Phaser.Point(96, 32),
			model: new Model(this.scene, modelFile)
		});
		window.PEW.player = this.player;

		this.player2 = new Player({
			position: new Phaser.Point(256, 64),
			model: new Model(this.scene, modelFile)
		});

		this.game.trigger(STATE_EVENTS.EXAMPLE_COMPLETED);
	}

	update() {
		this.secs.update();

		this.player.update();
		this.player2.update();
	}

	render() {
		this.secs.render();

		this.renderer.render(this.scene, this.camera);
		const canvas = document.getElementsByTagName('canvas')[1];
		const baseTexture = PIXI.BaseTexture.fromCanvas(canvas);
		// this.player.sprite.setTexture(new PIXI.Texture(baseTexture, new Phaser.Rectangle(0, 0, 50, 100)));
		// this.player2.sprite.setTexture(new PIXI.Texture(baseTexture, new Phaser.Rectangle(80, 0, 50, 100)));
	}

	three() {
		this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		this.renderer.setSize(width, height);
		document.body.appendChild(this.renderer.domElement);

		this.scene = new THREE.Scene();
		this.scene.add(new THREE.AmbientLight(0xffffff));
		this.camera = new THREE.OrthographicCamera(-width, width, height, -height, 1, 1000);
		this.camera.position.set(0.0, 100, 400);
	}
}
