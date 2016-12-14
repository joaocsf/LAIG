function Cell(scene, board, x, z){

	CGFobject.call(this,scene);
	this.board = board;
  this.position = {x: x, y:0, z:z};
	this.pickID = -1;
};

Cell.prototype = Object.create(CGFobject.prototype);
Cell.prototype.constructor = Cell;

Cell.prototype.OnClick = function(){

}

Cell.prototype.setPickID = function(id){
	this.pickID = id;
}

Cell.prototype.display = function(){

	if(this.pickID > 0){
		this.scene.registerForPick(this.pickID,this);
	}

  this.scene.pushMatrix();
		this.scene.translate(this.position.x, this.position.y, this.position.z);
    this.board.pieces['cell'].display();
  this.scene.popMatrix();

	this.scene.clearPickRegistration();
}
