'use strict';

var PlayScene = require('./play_scene.js');

var BootScene = {
  init: function () {
    // make the game occuppy all available space, but respecting
    // aspect ratio – with letterboxing if needed
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
  },

  preload: function () {
    // load here assets required for the preloader screen itself
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
      'background': 'background.png',
      'ground': 'ground.png',
      'hero': 'chara.png',
      'guitar': 'guitar.png',
      'walker': 'enemy00.png',
      'walker_hands': 'enemy00_hands.png',
      'bomber': 'bomber00.png',
      'bomber_wings': 'bomber00_wings.png',
      'bomb': 'bomb00.png',
      'particle': 'particle.png'
    };

    Object.keys(images).forEach(function (key) {
      this.game.load.image(key, 'images/' + images[key]);
    }.bind(this));

    this.game.load.spritesheet('buttons', 'images/buttons.png', 50, 50);

    // load sfx
    var sfx = {
      'jump': 'chara_jump.wav',
      'hit': 'hit.wav',
      'pickup': 'pickup.wav',
      'next_wave': 'next_wave.wav',
      'gameover': 'gameover.wav',
      'background': 'soundtrack.ogg'
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

function startGame() {
  var game = new Phaser.Game(900, 500, Phaser.AUTO);

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
}

window.onload = function () {
  // // for dev mode
  // document.querySelector('.overlay').style.display = 'none';
  // startGame();

  // for production
  document.getElementById('play').addEventListener('click', function (evt) {
    evt.preventDefault();
    // hide overlay
    document.querySelector('.overlay').style.display = 'none';
    // start game!
    startGame();
  });
};
