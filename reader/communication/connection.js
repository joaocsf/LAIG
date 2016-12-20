/*Metodos default/estaticos da classe de connection para permitir a
 possibilidade de enviar handlers dinamicos no caso de inexistencia
 desses handlers sao usados os seguintes*/

Connection.defaultPort = 8081;

Connection.handleSuccess = function(info) {
    console.log("Request Successful. Response : " + info.target.response)
}

Connection.handleError = function() {
    console.log("Error waiting for response");
}

/*Classe connection que realiza pedidos ao servidor Prolog
e reencaminha as respostas*/

function Connection(port){

    this.port = port || Connection.defaultPort;
    this.getPrologRequest("handshake");
}

Connection.prototype.constructor = Connection;

Connection.prototype.getPrologRequest = function (requestString, onSuccess, onError) {

    var requestPort = this.port || 8081;
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

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
