function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	this.illumination = { 	ambient : {r: 0.1, g: 0.1, b: 0.1, a: 1} ,
							background : {r: 0, g: 0, b: 0, a: 1}};
	this.views = { default : "" , childs : [], defaultID : 0};

	this.sceneInfo = { root : "", axis_length : 0.0};
	this.lights = {};
	this.lightIndex = 0;
	this.textures = {};
	this.materials = {};
	this.transformations = {};
	this.primitives = {};
	this.components = {};

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
	if(this.checkError(this.parsePrimitives(rootElement)))
		return;
	if(this.checkError(this.parseComponents(rootElement)))
		return;
	
	this.startAssociation();

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();

};

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
		component.components.push(this.components[key]);
	}

	for(var i = 0; i < component.primitivesID.length; i++){
		var key = component.primitivesID[i];
		component.primitives.push(this.primitives[key]);
	}
}
MySceneGraph.prototype.startAssociation = function(element){
	for(var key in this.components){
		var component = this.components[key];

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
	color.g = this.reader.getFloat(element, "g");
	color.b = this.reader.getFloat(element, "b");
	color.a = this.reader.getFloat(element, "a");

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

	var from = element.getElementsByTagName("from")[0];
	var to = element.getElementsByTagName("to")[0];
	//Check de erro (TODO)
	var view = {
		near : this.reader.getFloat(element, "near") || 0.0,
		far : this.reader.getFloat(element, "far") || 0.0, 
		angle : this.reader.getFloat(element, "angle") || 0.0, 
		from : this.getVector3FromElement(from),
		to :  this.getVector3FromElement(to)
	};
	view.angle *= Math.PI/180;
	console.log("View Added: near: " + view.near + " far: " + view.far + " angle: " + view.angle + " from: " + this.printVector3(view.from) + " to: " + this.printVector3(view.to) );
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


	//Check de erro (TODO)
	console.log("Omni Added: id: " + omni.id + " enable : " + enable + " location: " + this.printVector3(location) + " ambient: " + this.printRGBA(ambient) + " diffuse: " + this.printRGBA(diffuse) + " specular: " + this.printRGBA(specular));
	
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

	//Check de erro (TODO)
	console.log("Spot Added: id: " + spot.id + " enable : " + enable + " angle: " + angle + " exponent: " + exponent + " target: " +  this.printVector3(target) + " location: " + this.printVector3(location) + " ambient: " + this.printRGBA(ambient) + " diffuse: " + this.printRGBA(diffuse) + " specular: " + this.printRGBA(specular));
	
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

	var lights = elems[0];
	
	if(lights.children.length < 1){
		return "Missing lights please specify at least one 'omni' and/or 'spot'";
	}
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

	this.materials[element.id] = appear;
	//Check de erro (TODO)
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

	this.transformations[element.id] = trans;
	//Check de erro (TODO)
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

	var transformations = elems[0];
	
	var nNodes = transformations.children.length;
	
	for(var i = 0; i < nNodes; i++)
		this.parseTransformation(transformations.children[i]);
}

//***************************
//*******</transformation>***
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
		return "There must be ONLY ONE (<rectangle>,<triangle>,<cylinder>,<sphere>,<torus>) inside <primitive>";
	}
	console.log("Parsing primitive:" + element.id);

	var child = element.children[0];
	var primitive;
	switch(child.tagName){
		case "rectangle":
		primitive = this.parseRectangle(child);
		break;
		case "triangle":

		break;
		case "cylinder":

		break;
		case "torus":

		break;
	}
	
	this.primitives[element.id] = primitive;

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
		texture = this.textures[texture].textData; 
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
		return "Only ONE <texture> block is required";
		
	children = childern[0];
	
	var nnodes = children.children.length;

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
//********************************
//************</COMPONENTS>*******
//********************************

/** Example of method that parses elements of one block and stores information in a specific data structure
 
 
MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {
	
	var elems =  rootElement.getElementsByTagName('globals');
	if (elems == null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

	var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null  || tempList.length==0) {
		return "list element is missing.";
	}
	
	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];
		
		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	};

}*/