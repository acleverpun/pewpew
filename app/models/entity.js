export default class Entity {

	constructor(game, position, key) {
		this.game = game;
		this.sprite = new Phaser.Sprite(this.game, position.x, position.y, key);
		this.game.add.existing(this.sprite);
	}

	get position() { return this.sprite.position; }

	get x() { return this.sprite.position.x; }
	set x(value) { return (this.sprite.position.x = value); }

	get y() { return this.sprite.position.y; }
	set y(value) { return (this.sprite.position.y = value); }

}
