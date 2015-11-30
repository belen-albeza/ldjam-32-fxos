'use strict';

var EnemyMixin = require('./enemy_common.js');
var Bomb = require('./enemy_bomb.js');
var utils = require('./utils.js');

var INIT_Y = 70;

var currentId = 1;

function BomberEnemy(game, x, y, options) {
  options.image = 'bomber';
  EnemyMixin.call(this, game, x, INIT_Y, options);

  this.bombsGroup = options.throwables;

  this.wings = game.add.sprite(0, 12, 'bomber_wings');
  this.wings.anchor.setTo(0.5, 0.5);
  this.addChild(this.wings);

  this.tweenWings = game.add.tween(this.wings);
  this.tweenWings.to({
    y: this.wings.y + 5
  }, 400, Phaser.Easing.Default, true, 0, -1, true);
}

BomberEnemy.prototype = Object.create(EnemyMixin.prototype);
BomberEnemy.prototype.constructor = BomberEnemy;

BomberEnemy.prototype.SPEED = 180;

BomberEnemy.prototype.init = function (options) {
  EnemyMixin.prototype.init.call(this, options);
  this.y = INIT_Y;

  this.bomberId = currentId++;
};

BomberEnemy.prototype.update = function () {
  if (!this.exists) { return; }

  EnemyMixin.prototype.update.call(this);

  if (!this.dying && this.game.rnd.between(0, 100) < 3) {
    utils.spawnSprite(this.bombsGroup, Bomb, this.x, this.y + 30, {
      bomberId: this.bomberId
    });
  }
};

module.exports = BomberEnemy;
