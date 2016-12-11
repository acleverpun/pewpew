const THREE = require('three');
require('../blend-character');
import PLAYER from '../constants/player';
import STATE_EVENTS from '../constants/state-events';
import { Player } from '../models/player';

const width = 300;
const height = 300;

export class ExampleState extends Phaser.State {
	map = null;
	layer = null;

	create() {
		this.physics.startSystem(Phaser.Physics.ARCADE);

		this.map = this.add.tilemap('example-map');
		this.map.addTilesetImage('background');
		this.map.setCollision([ 1 ]);

		this.layer = this.map.createLayer('Example Map');
		this.layer.resizeWorld();
		// this.layer.debug = true;

		this.player = new Player(this.game, PLAYER.DEFAULT_X, PLAYER.DEFAULT_Y);
		window.player = this.player;
		this.game.trigger(STATE_EVENTS.EXAMPLE_COMPLETED);

		this.buttons = {
			up: this.input.keyboard.addKey(Phaser.Keyboard.UP),
			down: this.input.keyboard.addKey(Phaser.Keyboard.DOWN),
			left: this.input.keyboard.addKey(Phaser.Keyboard.LEFT),
			right: this.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
		};

		this.clock = new THREE.Clock();
		this.three();
	}

	update() {
		if (this.marine.rotation) {
			let rotation = 0;
			let anyDown = false;

			[ 'up', 'left', 'down', 'right' ].forEach((button, b) => {
				if (this.buttons[button].isDown) {
					anyDown = true;
					rotation += b * Math.PI / 2;
				}
			});

			if (this.buttons.up.isDown) this.player.y -= 1;
			if (this.buttons.down.isDown) this.player.y += 1;
			if (this.buttons.left.isDown) this.player.x -= 1;
			if (this.buttons.right.isDown) this.player.x += 1;

			if (!anyDown) rotation = this.marine.rotation.y;
			this.marine.rotation.y = rotation;

			if (anyDown && this.marine.mixer.clipAction('idle').isRunning()) {
				this.marine.stopAll();
				this.marine.play('walk', 1);
			}
			if (!anyDown && this.marine.mixer.clipAction('walk').isRunning()) {
				this.marine.stopAll();
				this.marine.play('idle', 1);
			}
		}

		let dt = this.clock.getDelta();
		if (this.marine.mixer) this.marine.update(dt);

		this.physics.arcade.collide(this.player, this.layer);
	}

	render() {
		this.game.debug.body(this.player);

		this.renderer.render(this.scene, this.camera);
		this.player.setTexture(PIXI.Texture.fromCanvas(document.getElementsByTagName('canvas')[1]));
	}

	three() {
		this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		this.renderer.setSize(width, height);
		document.body.appendChild(this.renderer.domElement);

		this.scene = new THREE.Scene();
		this.scene.add(new THREE.AmbientLight(0xffffff));
		this.camera = new THREE.OrthographicCamera(-width, width, height, -height, 1, 1000);

		this.marine = new THREE.BlendCharacter();
		window.marine = this.marine;
		this.marine.load('assets/models/marine/marine_anims_core.json', () => {
			const radius = this.marine.geometry.boundingSphere.radius;
			this.camera.position.set(0.0, radius, radius * 3.5);
			this.scene.add(this.marine);

			this.marine.rotation.x = Math.PI / 4;
			this.marine.rotation.y = Math.PI;
			this.marine.position.x = -width + radius / 2;
			this.marine.position.y = height - radius / 2;
			this.marine.stopAll();
			this.marine.play('idle', 1);
		});

		this.camera.position.z = 5;
	}
}
