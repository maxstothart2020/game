'use strict';

var COLLECTIBLES = [{ texture: '10-cent', value: 10 }, { texture: '20-cent', value: 20 }, { texture: '50-cent', value: 50 }, { texture: '1-dollar', value: 100 }, { texture: '2-dollar', value: 200 }, { texture: '5-dollar', value: 500 }];

var LEVELS = [100, 200, 300, 400, 500];
var GAME_TIME = 100;
var COIN_SPEED = 100;
var COIN_MIN_SPEED = 75;
var COIN_MAX_SPEED = 125;
var PLAYER_SPEED = 500;
var PLAYER_ANIMATION_SPEED = 4; // fps

var getRandomItem = Phaser.ArrayUtils.getRandomItem;
var ceil = Math.ceil;


EPT.Game = function (game) {};
EPT.Game.prototype = {
  init: function init() {
    var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

    this.level = level;
    this.numDrops = LEVELS[level - 1];
  },

  create: function create() {
    if (!EPT.Storage) {
      EPT.Storage = this.game.plugins.add(Phaser.Plugin.Storage);
      EPT.Storage.initUnset('EPT-highscore', 0);
    }
    this.inputStatus = { old: false, new: false };
    this.controlFrames = 0;
    this._score = 0;
    this._total = 0;
    this._time = GAME_TIME;
    this.gamePaused = false;
    this.runOnce = false;
    this.frameDrops = this.createFrameDrops();
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 0;
    // var fontGameplay = { font: "32px Arial", fill: "#000" };
    // var textGameplay = this.add.text(100, 75, 'Gameplay screen', fontGameplay);

    this.sky = this.make.sprite(0, 0, 'scenery', 'sky');
    this.sky.anchor.setTo(0.5, 0);

    this.mountain = this.make.sprite(0, 0, 'scenery', 'mountain');
    this.mountain.anchor.setTo(0.5);

    this.sign = this.make.sprite(0, 0, 'scenery', 'sign');
    this.sign.anchor.setTo(0.5, 0);

    this.grassBack = this.make.sprite(0, 0, 'scenery', 'grass-back');
    this.grassBack.anchor.setTo(0.5, 0);

    this.grassMid = this.make.sprite(0, 0, 'scenery', 'grass-mid');
    this.grassMid.anchor.setTo(0, 1);

    this.grassFront = this.make.sprite(0, 0, 'scenery', 'grass-front');
    this.grassFront.anchor.setTo(1);

    this.player = this.make.sprite(0, 0, 'player');

    this.setObjectLocations();

    this.currentFrame = 0;

    this.cursors = game.input.keyboard.createCursorKeys();

    this.currentTimer = game.time.create();
    this.currentTimer.loop(Phaser.Timer.SECOND, function () {
      this._time--;
      if (this._time) {
        this.timerText.setText(this._time);
      } else {
        this.timerText.setText(this._time);
        this.stateStatus = 'gameover';
      }
    }, this);
    this.currentTimer.start();

    this.initUI();
    this.stateStatus = 'playing';

    this.camera.resetFX();
    this.camera.flash(0x000000, 500, false);
  },
  setObjectLocations: function setObjectLocations() {
    var _world = this.world,
        width = _world.width,
        height = _world.height;


    this.sky.x = width * 0.5;
    this.sky.y = 0;

    this.mountain.x = width * 0.5;
    this.mountain.y = height * 0.49;

    this.grassBack.x = width * 0.5;
    this.grassBack.y = height * 0.5 + this.grassBack.height * 0.4;

    this.walkAnim = this.player.animations.add('walk');
    this.player.anchor.setTo(0.63, 0.5);
    this.game.physics.arcade.enable(this.player);

    this.player.x = width * 0.5;
    this.player.y = height * 0.69;
    this.player.body.setSize(this.player.width * 0.4, this.player.height * 0.15, this.player.width * 0.4, 0);
    this.player.body.collideWorldBounds = true;

    this.grassMid.x = 0;
    this.grassMid.y = height;

    this.grassFront.x = width;
    this.grassFront.y = height;

    this.sign.x = width * 0.8;
    this.sign.y = height * 0.51;

    this.add.existing(this.sky);
    this.add.existing(this.mountain);
    this.add.existing(this.sign);
    this.add.existing(this.grassBack);
    this.coins = this.game.add.group();
    this.add.existing(this.grassMid);
    this.add.existing(this.player);
    this.add.existing(this.grassFront);
    this.popups = this.game.add.group();
  },
  createFrameDrops: function createFrameDrops() {
    var droptween = this.add.tween({ drops: 0, choices: 0 }).to({ drops: this.numDrops, choices: 6 }, (GAME_TIME - 5) * 1000);
    var currentDrop = 0;
    var dropdata = droptween.generateData().reduce(function (arr, item, idx) {
      var drops = ~~item.drops;
      if (drops > currentDrop) {
        var diff = drops - currentDrop;
        arr.push({ frame: idx, drops: diff, choices: ceil(item.choices) - 1 });
        currentDrop += diff;
      }
      return arr;
    }, []);
    return dropdata;
  },
  initUI: function initUI() {
    var hud = this.game.add.group();
    var hudbg = this.add.image(688, 174, 'ui', 'hud-background');
    hudbg.anchor.setTo(0.5);

    var leveltxt = this.add.text(683, 72, 'Level ' + this.level, {
      font: '28px FrutigerBlack',
      fill: '#FFF',
      align: 'center'
    });
    leveltxt.anchor.setTo(0.5);

    var timerTitle = this.add.text(683, 120, 'Time Left', {
      font: '24px FrutigerBlack',
      fill: '#FD8724',
      align: 'center'
    });
    timerTitle.anchor.setTo(0.5);

    var sep1 = this.add.image(683, 142, 'ui', 'ui-separator');
    sep1.anchor.setTo(0.5);
    sep1.scale.setTo(0.5);

    this.timerText = this.add.text(683, 173, GAME_TIME, {
      font: '28px FrutigerBlack',
      fill: '#FFF',
      align: 'center'
    });
    this.timerText.anchor.setTo(0.5);

    var scoreTitle = this.add.text(683, 221, 'Score', {
      font: '24px FrutigerBlack',
      fill: '#FD8724',
      align: 'center'
    });
    scoreTitle.anchor.setTo(0.5);

    var sep2 = this.add.image(683, 242, 'ui', 'ui-separator');
    sep2.anchor.setTo(0.5);

    this.scoreText = this.add.text(683, 273, '$0.00', {
      font: '28px FrutigerBlack',
      fill: '#FFF',
      align: 'center'
    });
    this.scoreText.anchor.setTo(0.5);
    sep2.scale.setTo(0.5);

    hud.add(hudbg);
    hud.add(timerTitle);
    hud.add(sep1);
    hud.add(this.timerText);
    hud.add(scoreTitle);
    hud.add(sep2);
    hud.add(this.scoreText);

    this.hud = hud;

    var fontTitle = {
      font: '48px Arial',
      fill: '#000',
      stroke: '#FFF',
      strokeThickness: 10
    };
    this.buttonPause = this.add.button(20, 20, 'button-pause', this.managePause, this, 1, 0, 2);
    this.buttonPause.anchor.set(0, 0);

    this.buttonPause.y = -this.buttonPause.height - 20;
    this.add.tween(this.buttonPause).to({ y: 20 }, 1000, Phaser.Easing.Exponential.Out, true);

    this.screenPausedGroup = this.add.group();
    this.screenPausedBg = this.add.sprite(0, 0, 'overlay');
    this.screenPausedBg.alpha = 0.25;

    this.screenPausedText = this.add.text(this.world.width * 0.5, 268, 'PAUSED', { font: '64px FrutigerBlack', fill: '#C00712', align: 'center' });
    this.screenPausedText.anchor.set(0.5, 0);
    // this.buttonAudio = this.add.button(this.world.width-20, 20, 'button-audio', this.clickAudio, this, 1, 0, 2);
    // this.buttonAudio.anchor.set(1,0);
    this.screenPausedBack = this.add.button(175, 706, 'custom-buttons', this.stateBack, this, 'back-button-over', 'back-button', 'back-button-over', 'back-button');
    this.screenPausedBack.anchor.setTo(0.5);
    this.screenPausedContinue = this.add.button(409, 710, 'custom-buttons', this.managePause, this, 'start-button-over', 'start-button', 'start-button-over', 'start-button');
    this.screenPausedContinue.anchor.set(0.5);

    var pmathslogo = this.add.image(645, 707, 'ui', 'mathsweek-logo');
    pmathslogo.anchor.setTo(0.5);
    pmathslogo.scale.setTo(0.4);

    var puibar = this.add.image(this.world.width * 0.5, 710, 'ui', 'ui-bar');
    puibar.anchor.setTo(0.5);

    this.screenPausedGroup.add(this.screenPausedBg);
    this.screenPausedGroup.add(this.screenPausedText);
    this.screenPausedGroup.add(puibar);
    this.screenPausedGroup.add(this.screenPausedBack);
    this.screenPausedGroup.add(this.screenPausedContinue);
    this.screenPausedGroup.add(pmathslogo);
    this.screenPausedGroup.visible = false;

    //this.buttonAudio.setFrames(EPT._audioOffset+1, EPT._audioOffset+0, EPT._audioOffset+2);

    this.screenGameoverGroup = this.add.group();

    var logo = this.add.image(120, 120, 'ui', 'game-logo');
    logo.anchor.setTo(0.5);
    logo.scale.setTo(0.5);

    this.screenGameoverText = this.add.text(this.world.width * 0.5, 268, "TIME'S UP", { font: '64px FrutigerBlack', fill: '#C00712', align: 'center' });
    this.screenGameoverText.anchor.set(0.5, 1);

    this.screenGameoverScore = this.add.text(this.world.width * 0.5, 380, 'You collected $' + this._score * 0.01, { font: '54px FrutigerBlack', fill: '#C00712', align: 'center' });
    this.screenGameoverScore.anchor.setTo(0.5, 1);

    var uibar = this.add.image(this.world.width * 0.5, 710, 'ui', 'ui-bar');
    uibar.anchor.setTo(0.5);

    this.screenGameoverBack = this.add.button(175, 706, 'custom-buttons', this.stateBack, this, 'back-button-over', 'back-button', 'back-button-over', 'back-button');
    this.screenGameoverBack.anchor.setTo(0.5);

    this.screenGameoverRestart = this.add.button(409, 710, 'custom-buttons', this.stateRestart, this, 'start-button-over', 'start-button', 'start-button-over', 'start-button');
    this.screenGameoverRestart.anchor.setTo(0.5);

    var mathslogo = this.add.image(645, 707, 'ui', 'mathsweek-logo');
    mathslogo.anchor.setTo(0.5);
    mathslogo.scale.setTo(0.4);

    this.screenGameoverGroup.add(logo);
    this.screenGameoverGroup.add(this.screenGameoverText);
    this.screenGameoverGroup.add(this.screenGameoverScore);
    this.screenGameoverGroup.add(uibar);
    this.screenGameoverGroup.add(this.screenGameoverBack);
    this.screenGameoverGroup.add(this.screenGameoverRestart);
    this.screenGameoverGroup.add(mathslogo);

    this.screenGameoverGroup.visible = false;
  },
  update: function update() {
    switch (this.stateStatus) {
      case 'paused':
        {
          if (!this.runOnce) {
            this.statePaused();
            this.runOnce = true;
          }
          break;
        }
      case 'gameover':
        {
          if (!this.runOnce) {
            this.stateGameover();
            this.runOnce = true;
          }
          break;
        }
      case 'playing':
        {
          this.statePlaying();
        }
      default:
        {}
    }
  },
  checkFrameData: function checkFrameData() {
    if (this.frameDrops.length) {
      var df = this.frameDrops[0];
      if (df.frame <= this.currentFrame) {
        for (var i = 0; i < df.drops; i++) {
          this.dropCoin(df.choices);
        }
        this.frameDrops.shift();
      }
    }
  },
  checkInput: function checkInput() {
    var hasInput = false;
    if (this.game.input.activePointer.isDown) {
      hasInput = true;
      if (this.input.activePointer.x < this.player.x) {
        this.player.body.velocity.x = -PLAYER_SPEED;
        this.player.scale.x = -1;
      } else if (this.input.activePointer.x > this.player.x) {
        this.player.body.velocity.x = PLAYER_SPEED;
        this.player.scale.x = 1;
      }
    } else if (this.cursors.right.isDown) {
      hasInput = true;
      this.player.body.velocity.x = PLAYER_SPEED;
      this.player.scale.x = 1;
    } else if (this.cursors.left.isDown) {
      hasInput = true;
      this.player.body.velocity.x = -PLAYER_SPEED;
      this.player.scale.x = -1;
    } else {
      this.player.body.velocity.x = 0;
    }
    var tmp = this.inputStatus.new;
    this.inputStatus.new = hasInput;
    this.inputStatus.old = tmp;
  },
  checkAnimations: function checkAnimations() {
    var _inputStatus = this.inputStatus,
        old = _inputStatus.old,
        nu = _inputStatus.new;

    if (!old && !!nu) {
      this.walkAnim.play(15, true);
    } else if (!!old && !nu) {
      this.walkAnim.stop();
    }
    this.game.debug.spr;
  },

  checkCollisions: function checkCollisions() {
    this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);
  },
  collectCoin: function collectCoin(player, coin) {
    coin.kill();
    if (coin.collectibleValue === 500) {
      EPT._playAudio('dollar');
    } else {
      EPT._playAudio(getRandomItem(['coin-01', 'coin-02']));
    }
    this.addPoints(coin.collectibleValue);
  },
  dropCoin: function dropCoin(choices) {
    var temp = COLLECTIBLES.slice(0, choices + 1);
    var props = getRandomItem(temp);
    var coin = this.coins.getFirstExists(false);
    if (!coin) {
      coin = this.coins.create(0, 0, 'collectibles', props.texture);
      coin.anchor.setTo(0.5);
      coin.scale.setTo(0.25);
    } else {
      coin.frameName = props.texture;
    }

    coin.collectibleValue = props.value;
    var x = this.rnd.integerInRange(coin.width, this.world.width - coin.width);
    var y = -coin.height * 0.5;
    coin.reset(x, y);
    coin.touched = false;
    this.game.physics.arcade.enable(coin);
    coin.body.height = 5;
    coin.body.offset = new Phaser.Point(0, coin.height * 4 - 5);
    coin.body.velocity.set(0, this.rnd.integerInRange(COIN_MIN_SPEED, COIN_MAX_SPEED));
    coin.checkWorldBounds = true;
    coin.outOfBoundsKill = true;
    coin.events.onKilled.add(function () {
      if (coin.body) {
        coin.body.destroy();
      }
    });
    this._total += props.value;
  },
  managePause: function managePause() {
    this.gamePaused = !this.gamePaused;
    EPT._playAudio('click');
    if (this.gamePaused) {
      this.stateStatus = 'paused';
      this.game.physics.arcade.isPaused = true;
      this.walkAnim.stop();
    } else {
      this.stateStatus = 'playing';
      this.game.physics.arcade.isPaused = false;
      this.runOnce = false;
    }
  },
  statePlaying: function statePlaying() {
    this.screenPausedGroup.visible = false;
    this.currentTimer.resume();
    this.currentFrame++;
    this.checkFrameData();
    this.checkInput();
    this.checkAnimations();
    this.checkCollisions();
  },

  statePaused: function statePaused() {
    this.screenPausedGroup.visible = true;
    this.currentTimer.pause();
  },
  stateGameover: function stateGameover() {
    this.player.visible = false;
    this.coins.visible = false;
    this.buttonPause.visible = false;
    this.screenGameoverGroup.visible = true;
    this.currentTimer.stop();
    EPT._playAudio('gameover');
    // this.screenGameoverScore.setText('Score: '+this._score);
    this.gameoverScoreTween();
    EPT.Storage.setHighscore('EPT-highscore', this._score);
  },
  addPoints: function addPoints(points) {
    this._score += points;
    this.scoreText.setText('$' + (this._score * 0.01).toFixed(2));
    var randX = this.rnd.integerInRange(200, this.world.width - 200);
    var randY = this.rnd.integerInRange(200, this.world.height - 200);
    var cdisplay = points < 100 ? '+c' + points : '+' + points * 0.01 + '$';
    var popup = this.popups.getFirstExists(false);
    if (!popup) {
      popup = this.add.text(0, 0, cdisplay, {
        font: '48px Arial',
        fill: '#000',
        stroke: '#FFF',
        strokeThickness: 10
      });
      popup.anchor.set(0.5, 0.5);
      this.popups.add(popup);
    }
    popup.text = cdisplay;
    popup.reset();
    popup.x = randX;
    popup.y = randY;
    popup.alpha = 1;
    var popupTween = this.add.tween(popup).to({ alpha: 0, y: randY - 50 }, 1000, Phaser.Easing.Linear.None, true);
    popupTween.onComplete.add(function () {
      popup.kill();
    });
  },
  gameoverScoreTween: function gameoverScoreTween() {
    this.screenGameoverScore.setText('You collected $0');
    if (this._score) {
      var money = this._score * 0.01;
      this.tweenedPoints = 0;
      var pointsTween = this.add.tween(this);
      pointsTween.to({ tweenedPoints: money }, 1000, Phaser.Easing.Linear.None, true, 500);
      pointsTween.onUpdateCallback(function () {
        this.screenGameoverScore.setText('You collected $' + this.tweenedPoints.toFixed(2));
      }, this);
      pointsTween.onComplete.addOnce(function () {
        this.screenGameoverScore.setText('You collected $' + money.toFixed(2));
      }, this);
      pointsTween.start();
    }
  },
  clickAudio: function clickAudio() {
    EPT._playAudio('click');
    EPT._manageAudio('switch', this);
  },
  stateRestart: function stateRestart() {
    EPT._playAudio('click');
    this.screenGameoverGroup.visible = false;
    this.gamePaused = false;
    this.runOnce = false;
    this.currentTimer.start();
    this.stateStatus = 'playing';
    this.state.restart(true, false, this.level);
  },
  stateBack: function stateBack() {
    EPT._playAudio('click');
    this.screenGameoverGroup.visible = false;
    this.gamePaused = false;
    this.runOnce = false;
    this.currentTimer.start();
    this.stateStatus = 'playing';
    // this.state.restart(true);
    this.state.start('Story');
  }
};
