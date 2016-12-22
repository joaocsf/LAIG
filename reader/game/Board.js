/*		Class responsible to save the state of the client game
*	and to display/store all the pieces used.
*/
function Board(scene, pieceNumber, legNumber, clawNumber) {

	CGFobject.call(this,scene);
	this.BLACK = 0;
	this.WHITE = 1;

	this.scene.animator.addUndoListener(this);
	this.lastTime = this.scene.animator.lastTime;

	this.selectShader = new CGFshader(this.scene.gl, "shaders/select/selected.vert", "shaders/select/selected.frag");
	this.bell = new Bell(this.scene, this)
	this.roundTime = 10;
	this.timer = new Timer(this.scene, this.roundTime, 0, 0.5);

	//Game pieces
	this.selected = {
		body: null,
		cell: null,
		body2 : null,
		member : null
	}
	//
	this.server = new Connection();
	this.points = [];
	this.points[this.BLACK] = 0;
	this.points[this.WHITE] = 0;
	this.mode = "hh";//Acrescentar mode "hc" "cc"
	this.dificuldade = [];
	this.dificuldade[this.WHITE] = "op";//Adicionar "notOp"
	this.dificuldade[this.BLACK] = "notOp";
	this.skip_index = 0;
	this.move_index = 1;
	this.capturar_index = 2;
	this.addCorpo_index = 3;
	this.addGarra_index = 4;
	this.addPerna_index = 5;

	this.pieces =  null;
	this.cells = [];
	this.adaptoids = [];
	this.adaptoids[this.BLACK] = [];
	this.adaptoids[this.WHITE] = [];

	this.playerTurn = this.WHITE;
	this.playerTurnTime = 0;
	this.lastPlayerTurn;
	this.lastPlayerTurnTime;

	this.members = [];
	this.members[this.BLACK] = [];
	this.members[this.WHITE] = [];

	this.pieceNumber = pieceNumber;
	this.legNumber = legNumber;
	this.clawNumber = clawNumber;

	var width = 1;
	this.half = width/2;
	this.width = width * 7;
	this.time = 0;
	this.initializeObjects(pieceNumber, legNumber, clawNumber);
	this.initializePositions();
	this.initializeAnimations();
	this.registerCellPicking();
	this.registerPicking();
	this.setUp();
};


Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;

Board.prototype.initializeObjects = function(pieceNumber, legNumber, clawNumber){
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
}

Board.prototype.initializeAnimations = function(){
	this.animation = new Sequencer();
	this.scene.animator.addAnimation(this.animation);

	this.animation.registerSequence('playerTurn', this, 'playerTurn');
	this.animation.registerSequence('playerTurnTime', this, 'playerTurnTime');
}

Board.prototype.update = function(time){
	if(this.time == 0){
		this.time = time;
		return;
	}

	this.selectShader.setUniformsValues({time : time - this.time, number: 0, pieceN: 0});
	this.updateTimerValues();
}
//Do This in the first round!;
Board.prototype.storePlayerTurn = function(turn, time){
	var time = this.scene.animator.animationTime;
	if(this.lastPlayerTurnTime < time){
		this.lastPlayerTurn = turn;
		this.lastPlayerTurnTime = time;
	}
	this.animation.addKeyframe('playerTurn', new Keyframe(time, {obj: this, lstnr: 'playerTurnListener', value: turn}, transition_listener));
	this.animation.addKeyframe('playerTurnTime', new Keyframe(time, time, transition_rigid_float));
}

Board.prototype.playerTurnListener = function(turn){
	if(this.playerTurn == turn){
		return;
	}
	this.playerTurn = turn;

	this.registerPicking();
	this.resetRound();
}

Board.prototype.updateTimerValues = function(){
	var time = this.scene.animator.animationTime - this.playerTurnTime;
	var t2 = this.scene.animator.animationTime - this.lastPlayerTurnTime;
	this.timer.setTime(time);

	if(t2 > this.roundTime){
		this.endTurn();
	}
}

Board.prototype.onUndo = function(){
	this.lastPlayerTurnTime = this.playerTurnTime;
	this.lastPlayerTurn = this.lastPlayerTurn;
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

Board.prototype.doMovement = function (action) {
	console.log("Moviment Action : " + action);

	switch (action[0]) {
		case this.skip_index:
			return;
			break;
		case this.move_index:
			var xi = action[1];
			var yi = action[2] - 1;
			var xf = action[3];
			var yf = action[4] - 1;
			var startCell = this.getCellAt(xi,yi);
			var endCell = this.getCellAt(xf,yf);
			startCell.occupied.move(endCell);
			break;
		case this.capturar_index:
			var xi = action[1];
			var yi = action[2] - 1;
			var xf = action[3];
			var yf = action[4] - 1;
			//[2,Xi,Yi,Xatacar,Yatacar]
			break;
	}

	return;
};

Board.prototype.doEvolution = function (action) {
	console.log("Evolution Action : " + action);

	switch (action[0]) {
		case this.skip_index:
			return;
			break;
		case this.addCorpo_index:
		//Adicionar Corpo
			var xvizinho = action[1];
			var yvizinho = action[2] - 1;
			var x = action[3];
			var y = action[4] - 1;
			var vizinho = this.getCellAt(xvizinho,yvizinho);
			var cellDest = this.getCellAt(x,y);
			var corpo = this.getFreeBody();
			if(vizinho.occupied && !cellDest.occupied)
				corpo.move(cellDest);
			break;
		case this.addGarra_index:
		//Adicionar Garra
			var x = action[1];
			var y = action[2] - 1;
			var claw = this.getFreeMember("CLAW");
			var adaptoid = this.getCellAt(x,y).occupied;
			claw.storeParent(adaptoid);
			break;
		case this.addPerna_index:
		//Adicionar Perna
			var x = action[1];
			var y = action[2] - 1;
			var leg = this.getFreeMember("LEG");
			var adaptoid = this.getCellAt(x,y).occupied;
			leg.storeParent(adaptoid);
			break;
	};

};

Board.prototype.doFamine = function (action) {
	console.log("Famine Action : " + action);
	var enemy = 1 - this.playerTurn;
	for (var i = 0; i < action.length; i++) {
		var adaptoid = this.getBodyByID(action[i],enemy);
		adaptoid.move(null);//Remove o adaptoid;
	}
};

Board.prototype.famin = function (action) {

	this.points[this.WHITE] = action[0];
	this.points[this.BLACK] = action[1];
	this.doFamine(action[2]);
};

Board.prototype.handleBotPlay = function (response) {
	console.log("Received Bot Play Response");
	console.log(response);

	this.points[this.WHITE] = response[0];
	this.points[this.BLACK] = response[1];
	this.doMovement(response[2]);
	this.doEvolution(response[3]);
	this.doFamine(response[4]);
};

Board.prototype.jogadaBot = function (currPlayer) {

	var jogo = this.getGameString();
	var dif = this.dificuldade[this.playerTurn];
	var board = this;
	var request = "botPlay(" + currPlayer + "," + dif + "," + jogo + ")";
	this.server.getPrologRequest(request,handleResponse);

	function handleResponse(data){

		var response = new Array();
		response = JSON.parse(data.target.response);
		console.log(this);
		board.handleBotPlay(response);
	}
};

Board.prototype.resetRound = function(){
	if(this.selected.body)
		this.selected.body.resetSelection();

	if(this.selected.body2)
		this.selected.body2.resetSelection();

	if(this.selected.cell)
		this.selected.cell.selected = false;

	if(this.selected.member)
		this.selected.member.selected = false;

	this.selected.body = null;
	this.selected.body2 = null;
	this.selected.cell = null;
	this.selected.member = null;
};

Board.prototype.doRound = function(){
	console.log("Doing this round!");

	var board = this;

	var currPlayer = "preto";
	if(this.WHITE == this.playerTurn)
		currPlayer = "branco";

	if(this.mode[this.playerTurn] == "c"){//Jogada Computador

		this.jogadaBot(currPlayer);

	} else {//Jogada Humano

		if(this.selected.body && this.selected.cell){//Construir comando de movimento
			if(!this.selected.body.currentCell && !this.selected.cell.occupied){//Nao esta em jogo logo é para adicionar corpo e a celula nao esta ocupada
				var x = this.selected.cell.boardPosition.x;
				var y = this.selected.cell.boardPosition.y;
				var action = "aC(" + x + y + ")";
				var resquest = "play("+ currPlayer + "," + this.getGameString() + "," + action + ")";
				this.server.getPrologRequest(request,handleAC);

				function handleAC(data){
					var response = new Array();
					response = JSON.parse(data.target.response);
					console.log(this);
					if(response[0])
						this.selected.body.move(this.selected.cell);
				};
			} else {
			//TODO fazer o movimento e o capturar
			}

		if(this.selected.body2 && this.selected.member){//construir comando de evoluir
			var action = (this.selected.member.type == "CLAW")? "aG" : "aP";
			var x = this.selected.body2.boardPosition.x;
			var y = this.selected.body2.boardPosition.y;
			action += "(" + x + "," + y + ")";
			if(this.selected.body2.currentCell){
				var resquest = "play("+ currPlayer + "," + this.getGameString() + "," + action + ")";
				this.server.getPrologRequest(request,handleEvolution);

				function handleEvolution(data){
					var response = new Array();
					response = JSON.parse(data.target.response);
					console.log(this);
					if(response[0])
						board.selected.member.storeParent(this.selected.body2);
				}
			}
		}

		//Quando os comandos estiverem feitos isto torna-se obsoleto
		if(this.selected.cell && this.selected.body)
			if(!this.selected.cell.occupied)
				this.selected.body.move(this.selected.cell);

		if(this.selected.body2 && this.selected.member)
			this.selected.member.storeParent(this.selected.body2);

		//Verificar esfomeados | SO E FEITO SE FOR A JOGADA DO PLAYER O COMPUTADOR JA FAZ ISTO
		this.server.getPrologRequest("esfomeados(" + this.getGameString() + ")," + currPlayer + ")",faminHandler);

		function faminHandler(data){
			var response = new Array();
			response = JSON.parse(data.target.response);
			console.log(this);
			board.famin(response);
		};
	}//Fim Jogada

	//Verificar se o jogo acabou
	this.server.getPrologRequest("isGameOver(" + this.getGameString + ")",gameOverHandler);

	function gameOverHandler(data){
		var response = new Array();
		response = JSON.parse(data.target.response);
		console.log(this);
		board.gameOver(response);
	};

	this.resetRound();
}

Board.prototype.gameOver = function (status) {

	switch (status[0]) {
		case 0:
			return;
			break;
		case 1:
			//this.WHITE ganhou
			break;
		case 2:
			//this.Black ganhou
			break;
	}

	return;
};

Board.prototype.endTurn = function(){
	this.doRound();
	this.storePlayerTurn(1 - this.playerTurn, this.scene.animator.animationTime);
}

Board.prototype.getCellAt = function (x,y) {
	for (var i = 0; i < this.cells.length; i++) {
		if(this.cells[i].boardPosition.x == x && this.cells[i].boardPosition.y == y)
			return this.cells[i];
	}
};

Board.prototype.getFreeBody = function () {
	for (var i = 0; i < this.adaptoids[this.playerTurn].length; i++) {
		if(!this.adaptoids[this.playerTurn][i].currentCell)
			return this.adaptoids[this.playerTurn][i];
	}
};

Board.prototype.getFreeMember = function (type) {//"CLAW" ou "LEG"
	for (var i = 0; i < this.members[this.playerTurn].length; i++) {
		if(!this.members[this.playerTurn][i].parent)
			return this.members[this.playerTurn][i];
	}
};

Board.prototype.getBodyByID = function (id,enemy) {
	return this.adaptoids[enemy][id];
};

Board.prototype.setUp = function () {

	this.points[this.BLACK] = 0;
	this.points[this.WHITE] = 0;

	this.adaptoids[this.BLACK][0].move(this.getCellAt(6,3));
	this.adaptoids[this.WHITE][0].move(this.getCellAt(2,3));
};

Board.prototype.isPlaying = function(){
	return this.scene.animator.recording;
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

	var k =  id/this.members[0].length;

	var radius = this.width - 2;
	var angle = Math.PI/1.5;
	var offset = Math.PI - angle/2;
	var pos = this.getPosition(radius, angle * k + offset, team);
	pos.x += dist * ((team)? 1 : -1);
	return pos;
}


Board.prototype.initializePositions = function(){
	var width = 1;
	var aSpace = 3* this.half;
	var bSpace = 2* this.half;
	var cSpace = 1* this.half;
	var dSpace = 0;
	this.board =[[aSpace,0,0,0,0],[bSpace,0,0,0,0,0],[cSpace,0,0,0,0,0,0],[dSpace,0,0,0,0,0,0,0],[cSpace,-1,0,0,0,0,0,0],[bSpace,-1,-1,0,0,0,0,0],[aSpace,-1,-1,-1,0,0,0,0]];
	var max = Math.max(this.adaptoids[this.BLACK].length, this.members[this.BLACK].length);
	for(var i = 0; i < max; i ++){
		if(i < this.adaptoids[this.BLACK].length){
			var blck = this.adaptoids[this.BLACK][i];
			var wht = this.adaptoids[this.WHITE][i];
			blck.spawnPosition(this.getBodyPosition(blck, 0));
			wht.spawnPosition(this.getBodyPosition(wht, 0));
		}
		if(i < this.members[this.BLACK].length){
			var blck = this.members[this.BLACK][i];
			var wht = this.members[this.WHITE][i];
			blck.spawnPosition(this.getMemberPosition(blck,1));
			wht.spawnPosition(this.getMemberPosition(wht, 1));
		}
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

	this.bell.setPosition({x:0, y:-0.2 + 1, z: -(this.width/2 + 1)});
	this.timer.setPosition({x:0, y:-0.2, z: -(this.width/2 + 1)});
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
		if(i < this.pieceNumber){

			this.adaptoids[team][i].setPickID(-1);
		}
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
		if(i < members && !this.members[this.playerTurn][i].parent)
			this.members[this.playerTurn][i].setPickID(idC);
	}


}

Board.prototype.display = function(){
	this.scene.pushMatrix();
	this.scene.translate( 0, 0.2, 0);

	this.bell.display();
	this.timer.display();
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

			if(!this.members[this.BLACK][x].parent)
				this.members[this.BLACK][x].display();

			if(!this.members[this.WHITE][x].parent)
				this.members[this.WHITE][x].display();
		}
	}

		this.scene.popMatrix();
	}
}

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

//Debugs
Board.prototype.debugCells = function(){
	console.log(this.cells);
}

Board.prototype.debugBodys = function(){
	console.log(this.adaptoids);
}

Board.prototype.debugMembers = function(){
	console.log(this.members);
}
