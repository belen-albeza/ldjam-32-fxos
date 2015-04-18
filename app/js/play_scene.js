'use strict';

var Hero = require('./hero.js');

var PlayScene = {
  create: function () {
    // setup physics
    this.game.world.setBounds(0, 0, 900, 420);

    // create ground
    this.ground = this.game.add.sprite(0, 500, 'ground');
    this.ground.anchor.setTo(0, 1);

    // create main character
    this.hero = new Hero(this.game, 100, 200);
    this.game.add.existing(this.hero);

    // setup input keys
    this.keys = this.game.input.keyboard.createCursorKeys();
    // this.keys.spacebar = this.game.input.keyboard.addKey(
    //   Phaser.Keyboard.SPACEBAR);
    this.keys.up.onDown.add(function () {
      this.hero.jump();
    }.bind(this));
  },

  update: function () {
    this.updateInput();
  },

  updateInput: function () {
    if (this.keys.left.isDown) {
      this.hero.move(-1);
    }
    else if (this.keys.right.isDown) {
      this.hero.move(1);
    }
    else {
      this.hero.move(0);
    }
  }
};

module.exports = PlayScene;
