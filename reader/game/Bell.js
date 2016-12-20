function Bell(scene, board, selectShader){
	CGFobject.call(this,scene);
	this.board = board;
	this.pickID = -1;
	this.position = {x: 0, y: 0, z: 0};
};

Bell.prototype = Object.create(CGFobject.prototype);
Bell.prototype.constructor = Body;

Bell.prototype.OnClick = function(){
	this.board.endTurn();
}

Bell.prototype.setPickID = function(id){
	this.pickID = id;
}

Bell.prototype.setPosition = function(pos){
	this.position = pos;
}

Bell.prototype.display = function(){

	if(this.pickID > 0){
		this.scene.registerForPick(this.pickID,this);
	}

	if(this.selected)
		this.scene.setActiveShader(this.selectShader);

  this.scene.pushMatrix();
		this.scene.translate(this.position.x, this.position.y, this.position.z);
		//criar bell!
		var team = this.board.playerTurn;
		this.board.pieces['body'].display2(this.board.pieces[team].material, this.board.pieces[team].texture);

  this.scene.popMatrix();

	if(this.selected)
		this.scene.setActiveShader(this.scene.defaultShader);

	this.scene.clearPickRegistration();

}

Bell.prototype.getBodyString = function (index) {//[ID,Cor,Garras,Pernas]

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
