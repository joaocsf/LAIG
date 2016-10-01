function Component(scene) {
 	CGFobject.call(this,scene);
    this.scene = scene;

    //Matriz de Transformações
    this.matrix = [ 1.0, 0.0, 0.0, 0.0,
                    0.0, 1.0, 0.0, 0.0,
                    0.0, 0.0, 1.0, 0.0,
                    0.0, 0.0, 0.0, 1.0]; 
    this.componentsID = [];  //Lista de Componentes (string)
    this.primitiveID = [];  //Lista de Primitivas (string)
    this.components = {};  //Lista de Componentes
    this.primitives = {}; //Lista de Componentes
    this.material = null;
    this.texture = "none";
 };

 Component.prototype = Object.create(CGFobject.prototype);
 Component.prototype.constructor = Component;

 Component.prototype.display = function(material, texture){
     this.scene.pushMatrix();
        
        this.scene.multMatrix(this.matrix);

        var mat = this.material;

        if(this.material == "inherit")
            mat = material;
         
        var tex = this.texture;
        switch(this.texture){
            case "none":
               tex = null;
            break;
            case "inherit":
               tex = texture;
            break;
        }

        for(var i = 0; i < this.components.length; i++){

            mat.setTexture(tex);
            this.components[i].display(mat,tex);
        }
        mat.setTexture(tex);

        for(var i = 0; i < this.primitives.length; i++){
            this.primitives[i].display();
        }
        
     this.scene.popMatrix();

        

 }

 Component.prototype.display = function(){
    
    this.display(null,null);
  
 }