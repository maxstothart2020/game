'use strict';

EPT.Preloader = function (game) {};
EPT.Preloader.prototype = {
  preload: function preload() {
    var preloadBG = this.add.sprite((this.world.width - 580) * 0.5, (this.world.height + 150) * 0.5, 'loading-background');
    var preloadProgress = this.add.sprite((this.world.width - 540) * 0.5, (this.world.height + 170) * 0.5, 'loading-progress');
    this.load.setPreloadSprite(preloadProgress);

    this._preloadResources();
  },
  _preloadResources: function _preloadResources() {
    var pack = EPT.Preloader.resources;
    for (var method in pack) {
      pack[method].forEach(function (args) {
        var loader = this.load[method];
        loader && loader.apply(this.load, args);
      }, this);
    }
  },

  create: function create() {
    this.state.start('MainMenu', true, false, true);
  }
};
EPT.Preloader.resources = {
  image: [['overlay', 'img/overlay.png'], ['sponsor-logo', 'sponsor/logo.png']],
  spritesheet: [['button-start', 'img/button-start.png', 180, 180], ['button-pause', 'img/button-pause.png', 80, 80], ['player', 'img/player.png', 183, 179]],
  atlas: [['scenery', 'img/scenery.png', 'img/scenery.json'], ['collectibles', 'img/collectibles.png', 'img/collectibles.json'], ['custom-buttons', 'img/buttons.png', 'img/buttons.json'], ['ui', 'img/game-ui.png', 'img/game-ui.json']],
  audio: [['audio-click', ['sfx/click.m4a', 'sfx/click.mp3', 'sfx/click.ogg']], ['audio-highlight', ['sfx/highlight.m4a', 'sfx/highlight.mp3', 'sfx/highlight.ogg']], ['audio-gameover', ['sfx/game-over.m4a', 'sfx/game-over.mp3', 'sfx/game-over.ogg']], ['coin-01', ['sfx/coin-01.m4a', 'sfx/coin-01.mp3', 'sfx/coin-01.ogg']], ['coin-02', ['sfx/coin-02.m4a', 'sfx/coin-02.mp3', 'sfx/coin-02.ogg']], ['dollar', ['sfx/paper.m4a', 'sfx/paper.mp3', 'sfx/paper.ogg']]]
};
