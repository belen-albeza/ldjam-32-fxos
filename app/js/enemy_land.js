'use strict';

var SPEED = 200;

function LandEnemy(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'enemy');
  this.anchor.setTo(0.5, 0.5);

  game.physics.enable(this, Phaser.Physics.ARCADE);

  this.checkWorldBounds = true;
  this.events.onOutOfBounds.add(function () {
    if (this.inWorld !== this.lastInWorld) {
      this.flipDirection();
    }
  }, this);

  this.tween = game.add.tween(this);

  this.init();
}

LandEnemy.prototype = Object.create(Phaser.Sprite.prototype);
LandEnemy.prototype.constructor = LandEnemy;

LandEnemy.prototype.init = function () {
  this.tween.stop();

  this.lastInWorld = this.inWorld;
  this.dying = false;

  this.move(this.body.x > 0 ? -1 : 1);
};

// TODO: this is repeated from Hero
LandEnemy.prototype.move = function (direction) {
  if (direction !== 0) { // -1 or 1 -> move left or right
    var sign = direction > 0 ? 1 : -1;
    this.body.velocity.x = SPEED * sign;
    this.scale.x = sign;
  }
  else {
    this.body.velocity.x = 0;
  }
};

LandEnemy.prototype.flipDirection = function () {
  this.move(this.body.velocity.x > 0 ? -1 : 1);
};

LandEnemy.prototype.die = function () {
  this.dying = true;
  this.move(0);

  // play dead animation
  this.tween.to({alpha: 0, tint: 0xff0000}, 200);
  this.tween.onComplete.add(this.kill, this);
  this.tween.start();
};

LandEnemy.prototype.update = function () {
  this.lastInWorld = this.inWorld;
};



module.exports = LandEnemy;
