const THREE = require('three');
require('../blend-character');
import GAME from '../constants/game';
import PLAYER from '../constants/player';
import STATE_EVENTS from '../constants/state-events';
import { Player } from '../models/player';

const width = 300;
const height = 150;

export class ExampleState extends Phaser.State {
	map = null;
	layer = null;

	create() {
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.gravity.y = GAME.GRAVITY;

		this.map = this.add.tilemap('example-map');
		this.map.addTilesetImage('background');
		this.map.setCollision([ 1 ]);

		this.layer = this.map.createLayer('Example Map');
		this.layer.resizeWorld();
		// this.layer.debug = true;

		this.game.player = new Player(this.game, PLAYER.DEFAULT_X, PLAYER.DEFAULT_Y);
		this.game.trigger(STATE_EVENTS.EXAMPLE_COMPLETED);

		this.clock = new THREE.Clock();
		this.three();
	}

	update() {
		let dt = this.clock.getDelta();
		if (this.marine.mixer) this.marine.update(dt);

		this.physics.arcade.collide(this.game.player, this.layer);
	}

	render() {
		// this.game.debug.body(this.game.player);

		this.renderer.render(this.scene, this.camera);
		this.game.player.setTexture(PIXI.Texture.fromCanvas(document.getElementsByTagName('canvas')[1]));
	}

	three() {
		this.renderer = new THREE.WebGLRenderer({ alpha: true });
		this.renderer.setSize(width, height);
		document.body.appendChild(this.renderer.domElement);

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);

		this.marine = new THREE.BlendCharacter();
		window.marine = this.marine;
		this.marine.load('assets/models/marine/marine_anims_core.json', () => {
			const radius = this.marine.geometry.boundingSphere.radius;
			this.camera.position.set(0.0, radius, radius * 3.5);
			this.marine.rotation.y = Math.PI * -135 / 180;
			this.scene.add(this.marine);

			this.marine.play('walk', 1);
		});

		this.camera.position.z = 5;
	}
}
