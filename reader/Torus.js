function Torus(scene, innerRadius, outerRadius, slices, loop) {
	CGFobject.call(this,scene);
	
	this.innerRadius = innerRadius;
	this.outerRadius = outerRadius;
	this.length = this.outerRadius - this.innerRadius;
	this.slices = 3;
	if(slices > 3)
		this.slices = slices;
	
	this.loop = 3;
	if(loop > 3)
		this.loop = loop;
	
	this.initBuffers();
};

Torus.prototype = Object.create(CGFobject.prototype);
Torus.prototype.constructor=Torus;

Torus.prototype.getPoint = function(matrix, position){

	return [position[0] * matrix[0] + position[1] * matrix[4] + position[2] * matrix[8] + matrix[12],
			position[0] * matrix[1] + position[1] * matrix[5] + position[2] * matrix[9] + matrix[13],
			position[0] * matrix[2] + position[1] * matrix[6] + position[2] * matrix[10] + matrix[14]];

}

Torus.prototype.drawCircle = function( positionX, diameter, angle, slices, incrAngle, percent){
	var radius = diameter/2; 
	if(percent >= 0.5)
		percent = 1.0 - percent;
	percent *= 2;
	if(percent <= 0)
		percent = 0.01;
	else if(percent >= 1)
		percent = 0.99;

	var matrix = [	0, 1, 2, 3,
				 	4, 5, 6, 7,
				 	8, 9, 10, 11,
				 	12, 13, 14, 15];



	for(var i = 0; i < slices; i ++){
		
		var matrix = [	1, 0, 0, 0,
				 	0, 1, 0, 0,
				 	0, 0, 1, 0,
				 	0, 0, 0, 1];
		var matrix2 = [	1, 0, 0, 0,
				 	0, 1, 0, 0,
				 	0, 0, 1, 0,
				 	0, 0, 0, 1];

		var position3 = [Math.cos(incrAngle * i)* radius, Math.sin(incrAngle * i) * radius, 0];
		mat4.rotate(matrix,matrix, angle, [0,1,0]);
		mat4.translate(matrix,matrix,[positionX + radius,0,0]);
		mat4.rotate(matrix2,matrix2, angle, [0,1,0]);
		
		var finalPos = this.getPoint(matrix, position3);
		var finalNormal = this.getPoint(matrix2, position3);

		this.vertices.push(finalPos[0]);
		this.vertices.push(finalPos[1]);
		this.vertices.push(finalPos[2]);
		
		var percentH = i/slices;

		if(percentH > 0.5)
			percenH = 1.0 - percentH;
		
		percentH *= 2;

		if(percentH <= 0)
			percentH = 0.01;
		else if(percentH >=1)
			percentH = 0.99;

		this.texCoords.push(percentH);

		this.texCoords.push(percent);

		this.normals.push(finalNormal[0]);
		this.normals.push(finalNormal[1]);
		this.normals.push(finalNormal[2]);
		
	}
}

Torus.prototype.createQuad = function( index, slices){
	for(var i = 0; i < slices; i++){
		
		if(i == slices - 1){
			this.indices.push(index	 + i				);
			this.indices.push(index  + i + slices		);
			this.indices.push(index  + slices);


			this.indices.push(index  + i				);
			this.indices.push(index  + slices	);
			this.indices.push(index );
		}else{

			this.indices.push(index	 + i				);
			this.indices.push(index  + i + slices		);
			this.indices.push(index  + i + slices + 1	);

			this.indices.push(index  + i				);
			this.indices.push(index  + i + slices + 1	);
			this.indices.push(index  + i + 1			);
		
		}
	}

}

Torus.prototype.createQuad2 = function( index1, slices, index2){
	for(var i = 0; i < slices; i++){
		
		if(i == slices - 1){
			this.indices.push(index1 + i				);
			this.indices.push(index2 + i	);
			this.indices.push(index2);


			this.indices.push(index1  + i				);
			this.indices.push(index2);
			this.indices.push(index1);
		}else{

			this.indices.push(index1 + i		);
			this.indices.push(index2 + i		);
			this.indices.push(index2 + i + 1	);

			this.indices.push(index1  + i				);
			this.indices.push(index2  + i + 1	);
			this.indices.push(index1  + i + 1			);
		
		}
	}

}


Torus.prototype.initBuffers = function () {
	this.vertices = [];
	
	this.normals = [];
			
	this.indices = [];
	
    this.texCoords = [];
	
	var incrAngleV = 2* Math.PI/ this.slices;
	
	var incrAngleR = 2* Math.PI / this.loop;
	var index = 0;

	for(var i = 0; i < this.loop; i ++){
		var position = this.innerRadius;
		var diameter = this.length;
		var angle = incrAngleR * i;
		console.log("___________________angle:" + angle);
		this.drawCircle(position,diameter, angle, this.slices, incrAngleV, i/this.loop);

		if( i < this.loop - 1){
			this.createQuad(index, this.slices);
			index += this.slices;
		}else{
			
			this.createQuad2(index,this.slices,0);
			index += this.slices;
		}
		
	}
	console.log("__________________LENGTHS__________________");
	
	console.log(this.vertices.length/3);
	console.log(this.normals.length /3);
	console.log(this.indices.length /3);
	console.log(this.texCoords.length /2);
	
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
