function Sea(scene,uDivs,vDivs) {
 	CGFobject.call(this,scene);
    this.scene = scene;
    this.scene.sea = this;
    this.plane = new Plane(scene,uDivs,vDivs,uDivs * 5,vDivs * 5);
    this.shader = new CGFshader(this.scene.gl, "shaders/sea.vert", "shaders/sea.frag");
    this.lastTime = 0;
    this.currTime = 0;
    //Adicionar shader;
 };

 Sea.prototype = Object.create(CGFobject.prototype);
 Sea.prototype.constructor = Sea;

Sea.prototype.update = function(time){

    if(this.lastTime == 0){
        this.lastTime = time;
    }
    this.currTime = time - this.lastTime;
}

Sea.prototype.display = function(){

    this.scene.setActiveShader(this.shader);
    this.plane.display();
    this.scene.setActiveShader(this.scene.defaultShader);
}
