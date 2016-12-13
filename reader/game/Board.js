/*		Class responsible to save the state of the client game
*	and to display/store all the pieces used.
*/
function Board(scene, pieceNumber, legNumber, clawNumber) {

	CGFobject.call(this,scene);
	this.BLACK = 0;
	this.WHITE = 1;

	this.pieces =  null;

	this.adaptoids = [];
	this.adaptoids[0] = [];
	this.adaptoids[1] = [];

	this.members = [];
	this.members[this.BLACK] = [];
	this.members[this.WHITE] = [];

	var max = Math.max(pieceNumber, legNumber, clawNumber);

	for(var i = 0; i < max; i++){

		if(i < pieceNumber){
			this.adaptoids[this.BLACK].push(new Body(this.scene, this, this.BLACK));
			this.adaptoids[this.WHITE].push(new Body(this.scene, this, this.WHITE));
		}
		if(i < legNumber){
			this.members[this.BLACK].push(new Element(this.scene, this, this.BLACK,'LEG'));
			this.members[this.WHITE].push(new Element(this.scene, this, this.WHITE,'LEG'));
		}
		if(i < clawNumber){
			this.members[this.BLACK].push(new Element(this.scene, this, this.BLACK,'CLAW'));
			this.members[this.WHITE].push(new Element(this.scene, this, this.WHITE,'CLAW'));
		}
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
};


Board.prototype = Object.create(CGFobject.prototype);
Board.prototype.constructor = Board;

Board.prototype.getPosition = function(radius,angle, team){
	var t = -1;
	if(team)
		t=1;

	var res ={
		x: radius* Math.cos(angle) * t,
		y: radius* Math.sin(angle) * t,
		z: team
	};

	return res;

}

Board.prototype.initilizePositions = function(){

	var k =  x/this.adaptoids[this.BLACK].length
	pos = this.getPosition(this.width,Math.PI * k, this.BLACK);

	for(var x = 0; x < this.adaptoids[this.BLACK].length; x++){
		var k =  x/this.adaptoids[this.BLACK].length
		pos = this.getPosition(this.width,Math.PI * k, this.BLACK);
		this.adaptoids[this.BLACK][x].setPosition(pos);
		pos = this.getPosition(this.width,Math.PI * k, this.WHITE);;
		this.adaptoids[this.WHITE][x].setPosition(pos);
	}

}

Board.prototype.display = function(){
	if(this.pieces != null){
		for(var y = 0; y < this.board.length; y++){
			var neg = 0;
			for(var x = 1; x < this.board[y].length; x++){

				if(this.board[y][x] == -1){
					neg++;
					continue;
				}

				var dist = 0;
				dist = this.board[y][0];

				if(x != 0){
					var k = dist + x * this.half * 2 - neg*this.half*2;
				}
				var j = y * this.half*2;
				this.scene.pushMatrix();

					this.scene.translate(-this.width/2 - this.half + k, 0,-this.width/2 + j);
					this.pieces['cell'].display();

				this.scene.popMatrix();
			}
		}

		for(var x = 0; x < this.adaptoids[this.BLACK].length; x++){
			this.scene.pushMatrix();
			this.adaptoids[this.BLACK][x].display();
			this.adaptoids[this.WHITE][x].display();
			this.scene.popMatrix();
		}
	}
}
