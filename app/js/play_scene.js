'use strict';

var Hero = require('./hero.js');
var LandEnemy = require('./enemy_land.js');
var BomberEnemy = require('./enemy_bomber.js');
var Wave = require('./wave.js');

function spawnWaves(group) {
  return [
    new Wave([
      {offset: 0, klass: LandEnemy, side: 'right'},
      {offset: 100, klass: LandEnemy, side: 'left'},
      {offset: 300, klass: LandEnemy, side: 'right'},
      {offset: 500, klass: BomberEnemy, side: 'right'},
      {offset: 1000, klass: LandEnemy, side: 'left'},
      {offset: 1300, klass: LandEnemy, side: 'right'},
      {offset: 1310, klass: LandEnemy, side: 'left'},
      {offset: 1310, klass: LandEnemy, side: 'left'},
      {offset: 2650, klass: LandEnemy, side: 'right'},
      {offset: 2700, klass: LandEnemy, side: 'left'}
    ], group)
  ];
}

var PlayScene = {
  create: function () {
    this.sfx = {
      jump: this.game.add.audio('jump'),
      hit: this.game.add.audio('hit'),
      pickup: this.game.add.audio('pickup')
    };

    // setup physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.setBounds(0, 0, 900, 420);

    // create ground
    this.ground = this.game.add.sprite(0, 500, 'ground');
    this.ground.anchor.setTo(0, 1);

    // create main character
    this.hero = new Hero(this.game, 300, 200);
    this.game.add.existing(this.hero);

    // setup enemies
    this.enemies = this.game.add.group();

    // setup input keys
    this.keys = this.game.input.keyboard.createCursorKeys();
    // this.keys.spacebar = this.game.input.keyboard.addKey(
    //   Phaser.Keyboard.SPACEBAR);
    this.keys.up.onDown.add(function () {
      if (this.hero.jump()) {
        this.sfx.jump.play();
      }
    }.bind(this));

    // game over and victory
    this.hero.events.onKilled.add(this.gameOver, this);

    // spawn enemies
    this.spawnLevel();
  },

  spawnLevel: function () {
    this.waves = spawnWaves(this.enemies);
    this.depletedWaves = 0;

    this.waves.forEach(function (x) {
      x.onDepleted.add(function () {
        this.depletedWaves++;
      }, this);
    }.bind(this));
  },

  update: function () {
    this.updateInput();
    this.detectCollisions();

    // check for victory -> no more enemies
    if (this.depletedWaves >= this.waves.length &&
      this.enemies.countLiving() === 0) {
      // TODO: call victory
      this.victory();
    }
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
    this.game.physics.arcade.overlap(this.hero.guitar, this.enemies,
    function (hero, enemy) {
      enemy.die();
      this.sfx.hit.play();
    }, function (hero, enemy) {
      return !enemy.dying;
    }, this);

    // enemies can kill hero
    this.game.physics.arcade.overlap(this.hero, this.enemies,
    function (hero) {
      hero.kill();
      hero.guitar.kill();
      this.sfx.hit.play();
    }, function (hero, enemy) { // process function
      return !enemy.dying;
    }, this);
  },

  gameOver: function () {
    // TODO: proper game over plz
    console.log('** game over **');
    this.game.state.start('play'); // restart the game for now
  },

  victory: function () {
    // TODO: proper victory plz
    console.log('** victory **');
    // re-spawn level
    this.spawnLevel();
  }
};

module.exports = PlayScene;
