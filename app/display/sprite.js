import game from './services/game';

export default class Sprite {
	constructor(position, key) {
		this.sprite = new Phaser.Sprite(game, position.x, position.y, key);
		// this.init();
	}

	init() {
		game.add.existing(this.sprite);
	}
}
