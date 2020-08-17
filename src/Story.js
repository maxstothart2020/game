'use strict';

var INSTRUCTIONS = 'Welcome!\nIn this game, money rains from\nthe sky!\n\nTry catching it.\n\nUse the left and right arrow keys\nor use tap the screen to move Tahi\nand collect money in the bucket.\n\nYou have 100 seconds to collect as\nmuch money as you can.\n';

EPT.Story = function (game) {};
EPT.Story.prototype = {
	create: function create() {
		var _this = this;

		var _world = this.world,
		    width = _world.width,
		    height = _world.height;
		// initialize storage

		EPT.Storage = this.game.plugins.add(Phaser.Plugin.Storage);
		EPT.Storage.initUnset('EPT-highscore', 0);
		var highscore = EPT.Storage.get('EPT-highscore') || 0;

		// create menu spri
		var bg1 = this.add.image(0, 0, 'ui', 'layer-1-instructions');

		var bg2 = this.add.image(28, height - 28, 'ui', 'layer-1-instructions');
		var layer2bg = this.add.image(158, 42, 'ui', 'layer-2-instructions');
		bg2.scale.setTo(0.93, -0.93);
		bg2.x = 28;

		this.add.image(375, 64, 'ui', 'vertical-separator');
		this.add.image(40, 302, 'ui', 'layer-4-instructions');
		this.add.image(40, 302, 'ui', 'layer-3-instructions');

		this.add.image(537, 391, 'ui', 'ui-separator');
		this.add.image(537, 465, 'ui', 'horizontal-separator');
		this.add.image(537, 523, 'ui', 'horizontal-separator');
		this.add.image(537, 581, 'ui', 'horizontal-separator');
		this.add.image(537, 639, 'ui', 'horizontal-separator');

		var logo = this.add.image(181, 158, 'ui', 'game-logo');
		logo.anchor.setTo(0.5);
		logo.scale.setTo(0.65);

		var sponsor = this.add.image(570, 153, 'sponsor-logo');
		sponsor.anchor.setTo(0.5, 0);
		sponsor.scale.setTo(0.7);

		var maths = this.add.image(636, 693, 'ui', 'mathsweek-logo');
		maths.anchor.setTo(0.5);
		maths.scale.setTo(0.5);

		var attrib = this.add.text(573, 114, 'This game is proudly\nsponsored by:', { font: "26px FrutigerBlack", fill: "#fff", align: 'center' });
		attrib.anchor.setTo(0.5);
		var instructions = this.add.text(60, 312, INSTRUCTIONS, { font: "26px FrutigerRoman", fill: "#fff" });

		var choose = this.add.text(642, 358, 'Choose a\nLevel:', { font: "28px FrutigerBlack", fill: "#FD8724", align: 'center' });
		choose.anchor.setTo(0.5);

		var level1 = this.add.text(639, 434, 'Level 1', { font: "28px FrutigerBlack", fill: "#FFF", align: 'center' });
		level1.anchor.setTo(0.5);
		level1.inputEnabled = true;

		var level2 = this.add.text(639, 496, 'Level 2', { font: "28px FrutigerBlack", fill: "#FFF", align: 'center' });
		level2.anchor.setTo(0.5);
		level2.inputEnabled = true;

		var level3 = this.add.text(639, 558, 'Level 3', { font: "28px FrutigerBlack", fill: "#FFF", align: 'center' });
		level3.anchor.setTo(0.5);
		level3.inputEnabled = true;
		var level4 = this.add.text(639, 620, 'Level 4', { font: "28px FrutigerBlack", fill: "#FFF", align: 'center' });
		level4.anchor.setTo(0.5);
		level4.inputEnabled = true;

		level1.events.onInputOver.add(this.highlightText, this);
		level1.events.onInputDown.add(this.highlightText, this);
		level1.events.onInputOut.add(this.downlightText, this);
		level1.events.onInputUp.add(function () {
			EPT._playAudio('click');
			_this.state.start('Game', true, false, 1);
		});

		level2.events.onInputOver.add(this.highlightText, this);
		level2.events.onInputDown.add(this.highlightText, this);
		level2.events.onInputOut.add(this.downlightText, this);
		level2.events.onInputUp.add(function () {
			EPT._playAudio('click');
			_this.state.start('Game', true, false, 2);
		});

		level3.events.onInputOver.add(this.highlightText, this);
		level3.events.onInputDown.add(this.highlightText, this);
		level3.events.onInputOut.add(this.downlightText, this);
		level3.events.onInputUp.add(function () {
			EPT._playAudio('click');
			_this.state.start('Game', true, false, 3);
		});

		level4.events.onInputOver.add(this.highlightText, this);
		level4.events.onInputDown.add(this.highlightText, this);
		level4.events.onInputOut.add(this.downlightText, this);
		level4.events.onInputUp.add(function () {
			EPT._playAudio('click');
			_this.state.start('Game', true, false, 4);
		});

		this.camera.flash(0x000000, 500, false);
	},
	clickContinue: function clickContinue() {
		EPT._playAudio('click');
		this.camera.fade(0x000000, 200, false);
		this.camera.onFadeComplete.add(function () {
			this.game.state.start('Game');
		}, this);
	},
	highlightText: function highlightText(text) {
		text.fill = "#FD8724";
		EPT._playAudio('highlight');
	},
	downlightText: function downlightText(text) {
		text.fill = "#FFF";
	}
};
