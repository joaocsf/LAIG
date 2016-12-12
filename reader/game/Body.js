/*		Class responsible to save the state of the client game
*	and to display/store all the pieces used.
*/
function Body(scene, team, component) {
	CGFobject.call(this,scene);

  this.team = team;
  this.component = component;

};

Body.prototype = Object.create(CGFobject.prototype);
Body.prototype.constructor = Body;


Body.prototype.display = function(){
  this.scene.pushMatrix();
    this.component.display();
  this.scene.popMatrix();
}
