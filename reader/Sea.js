function Sea(scene,uDivs,vDivs) {
 	CGFobject.call(this,scene);
    this.scene = scene;
    this.plane = new Plane(scene,uDivs,vDivs,uDivs * 5,vDivs * 5);
    //Adicionar shader;
 };

 Sea.prototype = Object.create(CGFobject.prototype);
 Sea.prototype.constructor = Sea;

Sea.prototype.display = function(){
    this.plane.display();
    this.scene.setActiveShader(this.scene.defaultShader);
}
