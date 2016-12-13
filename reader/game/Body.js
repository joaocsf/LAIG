/*		Class responsible to save the state of the client game
*	and to display/store all the pieces used.
*/
function Body(scene, board, team){
	CGFobject.call(this,scene);

	this.board = board;
  this.team = team;
	this.position = {x:0, y:0, z:0};
};

Body.prototype = Object.create(CGFobject.prototype);
Body.prototype.constructor = Body;

Body.prototype.setPosition = function(pos){
	this.position = pos;
}

Body.prototype.display = function(){
  this.scene.pushMatrix();
		this.scene.translate(this.position.x, this.position.y, this.position.z);
    this.board.pieces['body'].display();
  this.scene.popMatrix();
}
