function Chessboard(scene,du,dv,text,su,sv,c1,c2,cs) {
 	CGFobject.call(this,scene);
    this.scene = scene;
    this.uDivs = du;
    this.vDivs = dv;
    if(text == null)
      console.error("Texture don't exist");

    this.text = text.textData;
    this.selecPos = {u : su, v : sv};
    this.cor1 = c1;
    this.cor2 = c2;
    this.selecCor = cs;
    this.plane = new Plane(scene,1.0,1.0,this.uDivs * 5,this.vDivs * 5);

    
    this.shader = new CGFshader(this.scene.gl, "shaders/chessboard.vert", "shaders/chessboard.frag");

    this.shader.setUniformsValues({selected: [this.selecPos.u, this.selecPos.v]});
    this.shader.setUniformsValues({size: [du, dv]});

    this.shader.setUniformsValues({color1: [c1.r, c1.g, c1.b, c1.a]});
    this.shader.setUniformsValues({color2: [c2.r, c2.g, c2.b, c2.a]});
    this.shader.setUniformsValues({colorSel: [cs.r, cs.g, cs.b, cs.a]});
    this.shader.setUniformsValues({altura: 0.05});
    this.trolhada = 0;
    this.trolhada2 = 0;
    
 };

 Chessboard.prototype = Object.create(CGFobject.prototype);
 Chessboard.prototype.constructor = Chessboard;
  
 Chessboard.prototype.selectPosition = function(x,y){
   this.selecPos = {u : x, v : y};
   this.shader.setUniformsValues({selected: [x, y]});

 }
 

 Chessboard.prototype.display = function(){
    
    this.trolhada+= 0.1;

    if(this.trolhada > 1){

      this.selectPosition( this.trolhada2 % this.uDivs , Math.floor(this.trolhada2 / this.uDivs));
      this.trolhada2++;
      if (this.trolhada2 > this.uDivs * this.vDivs - 1)
        this.trolhada2 = 0;

      this.trolhada = 0;
    }

    this.scene.setActiveShader(this.shader);
    
    this.text.bind(0);
    
    this.plane.display();
    this.scene.setActiveShader(this.scene.defaultShader);

 }
