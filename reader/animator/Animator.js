/*Call that handles all animations and iterates over them to play an animation*/
function Animator(scene) {
	this.scene = scene;

	this.startTime = 0;
	this.animationTime = 0;
	this.animationMaxTime = 20;
	this.animations = [];
	this.lastTime = 0;
	this.play = false;
};

Animator.prototype.update = function(currTime){


	if(this.startTime == 0){
		this.startTime = currTime;
		return;
	}
	if(!this.play)
		this.startTime = currTime;

	this.lastTime = currTime - this.startTime;
	var elapsed = this.animationTime;
	if(this.play)
		elapsed += currTime - this.startTime;

	for(var i = 0; i < this.animations.length; i++){
		this.animations[i].update(elapsed);
	}
}

Animator.prototype.addAnimation = function(animation){
	this.animations.push(animation);
}
