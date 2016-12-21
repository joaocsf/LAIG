/*Call that handles all animations and iterates over them to play an animation*/
function Animator(scene) {
	this.scene = scene;
	this.recording = true;
	this.startTime = 0;
	this.animationTime = 0;
	this.animationMaxTime = 20;
	this.animations = [];
	this.lastTime = 0;
	this.play = false;
	this.lastPlay = false;
	this.animate = true;
	this.playUI;
	this.currTime;
};

Animator.prototype.changingAnimationTime = function(lmnt){
	this.playUI = this.lmnt;
}

Animator.prototype.changingAnimationTime = function(){
	this.animate = false;
	this.lastPlay = false;
}

Animator.prototype.changedAnimationTime = function(){
	this.animate = true;
	this.lastPlay = false;
}

Animator.prototype.updateMaxTime = function(){
	this.animationMaxTime = this.animationTime + 5;
	this.playUI.__max = this.animationMaxTime;
}

Animator.prototype.undo = function(){
	console.log("Hello");
	this.updateMaxTime();
	console.log(this.animationTime - this.animationMaxTime + " = Rs");
	this.clearKeyframes(this.animationTime);
}

Animator.prototype.clearKeyframes = function(time){
	for(var i = 0; i < this.animations.length; i++){
		this.animations[i].clearKeyframes(time);
	}
}

Animator.prototype.update = function(currTime){
	this.currTime = currTime;

	if(this.recording && this.play){
			if(this.animationTime > this.animationMaxTime - 5){
				this.updateMaxTime();
			}
	}

	if(this.startTime == 0){
		this.startTime = currTime;
		return;
	}
	if(!this.play || !this.animate)
		this.startTime = currTime;


	if(this.play){
		if(this.animate)
			if(!this.lastPlay){
				this.startTime = currTime - this.animationTime;
			}else{
				this.animationTime = currTime - this.startTime;
			}

	}

	if(this.animationTime > this.animationMaxTime){
		this.animationTime = this.animationMaxTime;
		this.play = false;
	}

	var elapsed = this.animationTime;

	for(var i = 0; i < this.animations.length; i++){
		this.animations[i].update(elapsed);
	}

	this.lastTime = currTime - this.startTime;
	this.lastPlay = this.play;
}

Animator.prototype.addAnimation = function(animation){
	this.animations.push(animation);
}
