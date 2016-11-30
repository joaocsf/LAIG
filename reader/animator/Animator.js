/*Call that handles all animations and iterates over them to play an animation*/
function Animator(scene) {
	this.scene = scene;
	
	this.startTime = 0;
	
	this.animations = [];
};

Animator.prototype.update = function(currTime){
	
	
	if(this.startTime == 0){
		this.startTime = currTime;
		return;
	}
	var elapsed = currTime - this.startTime;
	
	for(var i = 0; i < this.animations.length; i++){
		this.animations[i].update(elapsed);
	}	
}

Animator.prototype.addAnimation = function(animation){
	this.animations.push(animation);
}

 
 