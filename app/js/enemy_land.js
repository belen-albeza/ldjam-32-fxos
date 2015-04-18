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

  this.init();
}

LandEnemy.prototype = Object.create(Phaser.Sprite.prototype);
LandEnemy.prototype.constructor = LandEnemy;

LandEnemy.prototype.init = function () {
  this.lastInWorld = this.inWorld;
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

LandEnemy.prototype.update = function () {
  this.lastInWorld = this.inWorld;
};

LandEnemy.prototype.flipDirection = function () {
  this.move(this.body.velocity.x > 0 ? -1 : 1);
};


module.exports = LandEnemy;
