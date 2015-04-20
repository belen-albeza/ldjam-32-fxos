'use strict';

var SPEED = 275;
var JUMP_SPEED = 900;
var GRAVITY = 1800;

function Hero(game, x, y) {
  var img = 'hero';

  Phaser.Sprite.call(this, game, x, y, img);
  this.anchor.setTo(0.5, 0.5);


  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.collideWorldBounds = true;
  this.body.gravity.y = GRAVITY;
  this.body.immovable = true;
  this.body.setSize(this.width / 2, this.height);


  // flames
  this.flames = game.add.emitter(50, 0, 300);
  this.addChild(this.flames);
  this.flames.makeParticles('particle');
  this.flames.gravity = -160;
  this.flames.setXSpeed(10);
  this.flames.setYSpeed(-100, -10);
  this.flames.setAlpha(0.5, 1);
  this.flames.minParticleScale = 0.5;
  this.flames.maxParticleScale = 6;
  this.flames.blendMode = 1;
  this.flames.setAll('tint', 0xffaa33);

  // guitar - sprite child
  this.guitar = game.add.sprite(25, 10, 'guitar');
  this.guitar.anchor.setTo(0.5, 0.5);
  this.guitar.angle = -10;
  game.physics.enable(this.guitar, Phaser.Physics.ARCADE);
  this.guitar.body.setSize(this.guitar.width * 0.8, this.guitar.height);
  this.addChild(this.guitar);

  this.tweenGuitar = game.add.tween(this.guitar);

  this.init();
}

Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function (direction) {
  if (direction !== 0) { // -1 or 1 -> move left or right
    var sign = direction > 0 ? 1 : -1;
    this.body.velocity.x = SPEED * sign;
    this.scale.x = sign;
  }
  else { // 0 -> stop
    this.body.velocity.x = 0;
  }
};

Hero.prototype.jump = function () {
  // only jump when on the ground
  if (this.body.blocked.down) {
    this.body.velocity.y = -JUMP_SPEED;
    return true;
  }
  // TODO: double jump
};

Hero.prototype.init = function () {
  this.tweenGuitar.stop();

  this.tweenGuitar.to({
    y: this.guitar.y + 4
  }, 200, Phaser.Easing.Default, true, 0, -1, true);

  this.flames.start(false, 500, 20);
};


module.exports = Hero;
