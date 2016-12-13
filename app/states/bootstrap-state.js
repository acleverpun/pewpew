import STATE_EVENTS from '../constants/state-events';

export default class BootstrapState extends Phaser.State {
	preload() {
		this.load.image('loader', 'assets/images/loader.png');
	}

	create() {
		this.game.stage.backgroundColor = 0x000000;
		this.game.trigger(STATE_EVENTS.BOOTSTRAP_COMPLETED);
	}

	update() {
	}

	render() {
	}
}
