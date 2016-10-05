function Triangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
	CGFobject.call(this,scene);

	this.x1 = x1;
	this.x2 = x2;
	this.x3 = x3;
	this.y1 = y1;
	this.y2 = y2;
    this.y3 = y3;
    this.z1 = z1;
    this.z2 = z2;
    this.z3 = z3;

	this.initBuffers();
};

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor=Triangle;

Triangle.prototype.initBuffers = function () {
	
	this.vertices = [
            this.x1, this.y1, this.z1,
            this.x2, this.y2, this.z2,
            this.x3, this.y3, this.z3,
			];

    var vec1N1 = [this.x2 - this.x1, this.y2 - this.y1, this.z2 - this.z1];
    var vec2N1 = [this.x3 - this.x1, this.y3 - this.y1, this.z3 - this.z1];
    var norm1 = { 
        x : vec1N1[1] * vec2N1[2] - vec1N1[2] * vec2N1[1],
        y : vec1N1[2] * vec2N1[0] - vec1N1[0] * vec2N1[2],
        z : vec1N1[0] * vec2N1[1] - vec1N1[1] * vec2N1[0] 
        }

    var vec1N2 = [this.x1 - this.x2, this.y1 - this.y2, this.z1 - this.z2];
    var vec2N2 = [this.x3 - this.x2, this.y3 - this.y2, this.z3 - this.z2];
    var norm2 = { 
        x : vec1N2[1] * vec2N2[2] - vec1N2[2] * vec2N2[1],
        y : vec1N2[2] * vec2N2[0] - vec1N2[0] * vec2N2[2],
        z : vec1N2[0] * vec2N2[1] - vec1N2[1] * vec2N2[0] 
        }

    var vec1N3 = [this.x1 - this.x3, this.y1 - this.y3, this.z1 - this.z3];
    var vec2N3 = [this.x2 - this.x3, this.y2 - this.y3, this.z2 - this.z3];
    var norm3 = { 
        x : vec1N3[1] * vec2N3[2] - vec1N3[2] * vec2N3[1],
        y : vec1N3[2] * vec2N3[0] - vec1N3[0] * vec2N3[2],
        z : vec1N3[0] * vec2N3[1] - vec1N3[1] * vec2N3[0] 
        }

	this.normals = [
            norm1.x, norm1.y, norm1.z,
            norm2.x, norm2.y, norm2.z,
            norm3.x, norm3.y, norm3.z,
			];
			
	this.indices = [
            0, 1, 2, 
        ];

    this.texCoords = [
		0.0, 0.0,
		1.0, 0.0,
		1.0, 1.0, 
		0.0, 1.0
    ];
	/*
    this.texCoords = [
		this.minS, this.maxT,
		this.maxS, this.maxT,
		this.minS, this.minT,
		this.maxS, this.minT
    ];/**/
		
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
