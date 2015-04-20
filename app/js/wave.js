'use strict';

var utils = require('./utils.js');

function Wave(data, group, throwablesGroup) {
  this.timer = group.game.time.create(true);

  data.forEach(function (enemy) {
    this.timer.add(enemy.offset, function () {
      utils.spawnSprite(group, enemy.klass, 0, 0, {
        side: enemy.side,
        throwables: throwablesGroup
      });
    }, this);
  }.bind(this));

  this.onDepleted = new Phaser.Signal();

  this.timer.onComplete.add(function () {
    this.timer = null;
    this.onDepleted.dispatch(this);
    this.depleted = true;
  }, this);
}

Wave.prototype.start = function () {
  this.timer.start();
};

Wave.prototype.destroy = function () {
  if (this.timer) {
    this.timer.destroy();
    this.timer = null;
  }
};

module.exports = Wave;
