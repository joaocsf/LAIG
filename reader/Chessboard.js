function Chessboard(scene,du,dv,text,su,sv,c1,c2,cs) {
 	CGFobject.call(this,scene);
    this.scene = scene;
    this.uDivs = du;
    this.vDivs = dv;
    this.texture = new CGFappearance(text);
    this.selecPos = {u : su, v : sv};
    this.cor1 = c1;
    this.cor2 = c2;
    this.selecCor = cs;
    this.plane = new Plane(scene,1.0,1.0,this.uDivs,this.vDivs);
 };

 Chessboard.prototype = Object.create(CGFobject.prototype);
 Chessboard.prototype.constructor = Chessboard;
