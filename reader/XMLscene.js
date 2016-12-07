function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();
	this.animator = new Animator(this);
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.lightState =[];

    this.enableTextures(true);
	this.materialDefault = new CGFappearance(this);
	this.axis=new CGFaxis(this);

    //PICKING
    this.setPickEnabled(true);

	this.obj = new Sphere(this, 0.5, 3, 3);

	this.obj.position = {x:0 , y:0 , z:0};

	this.cylinder = new Cylinder(this, 1, 1, 1, 20, 20);
	this.board = new Board(this, this.cylinder, null, 20, null, 0, null, 0); 
	
	var animation = new Animation();

	this.animator.addAnimation(animation);
	//function Keyframe(time, object, attribute, value, lerpFunction) 
	animation.registerSequence("movimento", this.obj, "position");
	animation.addKeyframe("movimento", new Keyframe( 0 , {x:1, y:1, z:1}, transition_vector3));
	animation.addKeyframe("movimento", new Keyframe( 5 , {x:1, y:1, z:1}, transition_vector3));
	animation.addKeyframe("movimento", new Keyframe( 10.5 ,{x:2, y:2, z:5}, transition_vector3));
	animation.addKeyframe("movimento", new Keyframe( 20 ,{x:0, y:0, z:0}, transition_vector3));
	
	this.setUpdatePeriod(1);
};

XMLscene.prototype.setInterface = function (interface) {
	this.interface = interface;

};

XMLscene.prototype.initLights = function () {

	this.lights[0].setPosition(1, 2, 1, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].update();
    this.lights[0].enable();


};

XMLscene.prototype.update = function(currTime){

	this.graph.update(currTime/1000);
    if(this.sea != null)
        this.sea.update(currTime/1000);

	this.animator.update(currTime/1000);
}

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500,
    							vec3.fromValues(15, 15, 15),
    							vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {

	this.setAmbient(	this.graph.illumination.ambient.r,
						this.graph.illumination.ambient.g,
						this.graph.illumination.ambient.b,
						this.graph.illumination.ambient.a);

	this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
};

XMLscene.prototype.nextCamera = function(){
	this.camera = this.graph.getCamera();
	this.interface.setActiveCamera(this.camera);
}

// Handler called when the graph is finally loaded.
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function ()
{
	this.gl.clearColor(	this.graph.illumination.background.r,
						this.graph.illumination.background.g,
						this.graph.illumination.background.b,
						this.graph.illumination.background.a);


	this.setGlobalAmbientLight(	this.graph.illumination.ambient.r,
						this.graph.illumination.ambient.g,
						this.graph.illumination.ambient.b,
						this.graph.illumination.ambient.a);

	this.axis = new CGFaxis(this,this.graph.sceneInfo.axis_length,0.1);

	//console.log("Axis Length is : " + this.axis.length + "; " + this.axis.thickness);

	this.nextCamera();

	for(var i = 0 ; i < this.lights.length; i++){
		if(this.lights[i].visible)
			this.lightState.push(this.lights[i].enabled);

		console.log(this.lights[i].enabled);
	}
	this.interface.updateLights();
	this.root = this.graph.getRoot();

	//this.gl.glLightModeli(this.gl.GL_LIGHT_MODEL_LOCAL_VIEWER, this.graph.illumination.local);
	//this.gl.glLightModeli(this.gl.GL_LIGHT_MODEL_TWO_SIDED, this.graph.illumination.doubleSided);


};

XMLscene.prototype.updateLights = function(){

	for(var i = 0; i < this.lightState.length; i++){
		if(this.lightState[i])
			this.lights[i].enable();
		else
			this.lights[i].disable();
	}

}

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup

	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	this.updateLights();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();
	this.setDefaultAppearance();
	this.materialDefault.apply();
	// Draw axis

	this.pushMatrix();

	this.scale(this.obj.position.x,this.obj.position.y,this.obj.position.z);
	
	this.board.display();
	this.cylinder.display();
	this.popMatrix();
	
	this.axis.display();


    //PICKING
    //this.logPicking();
    //this.clearPickRegistration();
    //this.registerForPick(INTEGER ID,OBJECT)
	// ---- END Background, camera and axis setup
	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		for(var i = 0; i < this.lights.length; i++)
			this.lights[i].update();

		this.root.display();
	};
};


//Exemplo de logPicking
/*
LightingScene.prototype.logPicking = function ()
{
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj)
				{
					var customId = this.pickResults[i][1];
                    console.log(this.pickResults[i]);
                    console.log(obj);
					console.log("Picked object: " + obj + ", with pick id " + customId);
				}
			}
			this.pickResults.splice(0,this.pickResults.length);//Limpa o array
		}
	}
}
*/
