const THREE = require('three');
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

		this.renderer = new THREE.WebGLRenderer({ alpha: true });
		this.renderer.setSize(width, height);
		document.body.appendChild(this.renderer.domElement);

		this.three();
	}

	update() {
		this.physics.arcade.collide(this.game.player, this.layer);
		this.cube.rotation.x += 0.1;
		this.cube.rotation.y += 0.1;
	}

	render() {
		// this.game.debug.body(this.game.player);

		this.renderer.render(this.scene, this.camera);
		this.game.player.setTexture(PIXI.Texture.fromCanvas(document.getElementsByTagName('canvas')[1]));
	}

	three() {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
		this.cube = new THREE.Mesh(geometry, material);
		this.scene.add(this.cube);

		this.camera.position.z = 5;
	}
}
