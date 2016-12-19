function Cell(scene, board, x, z, bx, by, selectShader){

	CGFobject.call(this,scene);
	this.board = board;
	this.boardPosition = {x: bx, y:by};
  this.position = {x: x, y:0, z:z};
	this.pickID = -1;
	this.occupied = null;
	this.selected = false;
	this.selectShader = selectShader;
};

Cell.prototype = Object.create(CGFobject.prototype);
Cell.prototype.constructor = Cell;

Cell.prototype.OnClick = function(){
	this.board.selectCell(this);
}

Cell.prototype.occupy = function(object){
	this.occupied = object;
}

Cell.prototype.unOcupy = function(){
	this.occupied = null;
}

Cell.prototype.setPickID = function(id){
	this.pickID = id;
}

Cell.prototype.display = function(){

	if(this.pickID > 0){
		this.scene.registerForPick(this.pickID,this);
	}

	if(this.selected)
		this.scene.setActiveShader(this.selectShader);

  this.scene.pushMatrix();
		this.scene.translate(this.position.x, this.position.y, this.position.z);
    this.board.pieces['cell'].display();
  this.scene.popMatrix();

	if(this.selected)
		this.scene.setActiveShader(this.scene.defaultShader);

	this.scene.clearPickRegistration();
}
