function Logic(board){
    this.board = board;
}

Logic.prototype.constructor = Logic;

Logic.prototype.doMovement = function (action) {
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

			var startCell = this.board.getCellAt(xi,yi);
			var endCell = this.board.getCellAt(xf,yf);
			if(startCell.occupied)
				startCell.occupied.move(endCell);
			break;
		case this.capturar_index:
			var xi = action[1];
			var yi = action[2] - 1;
			var xf = action[3];
			var yf = action[4] - 1;

			var startCell = this.board.getCellAt(xi,yi);
			var cellDest = this.board.getCellAt(xf,yf);
			if(startCell.occupied && cellDest.occupied){
				cellDest.occupied.move(null);
				startCell.occupied.move(cellDest);
			}
			break;
	}

	return;
};

Logic.prototype.doEvolution = function (action) {
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
			var vizinho = this.board.getCellAt(xvizinho,yvizinho);
			var cellDest = this.board.getCellAt(x,y);
			var corpo = this.board.getFreeBody();
			if(vizinho.occupied && !cellDest.occupied)
				corpo.move(cellDest);
			break;
		case this.addGarra_index:
		//Adicionar Garra
			var x = action[1];
			var y = action[2] - 1;
			var claw = this.board.getFreeMember("CLAW");
			var adaptoid = this.board.getCellAt(x,y).occupied;
			if(adaptoid)
				claw.storeParent(adaptoid);
			break;
		case this.addPerna_index:
		//Adicionar Perna
			var x = action[1];
			var y = action[2] - 1;
			var leg = this.board.getFreeMember("LEG");
			var adaptoid = this.board.getCellAt(x,y).occupied;
			if(adaptoid)
				leg.storeParent(adaptoid);
			break;
	};

};

Logic.prototype.doFamine = function (action) {
	console.log("Famine Action : " + action);
	var enemy = 1 - this.board.playerTurn;
	for (var i = 0; i < action.length; i++) {
		var adaptoid = this.board.getBodyByID(action[i],enemy);
		adaptoid.move(null);//Remove o adaptoid;
	}
};

Logic.prototype.famin = function (action) {

    this.board.setPoints(action[0],action[1]);
	this.doFamine(action[2]);
};

Logic.prototype.handleBotPlay = function (response) {
	console.log("Received Bot Play Response");
	console.log(response);

    this.board.setPoints(response[0],response[1]);
	this.doMovement(response[2]);
	this.doEvolution(response[3]);
	this.doFamine(response[4]);
};

Logic.prototype.jogadaBot = function (currPlayer) {
    console.log("Logica");
	var jogo = this.board.getGameString();
	var dif = this.board.dificuldade[this.board.playerTurn];
	var board = this.board;
	var request = "botPlay(" + currPlayer + "," + dif + "," + jogo + ")";
	this.board.server.getPrologRequest(request,Connection.handleResponse);

};

Logic.prototype.playerMovement = function (board,currPlayer) {
    //TODO
    console.log("Logica");
	if(!this.board.selected.body.currentCell && !this.board.selected.cell.occupied){//Nao esta em jogo logo é para adicionar corpo e a celula nao esta ocupada
		this.board.playerAddBody(board,currPlayer);

	} else if(this.board.selected.body.currentCell && !this.board.selected.cell.occupied){//Adaptoid placed e a celula desocupada

		this.board.playerMove(board,currPlayer);

	} else if(this.board.selected.body.currentCell && this.board.selected.cell.occupied){//Ver se o body esta placed e a celula ocupada
		if(this.board.selected.cell.occupied.team != this.board.selected.body.team){//Celula ocupada e com um inimigo de body

			this.board.playerCapture(board,currPlayer);

		}
	}
};

Logic.prototype.playerAddBody = function (board,currPlayer) {
    //TODO
	var x = this.board.selected.cell.boardPosition.x;
	var y = this.board.selected.cell.boardPosition.y + 1;
	var action = "aC(" + x + "," + y + ")";
	var request = "play("+ currPlayer + "," + this.board.getGameString() + "," + action + ")";
	this.board.server.getPrologRequest(request,Connection.handleAC);

};

Logic.prototype.playerMove = function (board,currPlayer) {

	var xi = this.board.selected.body.boardPosition.x;
	var yi = this.board.selected.body.boardPosition.y + 1;
	console.log("BOAS");
	console.log(this.board.selected.body);
	var nPernas = this.board.selected.body.getNumLegs();
	console.log("NLegs" + nPernas);
	var xf = this.board.selected.cell.boardPosition.x;
	var yf = this.board.selected.cell.boardPosition.y + 1;
	var action = "mover(" + xi + "," + yi + "," + nPernas + "," + xf + "," + yf + ")";
	var request = "play("+ currPlayer + "," + this.board.getGameString() + "," + action + ")";
	this.board.server.getPrologRequest(request,Connection.handleMove);

};

Logic.prototype.playerCapture = function (board,currPlayer) {

	var xi = this.board.selected.body.boardPosition.x;
	var yi = this.board.selected.body.boardPosition.y + 1;
	var nPernas = this.board.selected.body.getNumLegs();
	var xf = this.board.selected.cell.boardPosition.x;
	var yf = this.board.selected.cell.boardPosition.y + 1;

	var action = "capturar(" + xi + "," + yi + "," + nPernas + "," + xf + "," + yf + ")";
	var request = "play("+ currPlayer + "," + this.board.getGameString() + "," + action + ")";
	this.board.server.getPrologRequest(request,Connection.handleCapture);

};

Logic.prototype.playerEvolution = function (board,currPlayer) {

    console.log("Logica");
	var action = (this.board.selected.member.type == "CLAW")? "aG" : "aP";
	var x = this.board.selected.body2.boardPosition.x;
	var y = this.board.selected.body2.boardPosition.y + 1;
	action += "(" + x + "," + y + ")";
	if(this.board.selected.body2.currentCell){//Só é possivel adicionar pernas ou garras se o corpo estiver placed
		var request = "play("+ currPlayer + "," + this.board.getGameString() + "," + action + ")";
		this.board.server.getPrologRequest(request,Connection.handleEvolution);
	}

};

Logic.prototype.playerFamine = function (board,currPlayer) {

    console.log("Logica");
	//Verificar esfomeados | SO E FEITO SE FOR A JOGADA DO PLAYER O COMPUTADOR JA FAZ ISTO
	this.board.server.getPrologRequest("esfomeados(" + this.board.getGameString() + "," + currPlayer + ")",Connection.faminHandler);

};

Logic.prototype.checkGameEnd = function (board,currPlayer) {

    console.log("Logica");
	this.board.server.getPrologRequest("isGameOver(" + this.board.getGameString() + ")",Connection.gameOverHandler);

};
