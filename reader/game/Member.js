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

};


Member.prototype = Object.create(CGFobject.prototype);
Member.prototype.constructor = Member;

Member.prototype.spawnPosition = function(pos){
	this.position = pos;
	console.log(pos);
}

Member.prototype.OnClick = function(){
	this.board.selectMember(this);
}

Member.prototype.setPickID = function(idC){
	this.pickID = idC;
}

Member.prototype.display = function(){
	if(this.pickID > 0){
		this.scene.registerForPick(this.pickID,this);
	}

	if(this.selected && !this.scene.pickMode){
		this.scene.setActiveShader(this.selectShader);
		this.selectShader.setUniformsValues({pieceN : 1, number: 1});
	}

  this.scene.pushMatrix();
		this.scene.translate(this.position.x, this.position.y, this.position.z);
		this.scene.rotate(this.rotation, 0, 1, 0);
		this.board.pieces[this.model].display2(this.board.pieces[this.team].material, this.board.pieces[this.team].texture);
  this.scene.popMatrix();

	if(this.selected)
		this.scene.setActiveShader(this.scene.defaultShader);

	this.scene.clearPickRegistration();
}
