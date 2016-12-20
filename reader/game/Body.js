/*		Class responsible to save the state of the client game
*	and to display/store all the pieces used.
*/
function Body(scene, board, id, team, selectShader){
	CGFobject.call(this,scene);

	this.id = id;
	this.animation = new Sequencer();
	this.scene.animator.addAnimation(this.animation);

	this.animation.registerSequence("position", this, 'position');
	this.animation.registerSequence("boardPosition", this, 'boardPosition');

	this.boardPosition = {x:-1, y:-1};
	this.board = board;
	this.team = team;
	this.position = {x:0, y:0, z:0};
	this.pickID = -1;
	this.selectShader = selectShader;
	this.selected = false;
	this.currentCell = null;
	this.members = [];
	this.color = 0;

};

Body.prototype = Object.create(CGFobject.prototype);
Body.prototype.constructor = Body;

Body.prototype.select = function(value){
	this.selected = value;
}

Body.prototype.OnClick = function(){
	this.board.selectBody(this);

}

Body.prototype.move = function(cell){
	if(this.currentCell != null)
		this.currentCell.unOcupy();

	this.boardPosition.x = cell.boardPosition.x;
	this.boardPosition.y = cell.boardPosition.y;

	var time = this.scene.animator.animationTime;

	this.animation.addKeyframe('position', new Keyframe(time + 0, this.position, transition_curved_vector3));
	this.animation.addKeyframe('position', new Keyframe(time + 3, cell.position, transition_rigid_vector3));

	this.currentCell = cell;
	this.currentCell.occupy(this.team);
}

Body.prototype.addMember = function(member){
	this.members.push(member);
}

Body.prototype.removeMember = function(member){
	for(var i = 0; i < this.members.length; i++){
		if(this.members[i].id == member.id){
			this.members.splice(i,1);
			return;
		}
	}
}

Body.prototype.setPickID = function(id){
	this.pickID = id;
	//console.log("Team:" + this.team + " Value:" + id + "ID:" + this.id);
}

Body.prototype.spawnPosition = function(pos){
	this.animation.addKeyframe('position', new Keyframe(0, pos, transition_rigid_vector3));
	this.position = pos;

}

Body.prototype.resetSelection = function(){
	this.pieceN = 0;
	this.color = 0;
	this.selected = false;
}

Body.prototype.setPosition = function(pos){
	this.position = pos;
}

Body.prototype.display = function(){

	if(this.pickID > 0){
		this.scene.registerForPick(this.pickID,this);
	}

	if(this.selected && !this.scene.pickMode){
		this.scene.setActiveShader(this.selectShader);
		this.selectShader.setUniformsValues({pieceN : this.selected - 1, number: this.color});
	}
  this.scene.pushMatrix();
		this.scene.translate(this.position.x, this.position.y, this.position.z);

		this.board.pieces['body'].display2(this.board.pieces[this.team].material, this.board.pieces[this.team].texture);

		for(var i = 0; i < this.members.length; i++){

			this.members[i].display();
		}

  this.scene.popMatrix();

	if(this.selected)
		this.scene.setActiveShader(this.scene.defaultShader);

	this.scene.clearPickRegistration();

	if(this.selected)
		this.selectShader.setUniformsValues({pieceN : 0});

}

Body.prototype.getBodyString = function (index) {//[ID,Cor,Garras,Pernas]

	var res = [];
	res.push(index);
	if(this.board.WHITE == this.team){
		res.push("branco");
	} else {
		res.push("preto");
	}
	var nClaws = 0;
	var nLegs = 0;
	for(var i = 0; i < this.members.length; i++){
		if(this.members[i].type == "CLAW"){
			nClaws++;
		} else {
			nLegs++;
		}
	}
	res.push(nClaws,nLegs);
	return "[" + res + "]";

};
