function Component(scene) {
 	CGFobject.call(this,scene);
    this.scene = scene;
    this.id = "";
    //Matriz de Transformações
    this.matrix = [ 1.0, 0.0, 0.0, 0.0,
                    0.0, 1.0, 0.0, 0.0,
                    0.0, 0.0, 1.0, 0.0,
                    0.0, 0.0, 0.0, 1.0]; 
    this.componentsID = [];  //Lista de Componentes (string)
    this.primitivesID = [];  //Lista de Primitivas (string)

    this.components = [];  //Lista de Componentes
    this.primitives = []; //Lista de Componentes
    
    this.material = null;
    this.texture = "none";
    this.materials = [];
    this.indexMaterial = 0;
    this.materialChanged = false;
 };

 Component.prototype = Object.create(CGFobject.prototype);
 Component.prototype.constructor = Component;

 Component.prototype.display2 = function(material, texture){
     this.scene.pushMatrix();
        this.scene.multMatrix(this.matrix);

        var mat = this.material;

        if(this.material == "inherit")
            mat = material;
        
        var tex = this.texture;//this.texture;
        switch(tex){
            case "none":
               tex = null;
            break;
            case "inherit":
               tex = texture; 
            break;
        }
        
        for(var i = 0; i < this.components.length; i++){
            if(tex != null)
                mat.setTexture(tex.textData);
            else
                mat.setTexture(tex);
            mat.apply();
            if(this.components[i] != null)
            this.components[i].display2(mat,tex);
        }

        if(tex != null)
            mat.setTexture(tex.textData);
        else
            mat.setTexture(tex);
        mat.apply();
        
        for(var i = 0; i < this.primitives.length; i++){
            if(tex != null)
                if(this.primitives[i].updateUV != null)
                    this.primitives[i].updateUV(tex.length_s, tex.length_t);
            
            this.primitives[i].display();
        }
        
     this.scene.popMatrix();
 }

 Component.prototype.changeMaterial = function() {
    
     if(this.indexMaterial < this.materials.length - 1)
        this.indexMaterial++;
     else
        this.indexMaterial = 0;
    
    this.material = this.materials[this.indexMaterial];
    //console.log("Changing material on:" + this.id + " (" + this.indexMaterial+ "/"+ this.materials.length + ")");
 }

 Component.prototype.display = function(){
    
    this.display2(null,null);
  
 }
