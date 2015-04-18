'use strict';

var EnemyMixin = require('./enemy_common.js');

function LandEnemy(game, x, y, options) {
  options.image = 'enemy';
  EnemyMixin.call(this, game, x, y, options);
}

LandEnemy.prototype = Object.create(EnemyMixin.prototype);
LandEnemy.prototype.constructor = LandEnemy;

LandEnemy.prototype.SPEED = 200;

module.exports = LandEnemy;
