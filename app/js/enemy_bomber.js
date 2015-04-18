'use strict';

var EnemyMixin = require('./enemy_common.js');

var INIT_Y = 150;

function BomberEnemy(game, x, y, options) {
  options.image = 'bomber';
  EnemyMixin.call(this, game, x, INIT_Y, options);
}

BomberEnemy.prototype = Object.create(EnemyMixin.prototype);
BomberEnemy.prototype.constructor = BomberEnemy;

BomberEnemy.prototype.SPEED = 180;

BomberEnemy.prototype.init = function (options) {
  EnemyMixin.prototype.init.call(this, options);
  this.y = INIT_Y;
};

module.exports = BomberEnemy;
