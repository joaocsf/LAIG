/*		Class responsible to save the state of the client game
*	and to display/store all the pieces used.
*/
function Element(scene, team, type, component) {
	CGFobject.call(this,scene);
  if(type != 'CLAW' && type != 'LEG'){
    console.error("ERROR! Type undifined!")
    return;
  }
  this.type = type;
  this.team = team;
  this.component = component;

};

Element.prototype = Object.create(CGFobject.prototype);
Element.prototype.constructor = Element;


Element.prototype.display = function(){
  this.scene.pushMatrix();
    this.component.display();
  this.scene.popMatrix();
}
