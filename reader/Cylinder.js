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

Cylinder.prototype.calculateCross = function(A,B){
	
	var cross = {
		x: A.y * B.z - A.z * B.y,
		y: A.z * B.x - A.x - B.z,
		z: A.x * B.y - A.y * B.x
	};
	return cross
}

Cylinder.prototype.calculateNormal = function(angle){

	
	var tangent ={
		x: Math.sin(angle),
		y: 0,
		z: -Math.cos(angle)
		};
	
	var vetor = {
		x: (this.top - this.base) * Math.cos(angle),
		y: this.height,
		z: (this.top - this.base) * Math.sin(angle)
		};
	var norm = Math.sqrt(vetor.x * vetor.x + vetor.y * vetor.y + vetor.z * vetor.z);
	vetor.x /= norm;
	vetor.y /= norm;
	vetor.z /= norm;
	return this.calculateCross(tangent,vetor);
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
	for(var z = 0 ; z <= this.stacks ; z ++){
		for(var i = 0 ; i < this.slices; i++){
			
			var z2 = z * z_increase;
			var radius2 = z/this.stacks * (this.top - this.base) + this.base;
			
			var x = radius2 * Math.cos(ang);
			var y = radius2 * Math.sin(ang);

			this.vertices.push(x,z2,y);

			var normal = this.calculateNormal(ang);
	
			this.normals.push(normal.x,normal.y, normal.z);	
			//this.normals.push(x, 0 , y);	
			
			var s = i/this.slices;

			var v = z/this.stacks; 
			
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
