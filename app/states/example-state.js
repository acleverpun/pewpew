import STATE_EVENTS from '../constants/state-events';
import Secs from '../secs/secs';
import Render3System from '../systems/render3';
import RenderSystem from '../systems/render';
import Player from '../entities/player';

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

		this.secs.addSystem(new RenderSystem());
		this.secs.addSystem(new Render3System());

		const modelFile = 'assets/models/marine/marine_anims_core.json';

		this.player = new Player({
			position: new Phaser.Point(96, 32),
			modelFile
		});
		window.PEW.player = this.player;

		this.player2 = new Player({
			position: new Phaser.Point(256, 64),
			modelFile
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
	}
}
