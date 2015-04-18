'use strict';

var SPEED = 275;
var JUMP_SPEED = 900;
var GRAVITY = 1800;

function Hero(game, x, y) {
  var img = 'hero';

  Phaser.Sprite.call(this, game, x, y, img);
  game.physics.enable(this);

  this.body.collideWorldBounds = true;
  this.body.gravity.y = GRAVITY;
  this.body.immovable = true;

  this.guitar = this.game.add.sprite(this.body.width,
                                     this.body.height / 2 + 10,
                                     'guitar');
  this.guitar.anchor.setTo(0.5, 0.5);
  this.addChild(this.guitar);

  this.init();
}

Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.init = function () {
  // clean up a slot
};

Hero.prototype.move = function (direction) {
  if (direction !== 0) { // -1 or 1 -> move left or right
    this.body.velocity.x = SPEED * (direction > 0 ? 1 : -1);
  }
  else { // 0 -> stop
    this.body.velocity.x = 0;
  }
};

Hero.prototype.jump = function () {
  // only jump when on the ground
  if (this.body.blocked.down) {
    this.body.velocity.y = -JUMP_SPEED;
  }
  // TODO: double jump
};

module.exports = Hero;
