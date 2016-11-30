/*Call that handles sequences and iterates over them to play a sequence
* Each sequence defines an animation of a certain object
* Each Animated Object must have an Animation class and must be added to the Animator
*/
function Animation() {
	
	this.startTime = 0;
	
	this.sequences = [];
};

Animation.prototype.update = function(time){
	
	for(var key in this.sequences){
		this.sequences[key].update(time);
	}
}

/*Adding a keyframe to an sequence, needs an uniqueID and an keyframe
* There is no need to create your own sequence class, this methos does that.
*/
Animation.prototype.addKeyframe = function(sequenceName, keyframe){
	
	if(!this.sequences[sequenceName]){
		
		this.sequences[sequenceName] = new Sequence(sequenceName);
	}
	
	this.sequences[sequenceName].addKeyframe(keyframe);
	
	
}
