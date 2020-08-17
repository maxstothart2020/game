'use strict';

// (function(){
var game = new Phaser.Game(800, 800, Phaser.AUTO);
var states = {
	'Boot': EPT.Boot,
	'Preloader': EPT.Preloader,
	'MainMenu': EPT.MainMenu,
	'Achievements': EPT.Achievements,
	'Story': EPT.Story,
	'Game': EPT.Game
};
for (var state in states) {
	game.state.add(state, states[state]);
}game.state.start('Boot');
// })();
