export default class Sprite {
	constructor(game, position, key) {
		this.game = game;
		this.sprite = new Phaser.Sprite(this.game, position.x, position.y, key);
		// this.init();
	}

	init() {
		this.game.add.existing(this.sprite);
	}
}
