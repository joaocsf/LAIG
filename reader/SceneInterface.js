/**
 * MyInterface
 * @constructor
 */


function SceneInterface() {
	//call CGFinterface constructor
	CGFinterface.call(this);
	this.items = [];
};

SceneInterface.prototype = Object.create(CGFinterface.prototype);
SceneInterface.prototype.constructor = SceneInterface;

/**
 * init
 * @param {CGFapplication} application
 */

SceneInterface.prototype.updateLights = function(){
	console.log(this.scene.graph.lightsName);
	var length = this.scene.graph.lightsName.length;


	for(var i = 0; i < this.scene.lights.length ; i++){
	  var item = this.items[i];
		if(i < length){
			item.name(this.scene.graph.lightsName[i]);
		}else{
				item.name("Disabled");
		}
	}
}

SceneInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);

	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui
	this.lightGroup = null;
	this.gui = new dat.GUI();
	this.lightGroup = this.gui.addFolder("Luzes");

	this.scene.animator.animationTime=0.0001;

	//
	for(var i = 0; i < this.scene.lights.length ; i++){
		var item = this.lightGroup.add(this.scene.lightState, i , this.scene.lightState[i]).name("Disabled").listen();
		this.items.push(item);
	}

	var animationGroup = this.gui.addFolder("Animation");
	var timelineSlider = animationGroup.add(this.scene.animator, 'animationTime', 0, this.scene.animator.animationMaxTime).step(0.1).listen();
	var timeline = animationGroup.add(this.scene.animator, 'animationTime').max(0, this.scene.animator.animationMaxTime).step(0.1).listen();
	var updater1 = function(){
		scene.animator.changingAnimationTime()
	}
	var updater2 = function(){
		scene.animator.changedAnimationTime()
	}
	timeline.onChange(updater1);
	timeline.onFinishChange(updater2);

	timelineSlider.onChange(updater1);
	timelineSlider.onFinishChange(updater2);

	this.scene.animator.playUI.push(timeline,timelineSlider);

	var scene = this.scene;

	this.scene.animator.animationTime = 0;

	var playButton = animationGroup.add(this.scene.animator, 'togglePlay').name("Play");
	scene.animator.playBtn = playButton;

	animationGroup.add(this.scene.animator, 'resume');
	animationGroup.add(this.scene.animator, 'undo');

	var gameGroup = this.gui.addFolder("Game");
	this.scene.graphSelector = gameGroup.add(this.scene, 'graphName', this.scene.graphsNames).onFinishChange( function(){
		scene.updateGraph();
	}).listen();

	gameGroup.add(this.scene.board, 'resetGame').name("Reset Game");

	var debugGroup = this.gui.addFolder("Debug");
	debugGroup.add(this.scene.board, 'debugCells');
	debugGroup.add(this.scene.board, 'debugBodys');
	debugGroup.add(this.scene.board, 'debugMembers');

	var optionsGroup = this.gui.addFolder("Options");
	optionsGroup.add(this.scene.board,'mode', {'H vs H' : 'hh', 'H vs C' : 'hc', 'C vs H' : 'ch', 'C vs C' : 'cc'}).name("Mode");
	var difficultyGroup = optionsGroup.addFolder("Difficulty");
	difficultyGroup.add(this.scene.board.dificuldade,1,{'Defensivo' : 'notOp', 'Ofensivo' : 'op'}).name("Bot 1");
	difficultyGroup.add(this.scene.board.dificuldade,0,{'Defensivo' : 'notOp', 'Ofensivo' : 'op'}).name("Bot 2");
	// Modes -> H vs C | H vs H | C vs C | C vs H
	// Difficulties -> Defensivo(notOp) | Ofensivo(op);

	return true;
};

/**
 * processKeyboard
 * @param event {Event}
 */
SceneInterface.prototype.processKeyboard = function(event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyboard.call(this,event);

	// Check key codes e.g. here: http://www.asciitable.com/
	// or use String.fromCharCode(event.keyCode) to compare chars

	// for better cross-browser support, you may also check suggestions on using event.which in http://www.w3schools.com/jsref/event_key_keycode.asp
	/*
	switch (event.keydown)
	{
		case (65):	// only works for capital 'A', as it is
			this.scene.drone.rotate(1);
			break;
	};
	*/

};

SceneInterface.prototype.processKeyDown = function(event){
	CGFinterface.prototype.processKeyDown.call(this,event);
		switch (event.keyCode)
	{
		case (77): // Key M
			this.scene.graph.changeMaterials();
			break;
		case (86): // Key V
			this.scene.nextCamera();
			break;

	};
};

SceneInterface.prototype.processKeyUp = function(event){
	CGFinterface.prototype.processKeyUp.call(this,event);
		switch (event.keyCode)
	{
		case (65):	// only works for capital 'A', as it is
			break;
	};
};
