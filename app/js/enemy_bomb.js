'use strict';

var GRAVITY = 1800;

function Bomb(game, x, y, options) {
  Phaser.Sprite.call(this, game, x, y, 'bomb');
  this.anchor.setTo(0.5, 0.5);

  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.gravity.y = GRAVITY;

  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;

  this.init(options);
}

Bomb.prototype = Object.create(Phaser.Sprite.prototype);
Bomb.prototype.constructor = Bomb;

Bomb.prototype.init = function (options) {
  this.body.gravity.y = GRAVITY;
  this.bomberId = options.bomberId;
};

module.exports = Bomb;
