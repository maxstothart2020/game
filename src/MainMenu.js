'use strict';

EPT.MainMenu = function (game) {};
EPT.MainMenu.prototype = {
	init: function init(firstrun) {
		this.firstrun = firstrun;
	},
	create: function create() {
		var _this = this;

		// this.add.sprite(0, 0, 'background');
		var _world = this.world,
		    width = _world.width,
		    height = _world.height;
		// initialize storage

		EPT.Storage = this.game.plugins.add(Phaser.Plugin.Storage);
		EPT.Storage.initUnset('EPT-highscore', 0);
		var highscore = EPT.Storage.get('EPT-highscore') || 0;

		// create menu spri
		this.logo = this.make.sprite(0, 0, 'ui', 'game-logo');
		this.logo.anchor.setTo(0.5);

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

		this.mathsLogo = this.make.sprite(0, 0, 'ui', 'mathsweek-logo');
		this.mathsLogo.anchor.setTo(1);

		this.startbtn = this.make.button(0, 0, 'button-start', this.clickStart, this, 1, 0, 2);
		this.startbtn.anchor.setTo(0.5);

		this.setStartingLocations();
		if (this.firstrun) {
			var intro = this.introAnimation();
			intro.then(function () {
				_this.setObjectLocations();
			});
		} else {
			this.setObjectLocations();
		}
		EPT._manageAudio('init', this);
	},

	setStartingLocations: function setStartingLocations() {
		var _world2 = this.world,
		    width = _world2.width,
		    height = _world2.height;

		this.sky.x = width * 0.5;
		this.sky.y = height;

		this.mountain.x = width * 0.5;
		this.mountain.y = -this.mountain.height;

		this.grassBack.x = width * 0.5;
		this.grassBack.y = height;

		this.grassMid.x = -this.grassMid.width;
		this.grassMid.y = height;

		this.grassFront.y = height;
		this.grassFront.x = width + this.grassFront.width;

		this.sign.x = width * 0.8;
		this.sign.y = height + this.sign.height;

		this.logo.x = width * 0.15;
		this.logo.y = height * 0.15;
		this.logo.scale.setTo(0);

		this.mathsLogo.x = width * 0.98;
		this.mathsLogo.y = height * 0.98;
		this.mathsLogo.scale.setTo(0.5);
		this.mathsLogo.alpha = 0;

		this.startbtn.x = -width * 0.5;
		this.startbtn.y = height * 0.9;
		this.startbtn.scale.setTo(0.5);
		this.startbtn.visible = false;

		this.add.existing(this.sky);
		this.add.existing(this.logo);
		this.add.existing(this.mountain);
		this.add.existing(this.sign);
		this.add.existing(this.grassBack);
		this.add.existing(this.grassMid);
		this.add.existing(this.grassFront);
		this.add.existing(this.mathsLogo);
		this.add.existing(this.startbtn);
	},
	introAnimation: function introAnimation() {
		var sky = this.sky,
		    logo = this.logo,
		    mountain = this.mountain,
		    sign = this.sign,
		    grassBack = this.grassBack,
		    grassMid = this.grassMid,
		    grassFront = this.grassFront,
		    mathsLogo = this.mathsLogo,
		    startbtn = this.startbtn;
		var _world3 = this.world,
		    width = _world3.width,
		    height = _world3.height;


		var timeline = anime.timeline();
		timeline.add({
			targets: sky,
			y: 0,
			easing: 'easeOutExpo',
			duration: 500
		}).add({
			targets: mountain,
			y: height * 0.49,
			easing: 'easeOutElastic',
			duration: 500,
			offset: 1000
		}).add({
			targets: grassBack,
			y: height * 0.5 + this.grassBack.height * 0.4,
			easing: 'easeOutBack',
			offset: 500,
			duration: 500
		}).add({
			targets: grassMid,
			x: 0,
			easing: 'easeOutExpo',
			offset: 250,
			duration: 500
		}).add({
			targets: grassFront,
			x: width,
			easing: 'easeOutExpo',
			duration: 250,
			offset: 250
		}).add({
			targets: sign,
			y: height * 0.51,
			duration: 500,
			easing: 'easeOutCirc',
			offset: 1000
		}).add({
			targets: logo.scale,
			x: 0.5,
			y: 0.5,
			duration: 500,
			offset: 1500,
			easing: 'easeOutElastic'
		}).add({
			targets: mathsLogo,
			alpha: 0.75,
			duration: 500
		});
		return Promise.all(timeline.children.map(function (a) {
			return a.finished;
		}));
	},
	setObjectLocations: function setObjectLocations() {
		var _world4 = this.world,
		    width = _world4.width,
		    height = _world4.height;

		this.sky.y = 0;

		this.mountain.y = height * 0.49;

		this.grassBack.y = height * 0.5 + this.grassBack.height * 0.4;

		this.grassMid.x = 0;

		this.grassFront.x = width;

		this.sign.y = height * 0.51;

		this.logo.scale.setTo(0.5);

		this.mathsLogo.alpha = 0.75;

		this.startbtn.x = width * 0.5;
		this.startbtn.y = height * 0.9;
		this.startbtn.visible = true;
	},
	clickAudio: function clickAudio() {
		EPT._playAudio('click');
		EPT._manageAudio('switch', this);
	},
	clickStart: function clickStart() {
		EPT._playAudio('click');
		this.camera.fade(0x000000, 200, false);
		this.camera.onFadeComplete.add(function () {
			this.game.state.start('Story');
		}, this);
	}

};
