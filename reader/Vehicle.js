function Vehicle(scene) {
 	CGFobject.call(this,scene);
    this.scene = scene;
    this.texVela = new CGFappearance(scene);
    this.texVela.loadTexture("../resources/images/pirate.png");
    this.texWood = new CGFappearance(scene);
    this.texWood.loadTexture("../resources/images/wood.png");
    this.defaultTexture = new CGFappearance(scene);
    this.defaultTexture.loadTexture("../resources/images/face1.png");
    this.vela = new Patch(scene,2, 3, 15, 20,
        [
			 [ -1.5, -1.5, 0.0],
			 [ -2.0, -2.0, 2.0],
			 [ -2.0,  2.0, 2.0],
			 [ -1.5,  1.5, 0.0],
			 [ 0, 0, 3.0],
			 [ 0, -2.0, 3.0],
			 [ 0,  2.0, 3.0],
			 [ 0,  0, 3.0],
			 [ 1.5, -1.5, 0.0],
			 [ 2.0, -2.0, 2.0],
			 [ 2.0,  2.0, 2.0],
			 [ 1.5,  1.5, 0.0]
		]);
    this.velaInv = new Patch(scene,2, 3, 15, 20,
        [
             [ -1.5, -1.5, 0.0],
             [ -2.0, -2.0, -2.0],
             [ -2.0,  2.0, -2.0],
             [ -1.5,  1.5, 0.0],
             [ 0, 0, -3.0],
             [ 0, -2.0, -3.0],
             [ 0,  2.0, -3.0],
             [ 0,  0, -3.0],
             [ 1.5, -1.5, 0.0],
             [ 2.0, -2.0, -2.0],
             [ 2.0,  2.0, -2.0],
             [ 1.5,  1.5, 0.0]
        ]);
    this.deck = new Patch(scene,3,2,10,5,
        [
			 [ -1.14, -0.47, 0.0],
			 [ -1.71, -0.31, 0.0],
			 [ -2.18,  0.0, 0.0],

			 [ -0.38,  -0.63, 0.0],
			 [ -0.56, -0.31, 1.27],
			 [ -0.56, 0.0, 1.63],

			 [ 1.32,  -0.69, 0.0],
			 [ 1.13,  -0.31, 1.27],
			 [ 1.32, 0.0, 1.63],

			 [ 1.70, -0.50, 0.0],
			 [ 1.99,  -0.24, 0.0],
			 [ 1.99,  0.0, 0.0]
		]);
    this.deckInv = new Patch(scene,3,2,10,5,
        [
            [ 1.70, -0.50, 0.0],
            [ 1.99,  -0.24, 0.0],
            [ 1.99,  0.0, 0.0],

            [ 1.32,  -0.69, 0.0],
            [ 1.13,  -0.31, -1.27],
            [ 1.32, 0.0, -1.63],

            [ -0.38,  -0.63, 0.0],
            [ -0.56, -0.31, -1.27],
            [ -0.56, 0.0, -1.63],

            [ -1.14, -0.47, 0.0],
            [ -1.71, -0.31, 0.0],
            [ -2.18,  0.0, 0.0]
        ]);
    this.cilindro = new Cylinder(scene,0.1,0.1,1,10,10);
    this.cesto = new Torus(scene,0.5,1,5,10);
 };

 Vehicle.prototype = Object.create(CGFobject.prototype);
 Vehicle.prototype.constructor = Vehicle;

 Vehicle.prototype.drawVela = function () {
     this.scene.pushMatrix();
        this.scene.pushMatrix();
            this.scene.scale(1,-1,1);
            this.scene.rotate(-Math.PI/2,0,1,0);
            this.vela.display();
            this.scene.rotate(Math.PI,0,1,0);
            this.velaInv.display();
        this.scene.popMatrix();
        this.scene.scale(1,1,1.1);
        this.scene.translate(0,1.5,-1.5);
        this.scene.scale(0.5,0.5,3);
        this.texWood.apply();
        this.cilindro.display();
     this.scene.popMatrix();
     this.texVela.apply();
 };

 Vehicle.prototype.drawDeck = function () {
     this.scene.pushMatrix();
        this.deck.display();
        this.deckInv.display();
     this.scene.popMatrix();
 };

Vehicle.prototype.drawTop = function () {
    this.scene.pushMatrix();
        this.scene.scale(1,0.25,-1);
        this.deck.display();
        this.deckInv.display();
    this.scene.popMatrix();
};

Vehicle.prototype.drawMastro = function (nVelas,hMastro) {
    this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.scene.translate(0,0,-0.35);
        this.scene.scale(1,1,hMastro);
        this.cilindro.display();

    this.scene.popMatrix();
    this.scene.pushMatrix();
        this.scene.translate(0,hMastro-0.65,0);
        this.scene.scale(0.2,0.2,0.2);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.cesto.display();
    this.scene.popMatrix();
    this.scene.pushMatrix();

        this.scene.scale(0.5,0.8,1);
        this.scene.translate(0,1.7,0);
        this.defaultTexture.apply();
        this.drawVela();
        this.texVela.apply();
        for(var i = 1; i < nVelas; i++){
            this.scene.scale(0.7,0.7,0.7);
            this.scene.translate(0,3.2,0);
            this.drawVela();
        }
    this.scene.popMatrix();
};

 Vehicle.prototype.display = function () {

    this.scene.pushMatrix();

        this.scene.pushMatrix();

            this.scene.scale(1.5,2.3,1.5);
            this.drawDeck();
            this.drawTop();

        this.scene.popMatrix();

        this.texWood.apply();
        this.scene.translate(1.5,0,0);
        this.drawMastro(4,6.5);
        this.scene.translate(-3,0,0);
        this.drawMastro(3,6);

    this.scene.popMatrix();
 };
