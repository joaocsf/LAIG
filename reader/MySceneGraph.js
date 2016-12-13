function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	this.illumination = { 	ambient : {r: 0.1, g: 0.1, b: 0.1, a: 1} ,
							background : {r: 0, g: 0, b: 0, a: 1},
							local : 0,
							doubleSided : 0};
	this.views = { default : "" , childs : [], defaultID : 0};

	this.sceneInfo = { root : "", axis_length : 0.0};
	this.lightsName = [];
	this.lights = {};
	this.lightIndex = 0;
	this.textures = {};
	this.materials = {};
	this.transformations = {};
	this.primitives = {};
	this.components = {};
	this.animations = {};

	//Dic to store all game related components
	this.gameComponents = {};

	this.cameraIndex = 0;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;

	// File reading
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	console.log("Opening Scene:" + filename);
	this.reader.open('scenes/'+filename, this);
}

MySceneGraph.prototype.getRoot = function(){
	return this.components[this.sceneInfo.root];
}

MySceneGraph.prototype.checkError=function(error){
	if (error != null) {
		this.onXMLError(error);
		return 1;
	}
}

/*
 * Callback to be executed on any read error
 */
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);
	this.loadedOk=false;
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function()
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;

	// Here should go the calls for different functions to parse the various blocks
	if(this.checkError(this.parseScene(rootElement)))
		return;
	if(this.checkError(this.parseViews(rootElement)))
		return;
	if(this.checkError(this.parseIllumination(rootElement)))
		return;
	if(this.checkError(this.parseLights(rootElement)))
		return;
	if(this.checkError(this.parseTextures(rootElement)))
		return;
	if(this.checkError(this.parseMaterials(rootElement)))
		return;
	if(this.checkError(this.parseTransformations(rootElement)))
		return;
	if(this.checkError(this.parseAnimations(rootElement)))
		return;
	if(this.checkError(this.parsePrimitives(rootElement)))
		return;
	if(this.checkError(this.parseComponents(rootElement)))
		return;
	if(this.checkError(this.parseGameComponents(rootElement)))
		return;

	this.startAssociation();

	this.loadedOk=true;

	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();

};

MySceneGraph.prototype.changeMaterials=function() {
	for(var key in this.components){
		var component = this.components[key];
		component.changeMaterial();
	}
}

MySceneGraph.prototype.update=function(currTime) {
	for(var key in this.components){
		var component = this.components[key];
		component.update(currTime);
	}
}


//Function that Returns a CGFCamera() using the defaultCameraID
MySceneGraph.prototype.getCamera = function(){
	var view = this.views.childs[this.views.defaultID];

	if(this.views.defaultID < this.views.childs.length - 1 )
		this.views.defaultID ++;
	else
		this.views.defaultID = 0;

	return new CGFcamera(view.angle, view.near, view.far, vec3.fromValues(view.from.x, view.from.y, view.from.z), vec3.fromValues(view.to.x, view.to.y, view.to.z));

}

//--------------------------
//--------INITIALIZE--------
//--------------------------
MySceneGraph.prototype.associateIDs = function(component){

	for(var i = 0; i < component.componentsID.length; i++){
		var key = component.componentsID[i];
		if(this.components[key] == null)
			console.error("Component with id : " + key + " does not exist!");

		console.log("--with component ID: " + key);
		component.components.push(this.components[key]);
	}

	for(var i = 0; i < component.primitivesID.length; i++){
		var key = component.primitivesID[i];

		if(this.primitives[key] == null)
			console.error("Primitive with id : " + key + " does not exist!");

		console.log("--with primitive ID: " + key);
		component.primitives.push(this.primitives[key]);
	}
}
MySceneGraph.prototype.startAssociation = function(element){

	if(this.components[this.sceneInfo.root] == null)
		console.error("Graph must have a root element please specify one in your dsx file");

	if(this.components[this.sceneInfo.root].material === null)
		console.error("Root element (" + this.sceneInfo.root + ") must have a valid material");

	for(var key in this.components){
		var component = this.components[key];
		component.id = key;
		console.log("Associating component ID: " + key);
		this.associateIDs(component);
	}
}
//***************************
//*********INITIALIZE********
//***************************
//--------------------------
//-----------HELPERS--------
//--------------------------

//[RGBA]
//Function that get RGBA values from an Element
MySceneGraph.prototype.getRGBAFromElement = function(element){

	var color = {
		r : 0,
		g : 0,
		b : 0,
		a : 1
	}
	if(element == null)
		return color;

	color.r = this.reader.getFloat(element, "r");
	if(color.r < 0.0 || color.r > 1.0){
		console.warn("Value from " + element.parentNode.nodeName + " -> " + element.parentNode.id +  " -> " + element.nodeName + " -> " + " r is out of bounds [0.0 .... 1.0]");
	}
	color.g = this.reader.getFloat(element, "g");
	if(color.g < 0.0 || color.g > 1.0){
		console.warn("Value from " + element.parentNode.nodeName + " -> " + element.parentNode.id +  " -> " + element.nodeName + " -> " + " g is out of bounds [0.0 .... 1.0]");
	}
	color.b = this.reader.getFloat(element, "b");
	if(color.b < 0.0 || color.b > 1.0){
		console.warn("Value from " + element.parentNode.nodeName + " -> " + element.parentNode.id +  " -> " + element.nodeName + " -> " + " b is out of bounds [0.0 .... 1.0]");
	}
	color.a = this.reader.getFloat(element, "a");
	if(color.a < 0.0 || color.a > 1.0){
		console.warn("Value from " + element.parentNode.nodeName + " -> " + element.parentNode.id +  " -> " + element.nodeName + " -> " + " a is out of bounds [0.0 .... 1.0]");
	}

	return color;
}

//Function that computes the transformation matrix of a given transformation list
MySceneGraph.prototype.ComputeTransformation = function(element){

	var childs = element.children;

    var trans = [	1.0, 0.0, 0.0, 0.0,
                    0.0, 1.0, 0.0, 0.0,
                    0.0, 0.0, 1.0, 0.0,
                    0.0, 0.0, 0.0, 1.0];

	for(i = 0; i < childs.length ; i++){
		var child = childs[i];
		switch(child.tagName){
			case 'translate':
				var translation = this.getVector3FromElement(child);
				console.log("Read translation : " + this.printVector3(translation));
				mat4.translate(trans,trans,[translation.x,translation.y,translation.z]);
				break;
			case 'rotate' :
				var rotate_axis = this.reader.getString(child,'axis');
				var rotate_angle = this.reader.getFloat(child,'angle') * Math.PI/180;
				console.log("Read rotatation with axis : " + rotate_axis + " angle : " + rotate_angle);
				switch(rotate_axis){
					case "x":
						mat4.rotate(trans,trans,rotate_angle,[1,0,0]);
						break;
					case "y":
						mat4.rotate(trans,trans,rotate_angle,[0,1,0]);
						break;
					case "z":
						mat4.rotate(trans,trans,rotate_angle,[0,0,1]);
						break;
				}
				break;
			case 'scale' :
			 	var scaling = this.getVector3FromElement(child);
			 	console.log("Read scaling : " + this.printVector3(scaling));
			 	mat4.scale(trans,trans,[scaling.x,scaling.y,scaling.z]);
				break;
		}
	}

	return trans;
}
//Function that Returns a string with the values of a RGBA structure
MySceneGraph.prototype.printRGBA = function(element){

	return ("(R: " + element.r + " , G: " + element.g + " , B: " + element.b + " , A: " + element.a + " )" );
}

//[/RGBA]

//[VECTOR3]
//Function that get a vector3 from an Element
MySceneGraph.prototype.getVector3FromElement = function (element){

	var point = {
		x : 0,
		y : 0,
		z : 0
	};

	if(element == null)
		return point;
	point.x = this.reader.getFloat(element, "x");
	point.y = this.reader.getFloat(element, "y");
	point.z = this.reader.getFloat(element, "z");
	return point;
}

//Function that get a vector3 from an Element
MySceneGraph.prototype.getVector3FromElement2 = function (element,stringx,stringy,stringz){

	var point = {
		x : 0,
		y : 0,
		z : 0
	};

	if(element == null)
		return point;
	point.x = this.reader.getFloat(element, stringx);
	point.y = this.reader.getFloat(element, stringy);
	point.z = this.reader.getFloat(element, stringz);
	return point;
}

//Function that Returns a string with the values of a vector3
MySceneGraph.prototype.printVector3 = function (vector){

	var res = "(X: " + vector.x + " , Y: " + vector.y  + " Z: " + vector.z + " )";
	return res;

}
//[/VECTOR3]

//[VECTOR4]
//Function that get a vector4 from an Element
MySceneGraph.prototype.getVector4FromElement = function (element){

	var point = {
		x : 0,
		y : 0,
		z : 0,
		w : 1.0
	};

	if(element == null)
		return point;

	point.x = this.reader.getFloat(element, "x");
	point.y = this.reader.getFloat(element, "y");
	point.z = this.reader.getFloat(element, "z");
	point.w = this.reader.getFloat(element, "w");
	if(point.w < 0.0 || point.w > 1.0){
		console.warn("Value from " + element.parentNode.nodeName + " -> " + element.parentNode.id +  " -> " + element.nodeName + " -> " + " w is out of bounds [0.0 .... 1.0]");
	}

	return point;
}

//Function that Returns a string with the values of a vector4
MySceneGraph.prototype.printVector4 = function (vector){

	var res = "(X: " + vector.x + " , Y: " + vector.y  + " Z: " + vector.z + " W: " + vector.w + " )";
	return res;

}
//[/VECTOR4]

//***************************
//************HELPERS********
//***************************
//---------------------------
//-----------<SCENE>---------
//---------------------------
/* Function to parse the element: Scene
Parses the following attributes:
	root : ss - name of rootElement
	axis_length : ff - length of the scenes axis
*/
MySceneGraph.prototype.parseScene = function(rootElement){

	var elems = rootElement.getElementsByTagName('scene');

	if(elems == null || elems.length != 1){
		return "scene element is MISSING or more than one element";
	}

	if(elems[0] != rootElement.children[0]){
		console.warn("Expected 'scene' (first element) but got : " + rootElement.children[0].nodeName);
	}

	var scene = elems[0];
	this.sceneInfo.root = this.reader.getString(scene,'root');
	this.sceneInfo.axis_length = this.reader.getFloat(scene,'axis_length');
	console.log("Root Name is : " + this.sceneInfo.root + " Axis length is: " + this.sceneInfo.axis_length);
}

//***************************
//************</SCENE>*******
//***************************
//---------------------------
//-----------<VIEWS>---------
//---------------------------

/*Function to parse the element: Prespective
Parses the following attributes:
	near : ff
	far : ff
	angle : ff
	from : vector3
	to : vector3
*/
 MySceneGraph.prototype.parsePerspective = function(element){

	if(element == null)
		return;

	for(var i = 0; i < this.views.childs.length; i++)
		if(this.views.childs[i].id === element.id){
			console.error("Duplicate id found : " + element.id);
		}

	var from = element.getElementsByTagName("from")[0];
	var to = element.getElementsByTagName("to")[0];

	var view = {
		id : element.id,
		near : this.reader.getFloat(element, "near") || 0.0,
		far : this.reader.getFloat(element, "far") || 0.0,
		angle : this.reader.getFloat(element, "angle") || 0.0,
		from : this.getVector3FromElement(from),
		to :  this.getVector3FromElement(to)
	};

	view.angle *= Math.PI/180;
	console.log("View Added: near: " + view.near + " id : " + view.id +  " far: " + view.far + " angle: " + view.angle + " from: " + this.printVector3(view.from) + " to: " + this.printVector3(view.to) );
	console.log(" ------------CAMERA " + element.id + " TMP " + this.views.default);
	if(element.id === this.views.default)
		this.views.defaultID = this.views.childs.length;
	this.views.childs.push(view);

}
/* Function to parse the element: Views
Parses the following attributes:
	default : ss - defaultCameraID
And the following elements:
	prespective :
*/
MySceneGraph.prototype.parseViews = function(rootElement){

	var elems = rootElement.getElementsByTagName('views');

	if(elems == null || elems.length != 1){
		return "views element is MISSING or more than one element";
	}

	if(elems[0] != rootElement.children[1]){
		console.warn("Expected 'views' (second element) but got : " + rootElement.children[1].nodeName);
	}

	var views = elems[0];
	this.views.default = this.reader.getString(views,'default');

	console.log("Default View is: " + this.views.default);

	var nNodes = views.children.length;

	for(var i = 0; i < nNodes; i++){
		var child = views.children[i];
		switch(child.tagName){
			case "perspective":
				this.parsePerspective(child);
				break;
		}
	}
}
//**************************
//***********</VIEWS>*******
//**************************


//---------------------------
//-------<illumination>------
//---------------------------


/* Function to parse the element: illumination
Parses the following elements:
	ambient : rgb
	background : rgb
*/
MySceneGraph.prototype.parseIllumination = function(rootElement){

	var elems = rootElement.getElementsByTagName('illumination');

	if(elems == null || elems.length != 1){
		return "Illumination element is MISSING or more than one element";
	}

	if(elems[0] != rootElement.children[2]){
		console.warn( "Expected 'illumination' (third element) but got : " + rootElement.children[2].nodeName);
	}

	var illum = elems[0];
	this.illumination.doubleSided = this.reader.getInteger(illum, "doublesided");
	this.illumination.local = this.reader.getInteger(illum, "local");

	console.log("Illum DoubleSided is: " + this.illumination.doubleSided  + " Illum Local" + this.illumination.local + "\n");

	var nNodes = illum.children.length;

	for(var i = 0; i < nNodes; i++){
		var child = illum.children[i];
		switch(child.tagName){
			case "background":
				this.illumination.background = this.getRGBAFromElement(child);
				break;
			case "ambient":
				this.illumination.ambient = this.getRGBAFromElement(child);
				break;
		}
	}

	console.log("BG:" + this.printRGBA(this.illumination.background) + " , Ambient: " + this.printRGBA(this.illumination.ambient));

}

//***************************
//*******</illumination>*****
//***************************

//---------------------------
//-------<lights>------------
//---------------------------

/* Function to parse the element: omni
Parses the following attributes:
	id : ss - defaultOmniLightID
	enabled : tt - initial state
	location : vector4
	ambient : rgb
	diffuse : rgb
	specular :	rgb
*/
MySceneGraph.prototype.parseOmniLights = function(element){

	if(element == null)
		return;

	if(this.lights[element.id] != null){
		console.error("Duplicate light id found : " + element.id);
	}

	var enable = this.reader.getBoolean(element, "enabled") || 0;
	var omni = this.scene.lights[this.lightIndex];

	omni.disable();
	omni.setVisible(true);


	if(enable == 1){
		this.scene.lights[this.lightIndex].enable();
	}

	var location = this.getVector4FromElement(element.getElementsByTagName("location")[0]);
	omni.setPosition(location.x,location.y,location.z,location.w);

	var ambient =  this.getRGBAFromElement(element.getElementsByTagName("ambient")[0]);
	omni.setAmbient(ambient.r,ambient.g,ambient.b,ambient.a);

	var diffuse = this.getRGBAFromElement(element.getElementsByTagName("diffuse")[0]);
	omni.setDiffuse(diffuse.r,diffuse.g,diffuse.b,diffuse.a);

	var specular = this.getRGBAFromElement(element.getElementsByTagName("specular")[0]);
	omni.setSpecular(specular.r,specular.g,specular.b,specular.a);

	console.log("Omni Added: id: " + omni.id + " enable : " + enable + " location: " + this.printVector3(location) + " ambient: " + this.printRGBA(ambient) + " diffuse: " + this.printRGBA(diffuse) + " specular: " + this.printRGBA(specular));

	this.lightsName.push(element.id);
	this.lights[element.id] = this.scene.lights[this.lightIndex];
	this.lightIndex++;
	omni.update();

}

/* Function to parse the element: spot
Parses the following attributes:
	id : ss - defaultSpotLightID
	enabled : tt - initial state
	angle : ff - spot angle
	exponent : ff - spot light exponent
	target : vector3
	location : vector4
	ambient : rgb
	diffuse : rgb
	specular :	rgb
*/
MySceneGraph.prototype.parseSpotLights = function(element){

	if(element == null)
		return;

	if(this.lights[element.id] != null){
		console.error("Duplicate light id found : " + element.id);
	}

	var spot = this.scene.lights[this.lightIndex];

	spot.disable();
	spot.setVisible(true);


	var enable = this.reader.getBoolean(element, "enabled") || 0;

	spot.disable();

	if(enable == 1){
		spot.enable();
	}

	var angle = this.reader.getFloat(element,"angle") || 0.0;
	angle *= Math.PI/180;
	spot.setSpotCutOff(angle);

	var exponent = this.reader.getFloat(element,"exponent") || 0.0;
	spot.setSpotExponent(exponent);

	var target = this.getVector3FromElement(element.getElementsByTagName("target")[0]);
	var location = this.getVector3FromElement(element.getElementsByTagName("location")[0]);
	spot.setPosition(location.x,location.y,location.z,1);
	var direction = {//Direction of the spot is target - location
		x : target.x - location.x,
		y : target.y - location.y,
		z : target.z - location.z
	}
	spot.setSpotDirection(direction.x,direction.y,direction.z);

	var ambient =  this.getRGBAFromElement(element.getElementsByTagName("ambient")[0]);
	spot.setAmbient(ambient.r,ambient.g,ambient.b,ambient.a);

	var diffuse = this.getRGBAFromElement(element.getElementsByTagName("diffuse")[0]);
	spot.setDiffuse(diffuse.r,diffuse.g,diffuse.b,diffuse.a);

	var specular = this.getRGBAFromElement(element.getElementsByTagName("specular")[0]);
	spot.setSpecular(specular.r,specular.g,specular.b,specular.a);

	console.log("Spot Added: id: " + spot.id + " enable : " + enable + " angle: " + angle + " exponent: " + exponent + " target: " +  this.printVector3(target) + " location: " + this.printVector3(location) + " ambient: " + this.printRGBA(ambient) + " diffuse: " + this.printRGBA(diffuse) + " specular: " + this.printRGBA(specular));

	this.lightsName.push(element.id);
	this.lights[element.id] = spot;
	this.lightIndex++;
	spot.update();

}

/* Function to parse the element: lights
Parses the following elements:
	omni :
	spot :
*/
MySceneGraph.prototype.parseLights = function(rootElement){

	var elems = rootElement.getElementsByTagName('lights');

	if(elems == null || elems.length != 1){
		return "Lights element is MISSING or more than one element";
	}

	if(elems[0] != rootElement.children[3]){
		console.warn("Expected 'lights' (forth element) but got : " + rootElement.children[3].nodeName);
	}

	var lights = elems[0];

	if(lights.children.length < 1){
		return "Missing lights please specify at least one 'omni' and/or 'spot'";
	} else if (lights.children.length > this.scene.lights.length)
		return "Lights limit is " + this.scene.lights.length + ", please remove some lights.";

	var nNodes = lights.children.length;

	for(var i = 0; i < nNodes; i++){
		var child = lights.children[i];
		switch(child.tagName){
			case "omni":
				this.parseOmniLights(child);
				break;
			case "spot":
				this.parseSpotLights(child);
				break;
		}
	}
}

//***************************
//*******</lights>***********
//***************************

//---------------------------
//-------<textures>----------
//---------------------------


/* Function to parse the element: textures
Parses the following attributes:
	id : ss
	file : ss
	length_s : ff
	length_t : ff
*/
MySceneGraph.prototype.parseTextures = function(rootElement){

	var elems = rootElement.getElementsByTagName('textures');

	if(elems == null || elems.length != 1){
		return "Textures element is MISSING or more than one element";
	}

	if(elems[0].children.length < 1){
		return "There should be at least one texture!";
	}

	if(elems[0] != rootElement.children[4]){
		console.warn("Expected 'textures' (fifth element) but got : " + rootElement.children[4].nodeName);
	}

	var texts = elems[0];

	var nNodes = texts.children.length;

	for(var i = 0; i < nNodes; i++){
		var child = texts.children[i];
		var texture = {
			id : this.reader.getString(child,"id"),
			textData : new CGFtexture(this.scene,this.reader.getString(child,"file")),
			length_s : this.reader.getFloat(child,"length_s"),
			length_t : this.reader.getFloat(child,"length_t")
		};
		console.log("Texture read with id: " + texture.id + " path: " + texture.textData.path + " length_s: " + texture.length_s + " length_t: " + texture.length_t);

		if(this.textures[texture.id] != null){
			console.error("Duplicate texture id found : " + element.id);
		}

		this.textures[texture.id] = texture;
	}
}

//***************************
//*******</textures>*********
//***************************

//---------------------------
//-------<materials>---------
//---------------------------

/*Function to parse the element: Material
Parses the following attributes:
	emission : rgba
	ambient : rgba
	diffuse : rgba
	specular : rgba
	shininess : ff
*/
 MySceneGraph.prototype.parseMaterial = function(element){

	if(element == null)
		return;

	var emission = this.getRGBAFromElement(element.getElementsByTagName("emission")[0]);
	var ambient = this.getRGBAFromElement(element.getElementsByTagName("ambient")[0]);
	var diffuse = this.getRGBAFromElement(element.getElementsByTagName("diffuse")[0]);
	var specular = this.getRGBAFromElement(element.getElementsByTagName("specular")[0]);
	var shininess = this.reader.getFloat(element.getElementsByTagName("shininess")[0],"value");

	console.log("Material read with id: " + element.id + " emission: " + this.printRGBA(emission) + " ambient: " + this.printRGBA(ambient) + " diffuse: " + this.printRGBA(diffuse) + " specular: " + this.printRGBA(specular) + " shininess: " + shininess);

	var appear = new CGFappearance(this.scene);
	appear.setAmbient(ambient.r,ambient.g,ambient.b,ambient.a);
	appear.setDiffuse(diffuse.r,diffuse.g,diffuse.b,diffuse.a);
	appear.setEmission(emission.r,emission.g,emission.b,emission.a);
	appear.setSpecular(specular.r,specular.g,specular.b,specular.a);
	appear.setShininess(shininess);

	if(this.materials[element.id] != null){
		console.error("Duplicate material id found : " + element.id);
	}
	this.materials[element.id] = appear;
}
/* Function to parse the element: Materials
Parses the following elements:
	material :
*/
MySceneGraph.prototype.parseMaterials = function(rootElement){

	var elems = rootElement.getElementsByTagName('materials');

	if(elems[0] == null || elems[0].parentNode != rootElement){
		return "Materials element is MISSING or more than one element and this block HAS to be prior to components block!";
	}

	if(elems[0].children.length < 1)
		return "There should be at least 1 or more material blocks";

	if(elems[0] != rootElement.children[5]){
		console.warn("Expected 'materials' (sixth element) but got : " + rootElement.children[5].nodeName);
	}

	var materials = elems[0];

	var nNodes = materials.children.length;

	for(var i = 0; i < nNodes; i++)
		this.parseMaterial(materials.children[i]);
}

//***************************
//*******</materials>********
//***************************

//---------------------------
//-------<transformations>---
//---------------------------

/*Function to parse the element: Material
Parses the following attributes:
	emission : rgba
	ambient : rgba
	diffuse : rgba
	specular : rgba
	shininess : ff
*/
 MySceneGraph.prototype.parseTransformation = function(element){

	if(element == null)
		return;
	console.log("Reading transformation " + element.id);
	var trans = this.ComputeTransformation(element);

	if(this.transformations[element.id] != null){
		console.error("Duplicate transformation id found : " + element.id);
	}
	this.transformations[element.id] = trans;
}
/* Function to parse the element: Materials
Parses the following elements:
	material :
*/
MySceneGraph.prototype.parseTransformations = function(rootElement){

	var elems = rootElement.getElementsByTagName('transformations');

	if(elems == null || elems.length != 1){
		return "Transformation element is MISSING or more than one element!";
	}

	if(elems[0].children.length < 1)
		return "There should be at least 1 or more transformation blocks";

	if(elems[0] != rootElement.children[6]){
		console.warn("Expected 'transformations' (seventh element) but got : " + rootElement.children[6].nodeName);
	}

	var transformations = elems[0];

	var nNodes = transformations.children.length;

	for(var i = 0; i < nNodes; i++)
		this.parseTransformation(transformations.children[i]);
}

//***************************
//*******</transformation>***
//***************************
//---------------------------
//--------<ANIMATIONS>-------
//---------------------------

/*Function to parse the element: Animations
Parses the following attributes:
	type : string
*/
 MySceneGraph.prototype.parseAnimations = function(rootElement){

	if(rootElement == null)
		return;
	console.log("Reading Animations!");
	var elems = rootElement.getElementsByTagName("animations");

	if(elems == null || elems > 1){
		return "There must be only one <animations> block!";
	}

	if(elems[0] != rootElement.children[7]){
		console.warn("Expected 'components' (eigth element) but got : " + rootElement.children[8].nodeName);
	}

	var block = elems[0];
	console.log("Childs:" + block.children.length);
	for(var i = 0; i < block.children.length; i++){

		var child = block.children[i];

		if(child.tagName != "animation")
			return "There must be one or more blocks of <animation> inside <animations>!";

		var type = this.reader.getString(child,'type');

		switch(type){
			case 'linear':
				var error = this.parseAnimationLinear(child);
				if(error) return error;
				break;
			case 'circular':
				var error = this.parseAnimationCircular(child);
				if(error) return error;
				break;
		}

	}


}

/*Function to parse the element: Animation
Parses the following attributes:
	id : ss
	span : ff
	type : linear
Parses the following element:
	controlpoint
*/
 MySceneGraph.prototype.parseAnimationLinear = function(element){

	if(element == null)
		return "Element <animation> is null!";

	if(element.children.length < 2)
		return "Error in animarion id:[ " + element.id + " ] There must be more than one <controlpoint>!";

	console.log("Parsing animation:" + element.id);

	var span = this.reader.getFloat(element, 'span');

	var points = [];

	for(var i = 0; i < element.children.length; i++){

		var child = element.children[i];

		if(child.tagName != 'controlpoint')
			return "Error! in animation id:[ " + element.id + " ] Expecting controlpoint, got " + child.tagName;


		points.push(this.getVector3FromElement2(child,"xx","yy","zz"));

	}
	console.log("Animation Parsed: " + element.id );
	this.animations[element.id] = new LinearAnimation(points, span);

	return null;

}
/*Function to parse the element: Animation
Parses the following attributes:
	id : ss
	span : ff
	type : circular
	center : ff ff ff
	radius : ff
	startang : ff
	rotang : ff

*/
 MySceneGraph.prototype.parseAnimationCircular = function(element){

	if(element == null)
		return "Element <animation> is null!";

	console.log("Parsing animation:" + element.id);

	var span = this.reader.getFloat(element, 'span');
	var center = this.getVector3FromElement2(element,"centerx","centery","centerz");
	var radius = this.reader.getFloat(element,'radius');
	var startAng = this.reader.getFloat(element,'startang');
	var rotAng = this.reader.getFloat(element,'rotang');

	console.log("Animation Parsed: " + element.id );
	this.animations[element.id] = new CircularAnimation(span,center, radius, startAng, rotAng);

	return null;

}

//***************************
//*******</ANIMATIONS>********
//***************************
//--------------------------------
//-----------<PRIMITIVES>---------
//--------------------------------
/* Function to parse the element: Primitives
Parses the following elements:
	primitive :
*/
MySceneGraph.prototype.parsePrimitives = function(rootElement){

	var elems = rootElement.getElementsByTagName('primitives');

	if(elems == null || elems.length != 1){
		return "primitives element is MISSING or more than one element";
	}

	var primitives = elems[0];

	if(primitives.children == null || primitives.children.length == 0){
		return "There must be one or more <primitive> inside <primitives>";
	}

	if(elems[0] != rootElement.children[8]){
		console.warn("Expected 'primitives' (ninth element) but got : " + rootElement.children[7].nodeName);
	}

	var nnodes = primitives.children.length;
	var error;
	for(var i = 0; i < nnodes; i++){

		var child = primitives.children[i];

		if(child.tagName != "primitive")
			return "Parsing <primitive> instead got: <" + child.tagName + ">";

		error = this.parsePrimitive(child);
		if(error)
			return error;
	}
}
/* Function to parse the element: Primitive
Parses the following attributes:
	id
Parses the following elements:
	rectangle :
	triangle
	cylinder
	sphere
	torus
*/
MySceneGraph.prototype.parsePrimitive = function(element){

	if(element.children == null || element.children.length != 1){
		return ("There must be ONLY ONE (<rectangle>,<triangle>,<cylinder>,<sphere>,<torus>) inside <primitive> : " + element.id);
	}
	console.log("Parsing primitive:" + element.id);

	var child = element.children[0];
	var primitive;
	switch(child.tagName){
		case "rectangle":
		primitive = this.parseRectangle(child);
		break;
		case "triangle":
		primitive = this.parseTriangle(child);
		break;
		case "cylinder":
		primitive = this.parseCylinder(child);
		break;
		case "torus":
		primitive = this.parseTorus(child);
		break;
		case "sphere":
		primitive = this.parseSphere(child);
		break;
		case "plane":
		primitive = this.parsePlane(child);
		break;
		case "patch":
		primitive = this.parsePatch(child);
		break;
		case "vehicle":
		primitive = new Vehicle(this.scene);
		break;
		case "chessboard":
		primitive = this.parseChessboard(child);
		break;
	}

	if(this.primitives[element.id] != null){
		console.error("Duplicate primitive id found : " + element.id);
	}
	this.primitives[element.id] = primitive;

}
/*Function to parse the colors of the chessboard colors
*/
MySceneGraph.prototype.getChildFromElem = function (element,childName) {
	var childs = element.getElementsByTagName(childName);
	if(childs.length > 1){
		console.error("You can only specificy on element " + childName + " in primitive with id " + element.parentNode.id);
		return;
	}
	var child = childs[0];
	if(child == null){
		console.error("You have to specify a " + childName + " element to the chessboard with id: " + element.parentNode.id);
		return;
	}

	return this.getRGBAFromElement(child);
};
/* Function to parse the element: Chessboard
Parses the following attributes:
	du : ii
	dv : ii
	textureref : ss
	su : ii
	sv : ii
	c1 : rgba
	c2 : rgba
	cs : rgba
*/
MySceneGraph.prototype.parseChessboard = function(element){
	var tmp = {
		du:0,
		dv:0,
		textref:0,
		su:0,
		sv:0
	}
	tmp.du = this.reader.getInteger(element,"du");
	tmp.dv = this.reader.getInteger(element,"dv");
	tmp.textref = this.reader.getString(element,"textureref");
	tmp.su = this.reader.getInteger(element,"su");
	tmp.sv = this.reader.getInteger(element,"sv");
	var cor1 = this.getChildFromElem(element,"c1");
	var cor2 = this.getChildFromElem(element,"c2");
	var corS = this.getChildFromElem(element,"cs");

	console.log("Read c1 :" + this.printRGBA(cor1));
	console.log("Read c2 :" + this.printRGBA(cor2));
	console.log("Read cs :" + this.printRGBA(corS));
	console.log("New Chessboard du: " + tmp.du, " dv: " + tmp.dv + " textureref: " + tmp.textref + " su: " + tmp.su + " sv: " + tmp.sv);

	return new Chessboard(this.scene,tmp.du,tmp.dv, this.textures[tmp.textref] ,tmp.su,tmp.sv,cor1,cor2,corS);
}
/* Function to parse the element: Rectangle
Parses the following attributes:
	x1 : ff
	y1 : ff
	x2 : ff
	y2 : ff
*/
MySceneGraph.prototype.parseRectangle = function(element){
	var tmp = {
		x1:0,
		y1:0,
		x2:0,
		y2:0
	}
	tmp.x1 = this.reader.getFloat(element,"x1");
	tmp.x2 = this.reader.getFloat(element,"x2");
	tmp.y1 = this.reader.getFloat(element,"y1");
	tmp.y2 = this.reader.getFloat(element,"y2");
	console.log("New Rectangle X1:" + tmp.x1, "Y1:" + tmp.y1 + "X2:" + tmp.x2 + "Y2:" + tmp.y2 );
	return new Rectangle(this.scene,tmp.x1, tmp.x2, tmp.y1, tmp.y2);
}
/*Function to parse the control points of a patch
*/
MySceneGraph.prototype.parseControlPoints = function (controlPoints) {
	var res = [];
	for(var i = 0; i < controlPoints.length;i++){
		var point = this.getVector3FromElement(controlPoints[i]);
		res.push([point.x,point.y,point.z]);
	}
	return res;
};
/* Function to parse the element: Plane
Parses the following attributes:
	orderU : ff
	orderV : ff
	partsU : ii
	partsV : ii
*/
MySceneGraph.prototype.parsePatch = function(element){
	var tmp = {
		x1:0,
		y1:0,
		x2:0,
		y2:0
	}
	tmp.x1 = this.reader.getInteger(element,"orderU");
	tmp.x2 = this.reader.getInteger(element,"orderV");
	tmp.y1 = this.reader.getInteger(element,"partsU");
	tmp.y2 = this.reader.getInteger(element,"partsV");
	console.log("New Plane orderU:" + tmp.x1, "orderV:" + tmp.y1 + "partsU:" + tmp.x2 + "partsV:" + tmp.y2 );
	var nPoints = (tmp.x1 + 1)*(tmp.x2 + 1);
	if (nPoints != element.children.length)
		console.error("The number of control points on primitive " + element.parentNode.id + " must be equal to " + nPoints);
	var controlP = this.parseControlPoints(element.children);
	return new Patch(this.scene,tmp.x1, tmp.x2, tmp.y1, tmp.y2, controlP);
}
/* Function to parse the element: Plane
Parses the following attributes:
	dimX : ff
	dimY : ff
	partsX : ii
	partsY : ii
*/
MySceneGraph.prototype.parsePlane = function(element){
	var tmp = {
		x1:0,
		y1:0,
		x2:0,
		y2:0
	}
	tmp.x1 = this.reader.getFloat(element,"dimX");
	tmp.x2 = this.reader.getFloat(element,"dimY");
	tmp.y1 = this.reader.getInteger(element,"partsX");
	tmp.y2 = this.reader.getInteger(element,"partsY");
	console.log("New Plane dimX:" + tmp.x1, "dimY:" + tmp.y1 + "partsX:" + tmp.x2 + "partsY:" + tmp.y2 );
	return new Plane(this.scene,tmp.x1, tmp.x2, tmp.y1, tmp.y2);
}
/* Function to parse the element: Sphere
Parses the following attributes:
	radius : ff
	slices : ii
	stacks : ii
*/
MySceneGraph.prototype.parseSphere = function(element){
	var tmp = {
		radius:0,
		slices:0,
		stacks:0,
	}
	tmp.radius = this.reader.getFloat(element,"radius");
	tmp.slices = this.reader.getInteger(element,"slices");
	tmp.stacks = this.reader.getInteger(element,"stacks");
	console.log("New Sphere radius:" + tmp.radius, " slices:" + tmp.slices + " stacks:" + tmp.stacks);
	return new Sphere(this.scene,tmp.radius,tmp.slices,tmp.stacks);
}
/* Function to parse the element: Torus
Parses the following attributes:
	inner : ff
	outer : ff
	slices : ii
	loops : ii
*/
MySceneGraph.prototype.parseTorus = function(element){
	var inner = 0;
	var outer = 0;
	var slices = 0;
	var loops = 0;

	inner = this.reader.getFloat(element,"inner");
	outer = this.reader.getFloat(element,"outer");
	slices = this.reader.getInteger(element,"slices");
	loops = this.reader.getInteger(element,"loops");

	console.log("New Torus inner:" + inner, "outer:" + outer + "slices:" + slices + "loops:" + loops);
	return new Torus(this.scene,inner, outer, slices, loops);

}
/* Function to parse the element: Cylinder
Parses the following attributes:
	base : ff
	top : ff
	height : ff
	slices : ii
	stacks : ii
*/
MySceneGraph.prototype.parseCylinder = function(element){
	var base = 0;
	var top = 0;
	var height = 0;
	var slices = 0;
	var stacks = 0;

	base = this.reader.getFloat(element,"base");
	top = this.reader.getFloat(element,"top");
	height = this.reader.getFloat(element,"height");
	slices = this.reader.getInteger(element,"slices");
	stacks = this.reader.getInteger(element,"stacks");

	console.log("New Cylinder base:" + base, " top:" + top + " height:" + height +  " slices:" + slices + " stacks:" + stacks);
	return new Cylinder(this.scene,base,top,height,slices,stacks);

}
/* Function to parse the element: Triangle
Parses the following attributes:
	x1 : ff
	y1 : ff
	z1 : ff
	x2 : ff
	y2 : ff
	z2 : ff
	x3 : ff
	y3 : ff
	z3 : ff
*/
MySceneGraph.prototype.parseTriangle = function(element){
	var x1 = 0;
	var y1 = 0;
	var z1 = 0;
	var x2 = 0;
	var y2 = 0;
	var z2 = 0;
	var x3 = 0;
	var y3 = 0;
	var z3 = 0;

	x1 = this.reader.getFloat(element,"x1");
	y1 = this.reader.getFloat(element,"y1");
	z1 = this.reader.getFloat(element,"z1");
	x2 = this.reader.getFloat(element,"x2");
	y2 = this.reader.getFloat(element,"y2");
	z2 = this.reader.getFloat(element,"z2");
	x3 = this.reader.getFloat(element,"x3");
	y3 = this.reader.getFloat(element,"y3");
	z3 = this.reader.getFloat(element,"z3");

	console.log("New Triangle p1:" + x1 + "," + y1 + "," + z1 + ")" +
							" p2:" + x2 + "," + y2 + "," + z2 + ")" +
							" p3:" + x3 + "," + y3 + "," + z3 + ")");
	return new Triangle(this.scene,x1,y1,z1,x2,y2,z2,x3,y3,z3);

}
//********************************
//************</PRIMITIVES>*******
//********************************
//--------------------------------
//-----------<COMPONENTS>---------
//--------------------------------
/* Function to parse the element: Components
Parses the following elements:
	component :
*/
MySceneGraph.prototype.parseComponents = function(rootElement){

	var elems = rootElement.getElementsByTagName('components');

	if(elems == null || elems.length != 1){
		return "components element is MISSING or more than one element";
	}

	if(elems[0] != rootElement.children[9]){
		console.warn("Expected 'components' (tenth element) but got : " + rootElement.children[8].nodeName);
	}

	var components = elems[0];

	var nnodes = components.children.length;
	var error;
	for(var i = 0; i < nnodes; i++){

		var child = components.children[i];

		if(child.tagName != "component")
			return "Expecting <component> instead got: <" + child.tagName + ">";

		error = this.parseComponent(child);

		if(error)
			return error;
	}
}
/* Function to parse the element: Component
Parses the following attributes:
	id : ss
Parses the following elements:
	transformation :
	materials
	texture
	children
*/
MySceneGraph.prototype.parseComponent = function(element){

	console.log ("Parsing Component:" + element.id);

	var transformation = element.getElementsByTagName("transformation");

	if(transformation.length > 1 || transformation.length == 0)
		return "Only ONE <transformation> block is required";

	transformation = this.parseCTransform(transformation[0]);

	var materials = element.getElementsByTagName("materials");

	if(materials == null || materials.length > 1 || materials.length == 0)
		return "Only ONE <materials> block is required";

	materials = this.parseCMat(materials[0]);

	if(materials.length == 0)
		return "Component need at least one material";

	var texture = element.getElementsByTagName("texture");

	if(texture.length > 1 || texture.length == 0)
		return "Only ONE <texture> block is required";

	texture = texture[0].id;

	if(texture != "none" && texture != "inherit"){
		texture = this.textures[texture];
	}

	var comp = new Component(this.scene);
	comp.texture = texture;
	comp.materials = materials;
	comp.material = materials[0];
	comp.matrix = transformation;

	console.log("Component" + element.id + " materials:" + materials.length);
	//leitura de childern

	var childern = element.getElementsByTagName("children");
	if(childern.length > 1 || childern.length == 0 || childern == null)
		return "Only ONE <children> block is required";

	children = childern[0];

	var nnodes = children.children.length;

	if(nnodes < 1){
		return "Need at least one componentref OR primitiveref";
	}

	for(var i = 0; i < nnodes; i++){

		var child = children.children[i];
		switch(child.tagName){

			case "componentref":
				comp.componentsID.push(child.id);
			break;
			case "primitiveref":
				comp.primitivesID.push(child.id);
			break;
		}
	}

	comp.animations = this.parseCAnimation(element);

	if(this.components[element.id] != null){
		console.error("Duplicate component id found : " + element.id);
	}
	this.components[element.id] = comp;
}
/* Function to parse the element: transformation inside component
Parses the following elements:
	material
*/
MySceneGraph.prototype.parseCTransform = function(element){

	var transformRef = element.getElementsByTagName("transformationref");

	if(transformRef != null && transformRef.length == 1)
		return this.transformations[transformRef[0].id];
	else
		return this.ComputeTransformation(element);

}
/* Function to parse the element: materials inside component
Parses the following elements:
	material
*/
MySceneGraph.prototype.parseCMat = function(element){

	var res = [];

	var nnodes = element.children.length;

	for(var i = 0; i < nnodes; i++){
		var child = element.children[i];
		var mat;
		if(child.id == "inherit")
			mat = "inherit";
		else
			mat = this.materials[child.id];

		if(mat == null)
			console.error("Material:" + child.id + " don't exist");
		else
			res.push(mat);
	}
	return res;
}
/* Function to parse the element: materials inside component
Parses the following elements:
	material
*/
MySceneGraph.prototype.parseCAnimation = function(element){

	var res = [];

	var anims = element.getElementsByTagName('animation');

	if(anims == null || anims.length == 0)
		return res;

	if(anims.length > 1){
		console.error("There must be only 1 animation block per component!");
		return res;
	}

	var childs = anims[0].children;
	var nnodes = childs.length;

	for(var i = 0; i < nnodes; i++){
		var animref = childs[i];

		var animation = this.animations[animref.id];

		if(animation == null){
			console.error("Animation ID:"+ animref.id + " don't exist!");
		}else
			res.push(animation);
	}
	return res;
}
//********************************
//************</COMPONENTS>*******
//********************************
//--------------------------------
//-------<GAMECOMPONENTS>---------
//--------------------------------
/* Function to parse the element: GameComponents
Parses the following elements:
	boardPosition :
	cell :
	body :
	claw :
	leg :
*/
MySceneGraph.prototype.parseGameComponents = function(rootElement){

	var elems = rootElement.getElementsByTagName('gamecomponents');

	if(elems == null || elems.length != 1){
		return "gamecomponents element is MISSING or more than one element";
	}

	var components = elems[0];

	var nnodes = components.children.length;
	var error;
	for(var i = 0; i < nnodes; i++){

		var child = components.children[i];
		var componentID = this.reader.getString(child, 'component');
		var component = this.components[componentID];

		switch(child.tagName){
			case 'boardLocation':
			case 'claw':
			case 'leg':
			case 'body':
			case 'cell':
				break;
			default:
				component = null;
				break;
		}

		if(component)
			this.gameComponents[child.tagName] = component;

		if(error)
			return error;
	}
}

//********************************
//********</GAMECOMPONENTS>*******
//********************************
