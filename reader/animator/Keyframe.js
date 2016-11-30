/*The Keyframe class handles the behaviour of an object in a specific point in time.
* You Must define the following attributes:
	-Time: 			time of the keyframe
	-Object: 		the object that has an attribute that will be changed.
	-Attribute: 	the attribute inside quotes that will be changed.
	-Value:			the value of the attribute at that time.
	-lerpFunction:	the transtition function to animate between two frames.
*/
function Keyframe(time, object, attribute, value, lerpFunction) {
	this.time = time;
	this.object = object;
	this.attribute = attribute;
	this.value = value;
	this.lerpFunction = lerpFunction;
};

/*Function to lerp between keyframes.
* Each keyframe have the information about object that will be changed
	-maybe change that information to the sequence to optimize!
*/
Keyframe.prototype.lerp = function(keyframe2, t){
	
	var localTime = t - this.time;
	
	var deltaTime = keyframe2.time - this.time;
	
	var time = 0;
	
	if(deltaTime != 0)
		time = localTime/deltaTime;
	
	
	this.object[this.attribute] = this.lerpFunction(this.value, keyframe2.value, time);
	console.log("FROM:" + time);
	console.log(this.value);
	console.log("TO:");
	console.log(keyframe2.value);
	
	console.log(this.object[this.attribute]);
}

Keyframe.prototype.getTime = function(){
	return this.time;
}