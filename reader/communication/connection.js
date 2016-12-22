/*Metodos default/estaticos da classe de connection para permitir a
 possibilidade de enviar handlers dinamicos no caso de inexistencia
 desses handlers sao usados os seguintes*/

Connection.defaultPort = 8081;
Connection.board;
Connection.logic;

Connection.handleSuccess = function(info) {
    console.log("Request Successful. Response : " + info.target.response);
};

Connection.handleError = function() {
    console.log("Error waiting for response");
}

/*Classe connection que realiza pedidos ao servidor Prolog
e reencaminha as respostas*/

function Connection(board,logic,port){

    this.port = port || Connection.defaultPort;
    Connection.board = board;
    Connection.logic = logic;
    this.getPrologRequest("handshake");
}

Connection.prototype.constructor = Connection;

Connection.prototype.getPrologRequest = function (requestString, onSuccess, onError) {

    var requestPort = this.port || 8081;
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, false);

    request.onload = onSuccess || Connection.handleSuccess;
    request.onerror = onError || Connection.handleError;

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    console.log("Sending request");
    request.send();
};

Connection.prototype.getPort = function () {
	return this.port;
}

Connection.prototype.setPort = function(newPort) {

	if(typeof newPort == 'undefined' || newPort == null)
		return;

	this.port = newPort;
}

Connection.handleResponse = function (data) {

		var response = new Array();
		response = JSON.parse(data.target.response);
		console.log(this);
		Connection.board.handleBotPlay(response);
};

Connection.handleAC = function (data) {
    var response = new Array();
    response = JSON.parse(data.target.response);
    if(response[0])
        Connection.board.selected.body.move(Connection.board.selected.cell);
};

Connection.handleMove = function (data) {

    var response = new Array();
    response = JSON.parse(data.target.response);
    if(response[0])
        Connection.board.selected.body.move(Connection.board.selected.cell);

};

Connection.handleCapture = function (data) {

    var response = new Array();
    response = JSON.parse(data.target.response);
    if(response[0]){//Indica que sim pode atacar
        var adaptoid = Connection.board.selected.body;
        var enemy = Connection.board.selected.cell.occupied;
        if(adaptoid.getNumClaws() == enemy.getNumClaws()){//Same claws morrem os dois
            adaptoid.move(null);
            enemy.move(null);
            Connection.board.points[Connection.board.playerTurn]++;
            Connection.board.points[1 - Connection.board.playerTurn]++;
        } else if (adaptoid.getNumClaws() > enemy.getNumClaws()){//Ganhou o adaptoid
            enemy.move(null);
            adaptoid.move(Connection.board.selected.cell);
            Connection.board.points[Connection.board.playerTurn]++;
        } else{//Ganhou o enemy
            adaptoid.move(null);
            Connection.board.points[1 - Connection.board.playerTurn]++;
        }
    }
};

Connection.handleEvolution = function (data) {

    var response = new Array();
    response = JSON.parse(data.target.response);
    console.log(this);
    if(response[0])
        Connection.board.selected.member.storeParent(Connection.board.selected.body2);

};

Connection.faminHandler = function (data) {

    var response = new Array();
    response = JSON.parse(data.target.response);
    console.log(this);
    Connection.board.famin(response);
};

Connection.gameOverHandler = function (data) {

    var response = new Array();
    response = JSON.parse(data.target.response);
    console.log(this);
    Connection.board.gameOver(response);
};
