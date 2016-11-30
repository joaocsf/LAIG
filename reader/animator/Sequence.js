/*Sequence handles all the keyframes and select the best pair of keyframes to animate
*/
function Sequence(name) {
	this.name = name;
	this.startTime = 0;
	
	this.keyframes = [];
	
	this.times = [];
	
};

Sequence.prototype.update = function(time){
	
	var first;
	var second;
	for(var key in this.keyframes){
		if(key <= time){
			first = this.keyframes[key];
		}if(key > time){
			second = this.keyframes[key];
			break;
		}
	}
	
	if(!second)
		second = first;
	first.lerp(second,time);

}

/*Generic method to add a keyframe
*/
Sequence.prototype.addKeyframe = function(keyframe){
	this.keyframes[keyframe.getTime()] = keyframe;
}

Sequence.prototype.getName = function(){
	return this.name;
}
