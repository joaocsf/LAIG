/*Call that handles all animations and iterates over them to play an animation*/
function Animator(scene) {
	this.scene = scene;

	this.startTime = 0;
	this.animationTime = 0;
	this.animationMaxTime = 20;
	this.animations = [];
	this.lastTime = 0;
	this.play = false;
	this.lastPlay = false;
	this.animate = true;
};

Animator.prototype.changingAnimationTime = function(){
	this.animate = false;
	this.lastPlay = false;
}


Animator.prototype.changedAnimationTime = function(){
	this.animate = true;
	this.lastPlay = false;
}

Animator.prototype.update = function(currTime){



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
