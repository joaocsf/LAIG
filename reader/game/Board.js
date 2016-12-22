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
	this.maxAnimTime = 3;
	this.timer = new Timer(this.scene, this.roundTime, 0, 0.5);

	//Game pieces
	this.selected = {
		body: null,
		cell: null,
		body2 : null,
		member : null
	}
	//
	this.logic = new Logic(this);
	this.server = new Connection(this,this.logic);
	this.points = [];
	this.points[this.BLACK] = 0;
	this.points[this.WHITE] = 0;
	this.mode = "hc";//Acrescentar mode "hc" "cc" "ch"
	this.dificuldade = [];
	this.dificuldade[this.WHITE] = "op";//"notOp"
	this.dificuldade[this.BLACK] = "op";//"notOp"
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

	this.currentPlayer = this.WHITE;
	this.playerTurn = this.WHITE;
	this.playerTurnTime = 0;
	this.lastPlayerTurn;
	this.lastPlayerTurnTime = 0;

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
	this.clearPicking();
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
	this.animation.registerSequence('currentPlayer', this, 'currentPlayer');
}

Board.prototype.update = function(time){
	if(this.time == 0){
		this.time = time;
		return;
	}

	this.setMessage();
	this.selectShader.setUniformsValues({time : time - this.time, number: 0, pieceN: 0});
	this.updateTimerValues();
}
//Do This in the first round!;
Board.prototype.storePlayerTurn = function(turn, time, curr = null){
	var time = this.scene.animator.animationTime;
	if(this.lastPlayerTurnTime < time){
		this.lastPlayerTurn = turn;
		this.lastPlayerTurnTime = time;
	}

	if(curr != null){
		this.animation.addKeyframe('currentPlayer', new Keyframe(time, curr , transition_rigid_float));
	}

	this.animation.addKeyframe('playerTurn', new Keyframe(time, {obj: this, lstnr: 'playerTurnListener', value: turn}, transition_listener));
	this.animation.addKeyframe('playerTurnTime', new Keyframe(time, time, transition_rigid_float));
}

Board.prototype.setMessage = function () {
	if(this.points[this.WHITE] >= 5){
		this.scene.changeHeaderText("White Player Wins!");
	} else if (this.points[this.BLACK] >= 5){
		this.scene.changeHeaderText("Black Player Wins!")
	} else {
		this.scene.changeHeaderText("");
	}
};

Board.prototype.playerTurnListener = function(turn){
	if(this.playerTurn == turn){
		return;
	}

	if(this.playerTurn == -1)
		this.clearPicking();

	this.playerTurn = turn;
	if(this.playerTurn != -1)
		this.registerPicking();
	this.resetRound();
}

Board.prototype.setPoints = function (white,black) {
	this.points[this.WHITE] = white;
	this.points[this.BLACK] = black;
};

Board.prototype.getPoints = function () {
	return {w : this.points[this.WHITE], b : this.points[this.BLACK]};
};

Board.prototype.updateTimerValues = function(){
	var time = this.scene.animator.animationTime - this.playerTurnTime;
	var t2 = this.scene.animator.animationTime - this.lastPlayerTurnTime;
	this.timer.setTime(time);
	//console.log("Plr Turn: ["+ this.lastPlayerTurn + "]" + this.playerTurn +" / " + this.currentPlayer + " T2:" + this.playerTurnTime);
	if(this.lastPlayerTurn != -1){
		if(t2 > this.roundTime){
				this.endTurn();
			}

	}else
		if(t2 > this.maxAnimTime){
			this.swapRound();
		}
}

Board.prototype.swapRound = function(){

	var team = 1 - this.currentPlayer;
	this.storePlayerTurn(team, this.scene.animator.animationTime, team);
}

Board.prototype.onUndo = function(){
	this.lastPlayerTurnTime = this.playerTurnTime;

	this.lastPlayerTurn = this.playerTurn;
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

		this.logic.jogadaBot(currPlayer);

	} else {//Jogada Humano

		if(this.selected.body && this.selected.cell){//Construir comando de movimento

			this.logic.playerMovement(board,currPlayer);
		}

		if(this.selected.body2 && this.selected.member){//construir comando de evoluir

			this.logic.playerEvolution(board,currPlayer);
		}


		this.logic.playerFamine(board,currPlayer);
	}//Fim Jogada

	//Verificar se o jogo acabou

	this.logic.checkGameEnd(board,currPlayer);

	this.resetRound();
	this.endTurn();
}

Board.prototype.gameOver = function (status) {

	switch (status[0]) {
		case 0:
			break;
		case 1:
		//TODO
			//Apagar picking
			//this.WHITE ganhou
			this.scene.changeHeaderText("White Player wins");
			break;
		case 2:
		//TODO
			//Apagar picking
			//this.Black ganhou
			this.scene.changeHeaderText("Black Player wins");
			break;
	}

	this.resetRound();
};

Board.prototype.endTurn = function(){
	//this.doRound();
	this.storePlayerTurn(-1, this.scene.animator.animationTime);
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

	this.setPoints(0,0);

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
	var members = this.members[this.BLACK].length;
	var max = Math.max(this.pieceNumber, members);
	for(var i = 0; i < max; i++){
		if(i < this.pieceNumber){

			this.adaptoids[this.BLACK][i].setPickID(-1);
			this.adaptoids[this.WHITE][i].setPickID(-1);
		}
		if(i < members)
			this.members[this.BLACK][i].setPickID(-1);
			this.members[this.WHITE][i].setPickID(-1);
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
			if(this.adaptoids[j][i].currentCell){
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
