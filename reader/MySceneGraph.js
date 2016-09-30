
function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	this.ambient = [0.1,0.1,0.1,1]; 
	this.background = [0,0,0,1];
	this.views = {}

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

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;
	
	// Here should go the calls for different functions to parse the various blocks
	//var error = this.parseGlobalsExample(rootElement);

	var error = this.parseViews(rootElement);
	
	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();

};
//Function that Returns a CGFCamera() using the defaultCameraID
MySceneGraph.prototype.getCamera = function(){
	
	var view = this.views[this.defaultCameraID];

	return new CGFcamera(view.angle, view.near, view.far, vec3.fromValues(view.from.x, view.from.y, view.from.z), vec3.fromValues(view.to.x, view.to.y, view.to.z));

}

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
	var view = {
		near : this.reader.getFloat(element, "near") || 0.0,
		far : this.reader.getFloat(element, "far") || 0.0, 
		angle : this.reader.getFloat(element, "angle") || 0.0, 
		from : this.getVector3FromElement(from),
		to :  this.getVector3FromElement(to)
	};
	console.log("View Added: near: " + view.near + " far: " + view.far + " angle: " + view.angle + " from: " + this.printVector3(view.from) + " to: " + this.printVector3(view.to) );
	this.views[element.id] = view; 
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
	this.defaultCameraID = this.reader.getString(views,'default');

	console.log("Default View is: " + this.defaultCameraID);
	
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

/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 
 
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

};
	
/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


