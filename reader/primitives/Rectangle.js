function Rectangle(scene, x1, x2, y1, y2) {
	CGFobject.call(this,scene);

	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;
	this.a = x2 - x1;
	this.b = y2 - y1;

	this.initBuffers();
};

Rectangle.prototype = Object.create(CGFobject.prototype);
Rectangle.prototype.constructor=Rectangle;

Rectangle.prototype.updateUV = function(length_s, length_t){
	this.texCoords = [
		0.0, 1.0,
		this.a/length_s, 1.0,
		this.a/length_s, 1 - this.b/length_t,
		0.0, 1 - this.b/length_t
    ];

	this.updateTexCoordsGLBuffers();
}

Rectangle.prototype.initBuffers = function () {
	this.vertices = [
            this.x1, this.y1, 0,
            this.x2, this.y1, 0,
            this.x2, this.y2, 0,
            this.x1, this.y2, 0,
			];

	this.normals = [
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
			];

	this.indices = [
            0, 1, 2,
			0, 2, 3,
        ];
    this.texCoords = [
		0.0, 1.0,
		this.a, 1.0,
		this.a, 1 - this.b,
		0.0, 1 - this.b
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
