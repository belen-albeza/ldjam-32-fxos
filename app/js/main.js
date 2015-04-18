'use strict';

var PlayScene = require('./play_scene.js');

var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};

var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // load images
    var images = {
      'ground': 'ground.png',
      'hero': 'chara.png',
      'guitar': 'guitar.png',
      'enemy': 'enemy00.png',
      'bomber': 'bomber00.png'
    };

    Object.keys(images).forEach(function (key) {
      this.game.load.image(key, 'images/' + images[key]);
    }.bind(this));

    // load sfx
    var sfx = {
      'jump': 'chara_jump.wav',
      'hit': 'hit.wav',
      'pickup': 'pickup.wav'
    };
    Object.keys(sfx).forEach(function (key) {
      this.game.load.audio(key, 'audio/' + sfx[key]);
    }.bind(this));

    // TODO: load sfx
  },

  create: function () {
    this.game.state.start('play');
  }
};

window.onload = function () {
  var game = new Phaser.Game(900, 500, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};
