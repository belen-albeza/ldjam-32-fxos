'use strict';

function EnemyMixin (game, x, y, options) {
  options = options || {};

  Phaser.Sprite.call(this, game, x, y, options.image || 'enemy');
  this.anchor.setTo(0.5, 0.5);

  game.physics.enable(this, Phaser.Physics.ARCADE);

  this.checkWorldBounds = true;
  this.events.onOutOfBounds.add(function () {
    if (this.inWorld !== this.lastInWorld) {
      this.flipDirection();
    }
  }, this);

  this.tween = game.add.tween(this);

  this.init(options);
}

EnemyMixin.prototype = Object.create(Phaser.Sprite.prototype);
EnemyMixin.prototype.constructor = EnemyMixin;

// mixin for enemies
EnemyMixin.prototype.init = function (options) {
  this.tween.stop();
  this.alpha = 1;
  this.tint = 0xffffff;

  this.lastInWorld = false;
  this.dying = false;

  this.x = options.side === 'right' ? this.game.world.width + 100 : -100;

  this.move(this.x > 0 ? -1 : 1);
};

EnemyMixin.prototype.move = function (direction) {
  if (direction !== 0) { // -1 or 1 -> move left or right
    var sign = direction > 0 ? 1 : -1;
    this.body.velocity.x = this.SPEED * sign;
    this.scale.x = sign;
  }
  else {
    this.body.velocity.x = 0;
  }
};

EnemyMixin.prototype.flipDirection = function () {
  this.move(this.body.velocity.x > 0 ? -1 : 1);
};

EnemyMixin.prototype.die = function () {
  this.dying = true;
  this.move(0);

  // play dead animation
  this.tween.to({alpha: 0, tint: 0xff0000}, 200);
  this.tween.onComplete.add(this.kill, this);
  this.tween.start();
};

EnemyMixin.prototype.update = function () {
  this.lastInWorld = this.inWorld;
};

EnemyMixin.prototype.SPEED = 100;

module.exports = EnemyMixin;
