import Entity from './entity';
import game from '../services/game';

let ctr = 0;

export default class Player extends Entity {
	constructor() {
		super(...arguments);

		this.buttons = {
			up: game.input.keyboard.addKey(Phaser.Keyboard.K),
			down: game.input.keyboard.addKey(Phaser.Keyboard.J),
			left: game.input.keyboard.addKey(Phaser.Keyboard.H),
			right: game.input.keyboard.addKey(Phaser.Keyboard.L)
		};

		if (ctr++ === 1) {
			this.buttons = {
				up: game.input.keyboard.addKey(Phaser.Keyboard.UP),
				down: game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
				left: game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
				right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
			};
		}
	}

	update() {
		if (this.buttons.up.isDown) this.y -= 1;
		if (this.buttons.down.isDown) this.y += 1;
		if (this.buttons.left.isDown) this.x -= 1;
		if (this.buttons.right.isDown) this.x += 1;

		if (this.components.model.isLoaded) {
			let rotation = 0;
			let anyDown = false;

			[ 'up', 'left', 'down', 'right' ].forEach((button, b) => {
				if (this.buttons[button].isDown) {
					anyDown = true;
					rotation += b * Math.PI / 2;
				}
			});

			let model = this.components.model.value;
			if (!anyDown) rotation = model.rotation.y;
			model.rotation.y = rotation;

			if (anyDown && model.mixer.clipAction('idle').isRunning()) {
				model.stopAll();
				model.play('walk', 1);
			}
			if (!anyDown && model.mixer.clipAction('walk').isRunning()) {
				model.stopAll();
				model.play('idle', 1);
			}
		}
	}
}
