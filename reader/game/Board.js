/*		Class responsible to save the state of the client game
*	and to display/store all the pieces used.
*/
function Board(scene, pieceNumber, legNumber, clawNumber) {

	CGFobject.call(this,scene);
	this.BLACK = 0;
	this.WHITE = 1;

	this.lastTime = this.scene.animator.lastTime;

	this.selectShader = new CGFshader(this.scene.gl, "shaders/select/selected.vert", "shaders/select/selected.frag");
	this.bell = new Bell(this.scene, this)

	this.mode = "hh";//Acrescentar mode
	this.dificuldade = "opOp";

	//Game pieces
	this.selected = {
		body: null,
		cell: null,
		body2 : null,
		member : null
	}
	//
	this.points = [];
	this.points[this.BLACK] = 0;
	this.points[this.WHITE] = 0;

	this.pieces =  null;
	this.cells = [];
	this.adaptoids = [];
	this.adaptoids[this.BLACK] = [];
	this.adaptoids[this.WHITE] = [];

	this.playerTurn = this.WHITE;

	this.members = [];
	this.members[this.BLACK] = [];
	this.members[this.WHITE] = [];

	this.pieceNumber = pieceNumber;
	this.legNumber = legNumber;
	this.clawNumber = clawNumber;

	var max = Math.max(pieceNumber, legNumber, clawNumber);
	var off = 0;
	for(var i = 0; i < max; i++){

		if(i < pieceNumber){
			this.adaptoids[this.BLACK].push(new Body(this.scene, this, i, this.BLACK, this.selectShader));
			this.adaptoids[this.WHITE].push(new Body(this.scene, this, i, this.WHITE, this.selectShader));
		}

		if(i < legNumber){
			this.members[this.BLACK].push(new Member(this.scene, this, off, this.BLACK,'LEG', this.selectShader));
			this.members[this.WHITE].push(new Member(this.scene, this, off, this.WHITE,'LEG', this.selectShader));
		}
		off++;
		if(i < clawNumber){
			this.members[this.BLACK].push(new Member(this.scene, this, off, this.BLACK,'CLAW', this.selectShader));
			this.members[this.WHITE].push(new Member(this.scene, this, off, this.WHITE,'CLAW', this.selectShader));
		}
		off++;
	}


	var width = 1;
	this.half = width/2;

	var aSpace = 3* this.half;
	var bSpace = 2* this.half;
	var cSpace = 1* this.half;
	var dSpace = 0;
	this.width = width * 7;
	this.board =[[aSpace,0,0,0,0],
				[bSpace,0,0,0,0,0],
				[cSpace,0,0,0,0,0,0],
				[dSpace,0,0,0,0,0,0,0],
				[cSpace,-1,0,0,0,0,0,0],
				[bSpace,-1,-1,0,0,0,0,0],
				[aSpace,-1,-1,-1,0,0,0,0]];

	this.time = 0;
	this.initializePositions();
	this.registerCellPicking();
	this.registerPicking();
};


Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;

Board.prototype.update = function(time){
	if(this.time == 0){
		this.time = time;
		return;
	}

	this.selectShader.setUniformsValues({time : time - this.time, number: 0, pieceN: 0});
}

Board.prototype.setPieces = function(pieces){
	this.pieces = pieces;
	this.pieces['boardLocation'].primitives.push(this);
}

Board.prototype.getPosition = function(radius,angle, team){
	var t = -1;
	if(team)
		t=1;

	var res ={
		x: radius* Math.cos(angle) * t,
		y: -0.2,
		z: radius* Math.sin(angle) * t
	};

	return res;

}

Board.prototype.resetRound = function(){
	if(this.selected.body)
		this.selected.body.selected = false;

	if(this.selected.cell)
		this.selected.cell.selected = false;

	if(this.selected.member)
		this.selected.member.selected = false;

	this.selected.body = null;
	this.selected.cell = null;
	this.selected.member = null;
}

Board.prototype.checkRound = function(){
	console.log("Checking Round");
	if(!this.selected.body || !this.selected.cell || !this.selected.member)
		return;

	this.doRound();
}

Board.prototype.doRound = function(){
	console.log("Doing this round!");
	//%Check round via prolog
	/*PROLOG MOVES/Commands
	|		Predicados de ação		|
	s -> Skip
	mover(X,Y,Oris) -> Mover a peça em (X,Y) segundo uma lista de orientações
	capturar(X,Y,Ori) -> Atacar com a peça em (X,Y) para a peça na orientação indicada
	aC(X,Y,Ori) -> Adicionar corpo a (X,Y) + Ori
	aP(X,Y) -> Adicionar perna a (X,Y)
	aG(X,Y) -> Adicionar garra a (X,Y)
	|			Comandos			|
	beginGame -> Devolve o tabuleiro inicial
	play(Jogador,Jogo,Action) -> devolve tabuleiro ou não se a ação não foi possivel
	botPlay(Jogador,Dificuldade,Jogo) -> devolve tabuleiro e acoes
	getMoves(X,Y,Pernas) -> Devolve as casas possiveis para uma peca que esteja na posicao (X,Y) e tenha o numero de Pernas
	isGameOver(A,B,Tab) -> Devolve o jogador que ganhou ou entao nao se o jogo ainda nao acabou. A e B sao as pontuações dos jogadores
	*/
	//Move pieces if is possible and register them in the animator!
	if(!this.selected.cell.occupied)
		this.selected.body.move(this.selected.cell);
	this.resetRound();
}

Board.prototype.endTurn = function(){
	this.doRound();
	this.playerTurn = 1 - this.playerTurn;
	this.registerPicking();
}


Board.prototype.selectBody = function(object){


	if(this.selected.body){

		if(this.selected.body2){
			this.selected.body2.resetSelection();
		}

		this.selected.body2 = this.selected.body;

		if(this.selected.body.id == object.id)
			object.selected = 2;
		else{
			object.selected = 1;
			this.selected.body.selected = 1;
			this.selected.body.color = 1;
		}
	}else
		object.selected = 1;


	this.selected.body = object;
	var v1 = (this.selected.body)? this.selected.body.id : "null";
	var v2 = (this.selected.body2)? this.selected.body2.id : "null";

	console.log("[ " + v1 + " , " + v2 + " ]");
}

Board.prototype.selectObject = function (obj, name, object){

	if(obj[name]){
		obj[name].selected = false;

		if(obj[name].id == object.id){
			obj[name] = null;
			return;
		}

	}
	obj[name] = object;
	obj[name].selected = true;
}

Board.prototype.selectCell = function(object){
	this.selectObject(this.selected, 'cell', object);
}

Board.prototype.selectMember = function(object){
	this.selectObject(this.selected, 'member', object);
}

Board.prototype.getBodyPosition = function(piece, dist = 0){
	var id = piece.id;
	var team = piece.team;
	console.log(piece);
	var k =  id/this.adaptoids[team].length;

	var radius = this.width - 2;
	var angle = Math.PI/1.5;
	var offset = Math.PI - angle/2;
	var pos = this.getPosition(radius, angle * k + offset, team);
	pos.x += dist * ((team)? 1 : -1);
	return pos;
}


Board.prototype.getMemberPosition = function(piece, dist = 0){
	var id = piece.id;
	var team = piece.team;
	console.log(piece);
	var k =  id/this.members[0].length;

	var radius = this.width - 2;
	var angle = Math.PI/1.5;
	var offset = Math.PI - angle/2;
	var pos = this.getPosition(radius, angle * k + offset, team);
	pos.x += dist * ((team)? 1 : -1);
	return pos;
}


Board.prototype.initializePositions = function(){

	for(var x = 0; x < this.adaptoids[this.BLACK].length; x++){
		var blck = this.adaptoids[this.BLACK][x];
		var wht = this.adaptoids[this.WHITE][x];
		blck.spawnPosition(this.getBodyPosition(blck, 0));
		wht.spawnPosition(this.getBodyPosition(wht, 0));
	}

	for(var x = 0; x < this.members[this.BLACK].length; x++){
		var blck = this.members[this.BLACK][x];
		var wht = this.members[this.WHITE][x];
		blck.spawnPosition(this.getMemberPosition(blck,1));
		wht.spawnPosition(this.getMemberPosition(wht, 1));
	}
	var id = 0;
	for(var y = 0; y < this.board.length; y++){
		var neg = 0;
		for(var x = 1; x < this.board[y].length; x++){
			if(this.board[y][x] == -1){
				neg++;
				continue;
			}
			var dist = 0;
			dist = this.board[y][0];
			var k = 0;
			if(x != 0){
				k = dist + x * this.half * 2 - neg*this.half*2;
			}
			var j = y * this.half*2;
			id++;
			this.cells.push(new Cell(this.scene, this, id,
				-this.width/2 - this.half + k, -this.width/2 + this.half + j,
			x,y, this.selectShader));
		}
	}

	this.bell.setPosition({x:0, y:0, z: this.width});
}

Board.prototype.play = function(){

	this.playerTurn
}

Board.prototype.registerCellPicking = function(){
	for(var i = 0; i < this.cells.length; i++){
		this.cells[i].setPickID(i + 1);
	}
	this.bell.pickID = this.cells.length + 1;
}

Board.prototype.clearPicking = function(){
	var team = 1 - this.playerTurn;
	var members = this.members[this.playerTurn].length;
	var max = Math.max(this.pieceNumber, members);
	for(var i = 0; i < max; i++){
		if(i < this.pieceNumber)
			this.adaptoids[team][i].setPickID(-1);

		if(i < members)
			this.members[team][i].setPickID(-1);
	}

}

Board.prototype.registerPicking = function(){
	this.scene.clearPickRegistration();
	this.clearPicking();
	var members = this.members[this.playerTurn].length;
	var max = Math.max(this.pieceNumber, members);

	var idC = this.cells.length + 2;
	for(var i = 0; i < max; i++){
		idC++;

		if(i < this.pieceNumber)
			this.adaptoids[this.playerTurn][i].setPickID(idC);

		idC++;
		if(i < members)
			this.members[this.playerTurn][i].setPickID(idC);
	}


}

Board.prototype.display = function(){
	this.scene.pushMatrix();
	this.scene.translate( 0, 0.2, 0);

	this.bell.display();

	if(this.pieces != null){
		for(var y = 0; y < this.cells.length; y++){

			this.cells[y].display();

		}
	var max = Math.max(this.pieceNumber, this.members[0].length);


	for(var x = 0; x < max; x++){
		if(x < this.adaptoids[0].length){
			this.adaptoids[this.BLACK][x].display();
			this.adaptoids[this.WHITE][x].display();
		}
		if(x < this.members[0].length){
			this.members[this.BLACK][x].display();
			this.members[this.WHITE][x].display();
		}
	}

		this.scene.popMatrix();
	}
}

Board.prototype.setUpGame = function (tabuleiro) {
	//Adicionar para cada objeto a key frame necessária
};

Board.prototype.getGameString = function () {

	var res = [];
	var ht = 'ht';
	var vazio = 'vazio';
	res.push(['zero','um','dois','tres','quatro']);
	res.push(['a',vazio,vazio,vazio,vazio,'cinco']);
	res.push(['b',vazio,vazio,vazio,vazio,vazio,'seis']);
	res.push(['c',vazio,vazio,vazio,vazio,vazio,vazio,'sete']);
	res.push(['d',vazio,vazio,vazio,vazio,vazio,vazio,vazio]);
	res.push(['e',ht,vazio,vazio,vazio,vazio,vazio,vazio]);
	res.push(['f',ht,ht,vazio,vazio,vazio,vazio,vazio]);
	res.push(['g',ht,ht,ht,vazio,vazio,vazio,vazio]);
	for(var j = 0; j < this.adaptoids.length; j++){
		for(var i = 0; i < this.adaptoids[j].length; i++){
			if(this.adaptoids[j][i].playing){
				var adaptoid = this.adaptoids[j][i];
				res[adaptoid.boardPosition.y + 1][adaptoid.boardPosition.x] = adaptoid.getBodyString(i);
			}
		}
	}
	for(var k = 0; k < res.length ; k++){
		res[k] = "[" + res[k] + "]";
	}
	return "jogo(" + this.points[this.WHITE] + "," + this.points[this.BLACK] + ",[" + res + "]" + ")";
};
