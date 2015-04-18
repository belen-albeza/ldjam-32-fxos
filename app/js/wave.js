'use strict';

var utils = require('./utils.js');

function Wave(data, group) {
  this.timer = group.game.time.create(true);

  data.forEach(function (enemy) {
    this.timer.add(enemy.offset, function () {
      utils.spawnSprite(group, enemy.klass, 0, 0, { side: enemy.side });
    }, this);
  }.bind(this));

  this.onDepleted = new Phaser.Signal();

  this.timer.onComplete.add(function () {
    this.timer = null;
    this.onDepleted.dispatch(this);
  }, this);

  this.timer.start();
}

module.exports = Wave;
