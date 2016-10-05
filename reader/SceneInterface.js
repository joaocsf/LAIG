/**
 * MyInterface
 * @constructor
 */
 
 
function SceneInterface() {
	//call CGFinterface constructor 
	CGFinterface.call(this);

};

SceneInterface.prototype = Object.create(CGFinterface.prototype);
SceneInterface.prototype.constructor = SceneInterface;

/**
 * init
 * @param {CGFapplication} application
 */

SceneInterface.prototype.updateLights = function(){
	for(var i = 0; i < this.scene.lightState.length ; i++){
		this.lightGroup.add(this.scene.lightState, i , this.scene.lightState[i]);
	} 
}

SceneInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	
	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui
	
	this.gui = new dat.GUI();

	this.lightGroup = this.gui.addFolder("Luzes");

	// add a button:
	// the first parameter is the object that is being controlled (in this case the scene)
	// the identifier 'doSomething' must be a function declared as part of that object (i.e. a member of the scene class)
	// e.g. LightingScene.prototype.doSomething = function () { console.log("Doing something..."); }; 

	// add a group of controls (and open/expand by defult)

	// add two check boxes to the group. The identifiers must be members variables of the scene initialized in scene.init as boolean
	// e.g. this.option1=true; this.option2=false;
	

	
	
	// add a slider
	// must be a numeric variable of the scene, initialized in scene.init e.g.
	// this.speed=3;
	// min and max values can be specified as parameters


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