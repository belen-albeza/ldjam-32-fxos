'use strict';

var utils = require('./utils.js');
var Hero = require('./hero.js');
var LandEnemy = require('./enemy_land.js');

var PlayScene = {
  create: function () {
    // setup physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.setBounds(0, 0, 900, 420);

    // create ground
    this.ground = this.game.add.sprite(0, 500, 'ground');
    this.ground.anchor.setTo(0, 1);

    // create main character
    this.hero = new Hero(this.game, 100, 200);
    this.game.add.existing(this.hero);

    // setup enemies
    this.enemies = this.game.add.group();
    utils.spawnSprite(this.enemies, LandEnemy, 950, 375);

    // setup input keys
    this.keys = this.game.input.keyboard.createCursorKeys();
    // this.keys.spacebar = this.game.input.keyboard.addKey(
    //   Phaser.Keyboard.SPACEBAR);
    this.keys.up.onDown.add(function () {
      this.hero.jump();
    }.bind(this));

    // game over and victory
    this.hero.events.onKilled.add(this.gameOver, this);
  },

  update: function () {
    this.updateInput();
    this.detectCollisions();
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
  },

  detectCollisions: function () {
    // guitar can kill enemies
    this.game.physics.arcade.overlap(this.hero.guitar, this.enemies, function (hero, enemy) {
      enemy.die();
    }, function (hero, enemy) {
      return !enemy.dying;
    });

    // enemies can kill hero
    this.game.physics.arcade.overlap(this.hero, this.enemies, function (hero, enemy) {
      hero.kill();
      hero.guitar.kill();
    }, function (hero, enemy) { // process function
      return !enemy.dying;
    });
  },

  gameOver: function () {
    // TODO: proper game over plz
    console.log('** game over **');
    this.game.state.start('play'); // restart the game for now
  }
};

module.exports = PlayScene;
