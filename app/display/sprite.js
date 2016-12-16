import game from '../services/game';

export default class Sprite extends Phaser.Sprite {
	constructor(position, texture) {
		super(game, position.x, position.y, texture);
	}
}
