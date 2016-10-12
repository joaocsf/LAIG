 function Cylinder(scene, base, top, height, slices, stacks) {
 	
 	CGFobject.call(this,scene);
	
	this.base = base;
	this.top = top;
	this.height = height;
	this.slices = slices;
	this.stacks = stacks;
	var angulo = 360 / this.slices;
	this.aRad = (angulo * Math.PI) / 180;
	
 	this.initBuffers();
 };

 Cylinder.prototype = Object.create(CGFobject.prototype);
 Cylinder.prototype.constructor = Cylinder;


 Cylinder.prototype.createCircle = function(radius,z,isTop){
   
    var ang = 0;
    
 	var indiceTemp = this.vertices.length/3;

	for(var i = 0 ; i < this.slices; i++){

        var x = radius * Math.cos(ang);
        var y = radius * Math.sin(ang); 
		var xx = Math.cos(ang);
		var yy = Math.sin(ang);

        this.vertices.push(x,z,y);
        
        if(isTop == 0){
            this.normals.push(0,-1,0);
        } else {
            this.normals.push(0,1,0);
        }

        if(i < this.slices - 2 )
        {
          	  if(isTop == 0){
                this.indices.push(indiceTemp, indiceTemp + i + 1, indiceTemp + i + 2);
            } else {
                this.indices.push(indiceTemp, indiceTemp + i + 2, indiceTemp + i + 1);
            }
        }
        var s = (xx+1) /2.0; 

        var v = ((yy*-1)+1) /2.0; 

        this.texCoords.push( s, v); 

        ang += this.aRad;
    }
 }

 Cylinder.prototype.initBuffers = function() {


 	this.vertices = [];
 	this.indices = [];
 	this.normals = [];
 	this.texCoords = [];

    var radius_decrease = (this.top - this.base) / this.stacks;
    var radius = this.base;
    var z_increase = this.height / this.stacks;

	var ang = 0;
	for(var z = 0 ; z <= this.height ; z += z_increase){
		for(var i = 0 ; i < this.slices; i++){

			var x = radius * Math.cos(ang);
			var y = radius * Math.sin(ang);

			this.vertices.push(x,z,y);
			
			if(z = 0){
				this.normals.push(x,0,y);	
			} else {

			}
			
			
			var s = i/this.slices;

			var v = z/z_increase/this.stacks; 
			
			if( i > this.slices/2){
				s = (this.slices - i)/this.slices;
			}
			s*=2;
			if(s <= 0)
				s = 0.01;
			else if(s >= 1)
				s = 0.99;

			this.texCoords.push(s,v);

            
			ang += this.aRad;
		}

		radius += radius_decrease;
	}

	for(var i = 0 ; i < this.stacks; i++){
		var limit = (i * this.slices) + this.slices;
		for(var j = i * this.slices ; j < limit ; j++){
			if(j == (limit-1)){
				this.indices.push(j,j+this.slices,j+1);
				this.indices.push(j,j+1,(j+1)-this.slices);
				continue;
			}
			this.indices.push(j,j+this.slices + 1,j+1);
			this.indices.push(j, j + this.slices,j+1+this.slices);
		}
	}

	this.createCircle(this.base,0,0);
	this.createCircle(this.top,this.height,1);


 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
