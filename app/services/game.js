import Game from '../game';

const config = {
	width: 800,
	height: 480
};

export default new Game(config.width, config.height, 'app', Phaser.WEBGL);
