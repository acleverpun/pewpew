import Entity from './entity';

let ctr = 0;

export default class Player extends Entity {
	constructor(...args) {
		super(...args);

		this.buttons = {
			up: this.game.input.keyboard.addKey(Phaser.Keyboard.K),
			down: this.game.input.keyboard.addKey(Phaser.Keyboard.J),
			left: this.game.input.keyboard.addKey(Phaser.Keyboard.H),
			right: this.game.input.keyboard.addKey(Phaser.Keyboard.L)
		};

		if (ctr++ === 1) {
			this.buttons = {
				up: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
				down: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
				left: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
				right: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
			};
		}
	}

	update() {
		if (this.buttons.up.isDown) this.y -= 1;
		if (this.buttons.down.isDown) this.y += 1;
		if (this.buttons.left.isDown) this.x -= 1;
		if (this.buttons.right.isDown) this.x += 1;

		if (this.isLoaded) {
			let rotation = 0;
			let anyDown = false;

			[ 'up', 'left', 'down', 'right' ].forEach((button, b) => {
				if (this.buttons[button].isDown) {
					anyDown = true;
					rotation += b * Math.PI / 2;
				}
			});

			if (!anyDown) rotation = this.model.rotation.y;
			this.model.rotation.y = rotation;

			if (anyDown && this.model.mixer.clipAction('idle').isRunning()) {
				this.model.stopAll();
				this.model.play('walk', 1);
			}
			if (!anyDown && this.model.mixer.clipAction('walk').isRunning()) {
				this.model.stopAll();
				this.model.play('idle', 1);
			}
		}

		let dt = this.clock.getDelta();
		if (this.isLoaded) this.model.update(dt);
	}
}