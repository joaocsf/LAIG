/*		Class responsible to save the state of the client game
*	and to display/store all the pieces used.
*/
function Body(scene, board, team){

	CGFobject.call(this,scene);
	this.boardPosition = {x:-1, y:-1};
	this.playing = false;
	this.board = board;
  	this.team = team;
	this.position = {x:0, y:0, z:0};
	this.pickID = -1;

};

Body.prototype = Object.create(CGFobject.prototype);
Body.prototype.constructor = Body;

Body.prototype.OnClick = function(){
	this.pickID = -1;

}

Body.prototype.setPickID = function(id){
	this.pickID = id;
}

Body.prototype.setPosition = function(pos){
	this.position = pos;
}

Body.prototype.display = function(){

	if(this.pickID > 0){
		this.scene.registerForPick(this.pickID,this);
	}

  this.scene.pushMatrix();
		this.scene.translate(this.position.x, this.position.y, this.position.z);
    this.board.pieces['body'].display2(this.board.pieces[this.team].material, this.board.pieces[this.team].texture);
  this.scene.popMatrix();

	this.scene.clearPickRegistration();

}
