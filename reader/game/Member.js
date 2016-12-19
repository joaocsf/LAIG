/*		Class responsible to save the state of the client game
*	and to display/store all the pieces used.
*/
function Member(scene, board, team, type, selectShader) {
	CGFobject.call(this,scene);
  if(type != 'CLAW' && type != 'LEG'){
    console.error("ERROR! Type undifined!")
    return;
  }
	this.board = board;
  	this.type = type;
  	this.team = team;
	this.pickID = -1;

	this.selectShader = selectShader;


};


Member.prototype = Object.create(CGFobject.prototype);
Member.prototype.constructor = Member;

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

  this.scene.pushMatrix();
    this.board.pieces['body'].display();
  this.scene.popMatrix();

	this.scene.clearPickRegistration();
}
