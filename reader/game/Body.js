/*		Class responsible to save the state of the client game
*	and to display/store all the pieces used.
*/
function Body(scene, board, team, selectShader){
	CGFobject.call(this,scene);


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

};

Body.prototype = Object.create(CGFobject.prototype);
Body.prototype.constructor = Body;

Body.prototype.select = function(value){
	this.selected = value;
}

Body.prototype.OnClick = function(){
	this.board.selectBody(this);
	this.board.selectMember('none');

}

Body.prototype.move = function(cell){
	if(this.currentCell != null)
		this.currentCell.unOcupy();

	this.boardPosition.x = cell.boardPosition.x;
	this.boardPosition.y = cell.boardPosition.y;

	var time;
	time = 0;
	this.animation.addKeyframe('position', new Keyframe(0 + 5, cell.position, transition_vector3));
	//pausa 8 segundos
	this.animation.addKeyframe('position', new Keyframe(0 + 10, cell.position, transition_curved_vector3));

	this.animation.addKeyframe('position', new Keyframe(0 + 15, {x:0,y:2,z:0}, transition_vector3));

	this.currentCell = cell;
	this.currentCell.occupy(this.team);

	console.log("Board Position:");
	console.log(this.boardPosition);

	console.log("Position:");
	console.log(this.board);

}


Body.prototype.setPickID = function(id){
	this.pickID = id;
}

Body.prototype.spawnPosition = function(pos){
	this.animation.addKeyframe('position', new Keyframe(0, pos, transition_curved_vector3));
	this.position = pos;

}

Body.prototype.setPosition = function(pos){
	this.position = pos;
}

Body.prototype.display = function(){

	if(this.pickID > 0){
		this.scene.registerForPick(this.pickID,this);
	}

	if(this.selected)
		this.scene.setActiveShader(this.selectShader);

  this.scene.pushMatrix();
		this.scene.translate(this.position.x, this.position.y, this.position.z);

		this.board.pieces['body'].display2(this.board.pieces[this.team].material, this.board.pieces[this.team].texture);

  this.scene.popMatrix();

	if(this.selected)
		this.scene.setActiveShader(this.scene.defaultShader);

	this.scene.clearPickRegistration();

}

Body.prototype.getBodyString = function (index) {//[ID,Cor,Garras,Pernas]

	var res = [];
	res.push(index);
	res.push(this.team);
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
