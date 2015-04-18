'use strict';

var EnemyMixin = require('./enemy_common.js');

var INIT_Y = 375;

function LandEnemy(game, x, y, options) {
  options.image = 'enemy';
  EnemyMixin.call(this, game, x, 375, options);
}

LandEnemy.prototype = Object.create(EnemyMixin.prototype);
LandEnemy.prototype.constructor = LandEnemy;

LandEnemy.prototype.SPEED = 200;

LandEnemy.prototype.init = function (options) {
  EnemyMixin.prototype.init.call(this, options);
  this.y = INIT_Y;
};

module.exports = LandEnemy;
