/*		Class responsible to save the state of the client game
*	and to display/store all the pieces used.
*/
function Member(scene, board, id, team, type, selectShader) {
	CGFobject.call(this,scene);
  if(type != 'CLAW' && type != 'LEG'){
    console.error("ERROR! Type undifined!")
    return;
  }
	this.id = id;
	this.model = (type == 'CLAW')? 'claw': 'leg';
	this.board = board;
  this.type = type;
  this.team = team;
	this.pickID = -1;
	this.position = {x:0, y:0, z:0};
	this.selectShader = selectShader;
	this.rotation = 0;
	this.parent = null;
	this.startPosition = {x:0, y:0, z:0};
	//Animation
	this.animation = new Sequencer();
	this.scene.animator.addAnimation(this.animation);

	this.animation.registerSequence("position", this, 'position');
	this.animation.registerSequence("parent", this, 'parent');
	this.animation.registerSequence("rotation", this, 'rotation');
};


Member.prototype = Object.create(CGFobject.prototype);
Member.prototype.constructor = Member;

Member.prototype.storeParent = function(parent){
	var time = this.scene.animator.animationTime;

	var fromP = this.position;
	var toPos = this.startPosition;

	if(parent == null){
		if(this.parent){
			fromP = this.parent.position;
			toPos = this.startPosition;
		}
	}

	var duration = 1;
	var offset = 0;
	if(!parent)
		offset = 1;

	this.animation.addKeyframe('position', new Keyframe(time + offset,
		 																									{pos: fromP,
																											 obj: this.parent}, transition_follow_vector3));

	this.animation.addKeyframe('position', new Keyframe(time + duration + offset,
																										{	pos: toPos,
	 																										obj: parent}, transition_rigid_follow_vector3));

	this.animation.addKeyframe('parent', new Keyframe(time + 0, {obj: this, parent: this.parent}, transition_parent));
	this.animation.addKeyframe('parent', new Keyframe(time + duration, {obj: this, parent: parent}, transition_parent));

	if(parent != null){
		this.animation.addKeyframe('rotation', new Keyframe(time + 0, this.rotation, transition_float));
		this.animation.addKeyframe('rotation', new Keyframe(time + duration, parent.members.length, transition_rigid_float));
	}
}

Member.prototype.storeFirst = function(){

	this.animation.addKeyframe('position', new Keyframe(0,
		 																									{pos: this.startPosition,
																											 obj: null}, transition_rigid_follow_vector3));

	this.animation.addKeyframe('parent', new Keyframe(0, {obj: this, parent: null}, transition_parent));

	this.animation.addKeyframe('rotation', new Keyframe(0, 0, transition_rigid_float));
}

Member.prototype.setParent = function(parent){
	if(this.parent && parent)
		if(this.parent.id == parent.id)
			return;

	if(this.parent == parent)
		return;

	if(this.parent){
		this.position = this.parent.position;
		this.parent.removeMember(this);
	}
	this.parent = parent;

	if(parent != null){
		this.parent.addMember(this);
	}
}

Member.prototype.spawnPosition = function(pos){
	this.position = pos;
	this.startPosition = pos;
	this.storeFirst();
}

Member.prototype.OnClick = function(){
	if(this.board.isPlaying())
		this.board.selectMember(this);
}

Member.prototype.setPickID = function(idC){
	this.pickID = idC;
}

Member.prototype.display = function(){
	if(this.pickID > 0 && !this.parent){
		this.scene.registerForPick(this.pickID,this);
	}

	if(this.selected && !this.scene.pickMode && !this.parent){
		this.scene.setActiveShader(this.selectShader);
		this.selectShader.setUniformsValues({pieceN : 1, number: 1});
	}

  this.scene.pushMatrix();
		if(!this.parent)
			this.scene.translate(this.position.x, this.position.y, this.position.z);

		this.scene.rotate(Math.PI*this.rotation/3, 0, 1, 0);

		var props = this.board.pieces[this.team].texture;
		if(props){
			props = {textData : props};
		}

		this.board.pieces[this.model].display2(this.board.pieces[this.team].material, props);
		//console.log(this.board.pieces[this.team]);

	this.scene.popMatrix();

	if(this.selected && !this.parent)
		this.scene.setActiveShader(this.scene.defaultShader);

	this.scene.clearPickRegistration();
}
