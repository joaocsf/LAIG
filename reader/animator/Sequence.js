/*Sequence handles all the keyframes and select the best pair of keyframes to animate
*/
function Sequence(name, object, attribute) {
	this.name = name;
	this.startTime = 0;

	this.object = object;
	this.attribute = attribute;

	this.keyframes = [];

	this.times = [];

};

Sequence.prototype.update = function(time){
	if(!this.keys || !this.keyframes)
		return;

	var first;
	var second;
	for(var i = 0; i < this.keys.length; i++){
		var key = this.keys[i];
		if(key <= time){
			first = this.keyframes[key];
		}if(key > time){
			second = this.keyframes[key];
			break;
		}
	}

	if(!second)
		second = first;
	first.lerp(this.object, this.attribute,second,time);

}

/*Generic method to add a keyframe
*/
Sequence.prototype.addKeyframe = function(keyframe){
	this.keyframes[keyframe.getTime()] = keyframe;

	this.keys= Object.keys(this.keyframes).sort(function(a,b) { return a - b;});
	console.log(this.keys);

}

Sequence.prototype.getName = function(){
	return this.name;
}
