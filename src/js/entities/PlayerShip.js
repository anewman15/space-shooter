import Phaser from 'phaser';
import Entity from './Entity';
import PlayerLaser from './PlayerLaser';

export default class PlayerShip extends Entity {
	constructor(scene, x, y, key) {
		super(scene, x, y, key, 'PlayerShip');
		this.setData('speed', 200);
		this.setData('isShooting', false);
		this.setData('timerShootDelay', 10);
		this.setData('timerShootTick', this.getData('timerShootDelay') - 1);
	}

	moveUp() {
		this.body.velocity.y = -this.getData('speed');
	}

	moveDown() {
		this.body.velocity.y = this.getData('speed');
	}

	moveLeft() {
		this.body.velocity.x = -this.getData('speed');
	}

	moveRight() {
		this.body.velocity.x = this.getData('speed');
	}

	update() {
		this.body.setVelocity(0, 0);
		this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
		this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);

		if (this.getData('isShooting')) {
			if (this.getData('timerShootTick') < this.getData('timerShootDelay')) {
				this.setData('timerShootTick', this.getData('timerShootTick') + 1);
			} else {
				const laser = new PlayerLaser(this.scene, this.x, this.y);
				this.scene.playerLasers.add(laser);

				this.scene.sfx.laser.play();
				this.setData('timerShootTick', 0);
			}
		}
	}

	onDestroy() {
		this.scene.time.addEvent({
			delay: 5000,
			callback: () => {
				this.scene.scene.start('GameOver');
			},
			callbackScope: this,
			loop: false,
		});
	}
}