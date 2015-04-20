'use strict';

var Hero = require('./hero.js');
var LandEnemy = require('./enemy_land.js');
var BomberEnemy = require('./enemy_bomber.js');
var Wave = require('./wave.js');

var GREEN = '#aded4f';
var RED = '#e40f00';

function setupWaves(group, throwables) {
  return [
    new Wave([
      {offset: 0, klass: LandEnemy, side: 'right'},
      {offset: 500, klass: LandEnemy, side: 'right'}
    ], group, throwables),

    new Wave([
      {offset: 0, klass: LandEnemy, side: 'right'},
      {offset: 200, klass: LandEnemy, side: 'right'},
      {offset: 200, klass: LandEnemy, side: 'left'},
      {offset: 1000, klass: BomberEnemy, side: 'right'},
    ], group, throwables),

    new Wave([
      {offset: 0, klass: LandEnemy, side: 'right'},
      {offset: 100, klass: LandEnemy, side: 'left'},
      {offset: 300, klass: LandEnemy, side: 'right'},
      {offset: 1000, klass: LandEnemy, side: 'left'},
      {offset: 1300, klass: LandEnemy, side: 'right'},
      {offset: 1310, klass: LandEnemy, side: 'left'},
      {offset: 1310, klass: LandEnemy, side: 'left'},
      {offset: 2000, klass: BomberEnemy, side: 'right'},
      {offset: 2650, klass: LandEnemy, side: 'right'},
      {offset: 2700, klass: LandEnemy, side: 'left'}
    ], group, throwables),

    new Wave([
      {offset: 0, klass: LandEnemy, side: 'right'},
      {offset: 100, klass: LandEnemy, side: 'left'},
      {offset: 300, klass: LandEnemy, side: 'right'},
      {offset: 1000, klass: BomberEnemy, side: 'left'},
      {offset: 1300, klass: BomberEnemy, side: 'right'},
      {offset: 1310, klass: LandEnemy, side: 'left'},
      {offset: 1310, klass: LandEnemy, side: 'left'},
      {offset: 2000, klass: BomberEnemy, side: 'right'},
    ], group, throwables),

    new Wave([
      {offset: 0, klass: LandEnemy, side: 'right'},
      {offset: 100, klass: LandEnemy, side: 'left'},
      {offset: 200, klass: LandEnemy, side: 'right'},
      {offset: 500, klass: BomberEnemy, side: 'left'},
      {offset: 1300, klass: LandEnemy, side: 'left'},
      {offset: 1300, klass: BomberEnemy, side: 'left'},
      {offset: 1500, klass: LandEnemy, side: 'right'},
    ], group, throwables)
  ];
}

function enemiesVsHero(hero) {
  hero.kill();
  hero.guitar.kill();
  this.sfx.hit.play();
}

var isGameOver = false;

var PlayScene = {
  create: function () {
    this.sfx = {
      jump: this.game.add.audio('jump'),
      hit: this.game.add.audio('hit'),
      pickup: this.game.add.audio('pickup'),
      next: this.game.add.audio('next_wave'),
      gameover: this.game.add.audio('gameover')
    };
    this.soundtrack = this.game.add.audio('background');
    this.soundtrack.loopFull(0.8);

    // setup physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.world.setBounds(0, 0, 900, 430);

    // setup decoration
    this.background = this.game.add.sprite(0, 0, 'background');
    this.ground = this.game.add.sprite(0, 500, 'ground');
    this.ground.anchor.setTo(0, 1);

    // setup enemies
    // see how I digged my own grave because I didn't use composition :_(
    this.enemyThrowables = this.game.add.group();
    this.enemies = this.game.add.group();

    // create main character
    this.hero = new Hero(this.game, 300, 200);
    this.game.add.existing(this.hero);

    // setup input keys
    this.keys = this.game.input.keyboard.createCursorKeys();
    this.keys.up.onDown.add(function () {
      if (this.hero.alive && this.hero.jump()) {
        this.sfx.jump.play();
      }
    }.bind(this));

    // game over and victory
    this.hero.events.onKilled.add(this.gameOver, this);

    // spawn enemies
    this.spawnLevel();

    isGameOver = false;

    // setup UI
    this.ui = this.game.add.group();
    this.createUI();
  },

  createUI: function () {
    var fontStyle = {
      font: '40px Bangers',
      fill: GREEN
    };

    this.waveText = this.game.add.text(10, 0, 'Wave #1 ', fontStyle);
    this.waveText.setShadow(-4, 4, '#000', 0);
    this.ui.add(this.waveText);


    this.nextWaveText = this.game.add.text(450, 140, ' Next wave! ', {
      font: '50px Bangers',
      fill: GREEN
    });
    this.nextWaveText.anchor.setTo(0.5, 0.5);
    this.nextWaveText.setShadow(-4, 4, '#000', 0);
    this.nextWaveText.visible = false;

    this.ui.add(this.nextWaveText);
  },

  spawnLevel: function () {
    this.currentWave = 0;
    this.waves = setupWaves(this.enemies, this.enemyThrowables);

    // start the first wave
    if (this.waves.length > 0) {
      this.waves[0].start();
    }
  },

  update: function () {
    this.updateInput();
    this.detectCollisions();

    // check for end of wave
    if (!isGameOver && this.waves.length > 0 &&
    this.enemies.countLiving() === 0 &&
    this.waves[this.currentWave].depleted) {
      this.sfx.next.play();
      // all waves finished?
      if (this.currentWave >= this.waves.length - 1) {
        this.victory();
      }
      else { // still waves to go…
        this.nextWave();
      }
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
      // destroy bombers' bombs
      if (enemy.bomberId) {
        this.enemyThrowables.forEachAlive(function (x) {
          if (x.bomberId === enemy.bomberId) {
            x.kill();
          }
        });
      }
    }, function (hero, enemy) {
      return !enemy.dying;
    }, this);

    // enemies can kill hero
    this.game.physics.arcade.overlap(this.hero, this.enemies, enemiesVsHero,
    function (hero, enemy) { // process function
      return !enemy.dying;
    }, this);

    // enemy throwables can kill hero too
    this.game.physics.arcade.overlap(this.hero, this.enemyThrowables,
    enemiesVsHero, function (hero, enemy) { // process function
      return !enemy.dying;
    }, this);
  },

  gameOver: function () {
    // TODO: proper game over plz
    console.log('** game over **');

    isGameOver = true;
    this.sfx.gameover.play();

    // create game over text
    var banner = this.game.add.text(450, 200, ' Game Over ', {
      font: '60px Bangers',
      fill: GREEN
    });
    banner.anchor.set(0.5, 0.5);
    banner.setShadow(-4, 4, '#000', 0);

    // create misc text
    var button = this.game.add.text(450, 260, '- click to restart -', {
      font: '24px Courier, "Courier New", monospace',
      fill: '#fff'
    });
    button.anchor.set(0.5, 0.5);
    button.setShadow(-2, 2, '#000', 0);
    button.inputEnabled = true;
    button.input.useHandCursor = true;
    button.events.onInputUp.add(function () {
      this.wrathOfGod();
      this.game.state.restart(true, false); // restart the game for now
    }, this);
    button.events.onInputOver.add(function () {
      button.fill = RED;
    }, this);
    button.events.onInputOut.add(function () {
      button.fill = '#fff';
    });

    this.ui.add(banner);
    this.ui.add(button);
  },

  victory: function () {
    // TODO: proper victory plz with fireworks and particles and…
    console.log('** victory **');
    isGameOver = true;

    // Yes, REPEATED from gameOver but it's late and I DON'T CARE :)

    // create game over text
    var banner = this.game.add.text(450, 200, ' Victory! ', {
      font: '60px Bangers',
      fill: GREEN
    });
    banner.anchor.set(0.5, 0.5);
    banner.setShadow(-4, 4, '#000', 0);

    // create misc text
    var button = this.game.add.text(450, 260, '- click to restart -', {
      font: '24px Courier, "Courier New", monospace',
      fill: '#fff'
    });
    button.anchor.set(0.5, 0.5);
    button.setShadow(-2, 2, '#000', 0);
    button.inputEnabled = true;
    button.input.useHandCursor = true;
    button.events.onInputUp.add(function () {
      this.wrathOfGod();
      this.game.state.restart(true, false); // restart the game for now
    }, this);
    button.events.onInputOver.add(function () {
      button.fill = RED;
    }, this);
    button.events.onInputOut.add(function () {
      button.fill = '#fff';
    });

    this.ui.add(banner);
    this.ui.add(button);
  },

  nextWave: function () {
    this.currentWave++;
    this.waves[this.currentWave].start();
    // update UI
    this.waveText.setText('Wave #' + (this.currentWave + 1) + ' ');

    this.nextWaveText.visible = true;
    this.nextWaveText.alpha = 1;
    var tween = this.game.add.tween(this.nextWaveText);
    tween.to({alpha: 0}, 100, Phaser.Easing.LINEAR, false, 0, 4, true)
      .to({alpha: 0}, 300, Phaser.Easing.LINEAR, false, 400);

    tween.onComplete.add(function () {
      this.nextWaveText.visible = false;
    }, this);

    tween.start();
  },

  wrathOfGod: function () {
    // clean up previous waves (and their events)
    if (this.waves) {
      this.waves.forEach(function (wave) {
        wave.destroy();
      });
    }

    this.enemies.removeChildren();
    this.soundtrack.stop();
  }
};

module.exports = PlayScene;
