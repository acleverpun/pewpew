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

		this.three();

		const modelFile = 'assets/models/marine/marine_anims_core.json';
		this.player = new Player(this.game, this.scene, new Phaser.Point(96, 32), modelFile, {
			up: this.input.keyboard.addKey(Phaser.Keyboard.K),
			down: this.input.keyboard.addKey(Phaser.Keyboard.J),
			left: this.input.keyboard.addKey(Phaser.Keyboard.H),
			right: this.input.keyboard.addKey(Phaser.Keyboard.L)
		});
		window.player = this.player;

		this.player2 = new Player(this.game, this.scene, new Phaser.Point(256, 64), modelFile, {
			up: this.input.keyboard.addKey(Phaser.Keyboard.UP),
			down: this.input.keyboard.addKey(Phaser.Keyboard.DOWN),
			left: this.input.keyboard.addKey(Phaser.Keyboard.LEFT),
			right: this.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
		});

		this.game.trigger(STATE_EVENTS.EXAMPLE_COMPLETED);
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
		this.camera.position.set(0.0, 100, 400);
	}

}
