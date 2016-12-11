const THREE = require('three');
import STATE_EVENTS from '../constants/state-events';
import Player from '../models/player';

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

		this.player = new Player(this.game, new Phaser.Point(96, 32), {
			up: this.input.keyboard.addKey(Phaser.Keyboard.K),
			down: this.input.keyboard.addKey(Phaser.Keyboard.J),
			left: this.input.keyboard.addKey(Phaser.Keyboard.H),
			right: this.input.keyboard.addKey(Phaser.Keyboard.L)
		});
		window.player = this.player;

		this.player2 = new Player(this.game, new Phaser.Point(256, 64), {
			up: this.input.keyboard.addKey(Phaser.Keyboard.UP),
			down: this.input.keyboard.addKey(Phaser.Keyboard.DOWN),
			left: this.input.keyboard.addKey(Phaser.Keyboard.LEFT),
			right: this.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
		});

		this.game.trigger(STATE_EVENTS.EXAMPLE_COMPLETED);

		this.three();
	}

	update() {
		this.player.update();
		this.player2.update();
	}

	render() {
		this.game.debug.body(this.player);
		this.game.debug.body(this.player2);

		this.renderer.render(this.scene, this.camera);
		const canvas = document.getElementsByTagName('canvas')[1];
		const baseTexture = PIXI.BaseTexture.fromCanvas(canvas);
		this.player.sprite.setTexture(new PIXI.Texture(baseTexture, new Phaser.Rectangle(0, 0, 50, 100)));
		this.player2.sprite.setTexture(new PIXI.Texture(baseTexture, new Phaser.Rectangle(80, 0, 50, 100)));
	}

	three() {
		this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		this.renderer.setSize(width, height);
		document.body.appendChild(this.renderer.domElement);

		this.scene = new THREE.Scene();
		this.scene.add(new THREE.AmbientLight(0xffffff));
		this.camera = new THREE.OrthographicCamera(-width, width, height, -height, 1, 1000);

		const origin = { x: -width, y: height };

		this.player.model.load('assets/models/marine/marine_anims_core.json', () => {
			const radius = this.player.model.geometry.boundingSphere.radius;
			this.camera.position.set(0.0, radius, radius * 3.5);
			this.scene.add(this.player.model);

			this.player.model.rotation.x = Math.PI / 4;
			this.player.model.rotation.y = Math.PI;
			this.player.model.position.x = origin.x + radius / 2;
			this.player.model.position.y = origin.y - radius / 2;
			this.player.model.stopAll();
			this.player.model.play('idle', 1);
		});

		this.player2.model.load('assets/models/marine/marine_anims_core.json', () => {
			const radius = this.player2.model.geometry.boundingSphere.radius;
			this.scene.add(this.player2.model);

			this.player2.model.rotation.x = Math.PI / 4;
			this.player2.model.rotation.y = Math.PI;
			this.player2.model.position.x = origin.x + radius * 2;
			this.player2.model.position.y = origin.y - radius / 2;
			this.player2.model.stopAll();
			this.player2.model.play('idle', 1);
		});

		this.camera.position.z = 5;
	}

}
