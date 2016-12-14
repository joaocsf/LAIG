/*Metodos default/estaticos da classe de response para permitir a
 possibilidade de enviar handlers dinamicos no caso de inexistencia
 desses handlers sao usados os seguintes*/

Response.getText = function(res) {
	if(typeof res == 'undefined' || res == null)
		return "";
	console.log("Message Received : " + res.target.response);
	return res.target.response;
}

/*Classe response que trata as respostas*/

function Response(string){
	console.log("New Response created : " + string);
    this.res = string;
}

Response.prototype.constructor = Response;

Response.prototype.getResponse = function () {
    return this.res;
};
