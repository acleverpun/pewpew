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
		window.state = this;
		this.map = this.add.tilemap('example-map');
		this.map.addTilesetImage('background');
		this.map.setCollision([ 1 ]);

		this.layer = this.map.createLayer('Example Map');
		this.layer.resizeWorld();
		// this.layer.debug = true;

		this.player = new Player(this.game, PLAYER.DEFAULT_X, PLAYER.DEFAULT_Y);
		window.player = this.player;
		this.player2 = new Player(this.game, PLAYER.DEFAULT_X + 90, PLAYER.DEFAULT_Y + 90);
		this.game.trigger(STATE_EVENTS.EXAMPLE_COMPLETED);

		this.buttons = {
			up: this.input.keyboard.addKey(Phaser.Keyboard.UP),
			down: this.input.keyboard.addKey(Phaser.Keyboard.DOWN),
			left: this.input.keyboard.addKey(Phaser.Keyboard.LEFT),
			right: this.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
			k: this.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_8),
			j: this.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_2),
			h: this.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_4),
			l: this.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_6),
		};

		this.clock = new THREE.Clock();
		this.three();
	}

	update() {
		if (this.buttons.up.isDown) this.player.y -= 1;
		if (this.buttons.down.isDown) this.player.y += 1;
		if (this.buttons.left.isDown) this.player.x -= 1;
		if (this.buttons.right.isDown) this.player.x += 1;

		if (this.buttons.k.isDown) this.player2.y -= 1;
		if (this.buttons.j.isDown) this.player2.y += 1;
		if (this.buttons.h.isDown) this.player2.x -= 1;
		if (this.buttons.l.isDown) this.player2.x += 1;

		if (this.marine.rotation) {
			let rotation = 0;
			let anyDown = false;

			[ 'up', 'left', 'down', 'right' ].forEach((button, b) => {
				if (this.buttons[button].isDown) {
					anyDown = true;
					rotation += b * Math.PI / 2;
				}
			});

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

		if (this.marine2.rotation) {
			let rotation = 0;
			let anyDown = false;

			[ 'k', 'h', 'j', 'l' ].forEach((button, b) => {
				if (this.buttons[button].isDown) {
					anyDown = true;
					rotation += b * Math.PI / 2;
				}
			});

			if (!anyDown) rotation = this.marine2.rotation.y;
			this.marine2.rotation.y = rotation;

			if (anyDown && this.marine2.mixer.clipAction('idle').isRunning()) {
				this.marine2.stopAll();
				this.marine2.play('walk', 1);
			}
			if (!anyDown && this.marine2.mixer.clipAction('walk').isRunning()) {
				this.marine2.stopAll();
				this.marine2.play('idle', 1);
			}
		}

		let dt = this.clock.getDelta();
		if (this.marine.mixer) this.marine.update(dt);
		if (this.marine2.mixer) this.marine2.update(dt);
	}

	render() {
		this.game.debug.body(this.player);
		this.game.debug.body(this.player2);

		this.renderer.render(this.scene, this.camera);
		const canvas = document.getElementsByTagName('canvas')[1];
		const baseTexture = PIXI.BaseTexture.fromCanvas(canvas);
		this.player.setTexture(new PIXI.Texture(baseTexture, new Phaser.Rectangle(0, 0, 50, 100)));
		this.player2.setTexture(new PIXI.Texture(baseTexture, new Phaser.Rectangle(80, 0, 50, 100)));
	}

	three() {
		this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		this.renderer.setSize(width, height);
		document.body.appendChild(this.renderer.domElement);

		this.scene = new THREE.Scene();
		this.scene.add(new THREE.AmbientLight(0xffffff));
		this.camera = new THREE.OrthographicCamera(-width, width, height, -height, 1, 1000);

		this.marine = new THREE.BlendCharacter();
		this.marine2 = new THREE.BlendCharacter();
		window.marine = this.marine;
		window.marine2 = this.marine2;

		const origin = { x: -width, y: height };

		this.marine.load('assets/models/marine/marine_anims_core.json', () => {
			const radius = this.marine.geometry.boundingSphere.radius;
			this.camera.position.set(0.0, radius, radius * 3.5);
			this.scene.add(this.marine);

			this.marine.rotation.x = Math.PI / 4;
			this.marine.rotation.y = Math.PI;
			this.marine.position.x = origin.x + radius / 2;
			this.marine.position.y = origin.y - radius / 2;
			this.marine.stopAll();
			this.marine.play('idle', 1);
		});

		this.marine2.load('assets/models/marine/marine_anims_core.json', () => {
			const radius = this.marine2.geometry.boundingSphere.radius;
			this.scene.add(this.marine2);

			this.marine2.rotation.x = Math.PI / 4;
			this.marine2.rotation.y = Math.PI;
			this.marine2.position.x = origin.x + radius * 2;
			this.marine2.position.y = origin.y - radius / 2;
			this.marine2.stopAll();
			this.marine2.play('idle', 1);
		});

		this.camera.position.z = 5;
	}
}
