Response.getText = function(res) {
	if(typeof res == 'undefined' || res == null)
		return "";
	return res.target.response;
}

function Response(string){
    this.res = string;
}

Response.prototype.constructor = Response;

Response.prototype.getResponse = function () {
    return this.res;
};
