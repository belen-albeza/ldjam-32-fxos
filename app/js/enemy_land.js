'use strict';

var EnemyMixin = require('./enemy_common.js');

var INIT_Y = 280;

function LandEnemy(game, x, y, options) {
  options.image = 'walker';

  EnemyMixin.call(this, game, x, INIT_Y, options);

  this.hands = game.add.sprite(0, 5, 'walker_hands');
  this.hands.anchor.setTo(0.5, 0.5);
  this.addChild(this.hands);

  this.tweenHands = game.add.tween(this.hands);
  this.tweenHands.to({
    y: this.hands.y + 5
  }, 400, Phaser.Easing.Default, true, 0, -1, true);
}

LandEnemy.prototype = Object.create(EnemyMixin.prototype);
LandEnemy.prototype.constructor = LandEnemy;

LandEnemy.prototype.SPEED = 200;

LandEnemy.prototype.init = function (options) {
  EnemyMixin.prototype.init.call(this, options);
  this.y = INIT_Y;
};

module.exports = LandEnemy;
