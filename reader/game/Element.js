/*		Class responsible to save the state of the client game
*	and to display/store all the pieces used.
*/
function Element(scene, body, team, type) {
	CGFobject.call(this,scene);
  if(type != 'CLAW' && type != 'LEG'){
    console.error("ERROR! Type undifined!")
    return;
  }
	this.body = body;
  this.type = type;
  this.team = team;
	this.pickID = -1;

};


Element.prototype = Object.create(CGFobject.prototype);
Element.prototype.constructor = Element;

Element.prototype.OnClick = function(){
	this.pickID = -1;
}

Element.prototype.setPickID = function(idC){
	this.pickID = idC;
}

Element.prototype.display = function(){
	if(this.pickID > 0){
		this.scene.registerForPick(this.pickID,this);
	}

  this.scene.pushMatrix();
    this.board.pieces['body'].display();
  this.scene.popMatrix();

	this.scene.clearPickRegistration();
}
