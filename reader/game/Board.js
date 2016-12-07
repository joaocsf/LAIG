/*		Class responsible to save the state of the client game 
*	and to display/store all the pieces used.
*/
function Board(scene, cell, adaptoid, pieceNumber, leg, legNumber, claw, clawNumber) {
	CGFobject.call(this,scene);
	this.cell = cell;
	this.adaptoid = adaptoid;
	this.leg = leg;
	this.claw = claw;
	
	this.BLACK = 0;
	this.WHITE = 1;
	
	this.adaptoids = [];
	this.adaptoids[0] = [];
	this.adaptoids[1] = [];
	
	this.members = [];
	this.members[this.BLACK] = [];
	this.members[this.WHITE] = [];
	
	var max = Math.max(pieceNumber, legNumber, clawNumber);
	
	for(var i = 0; i < max; i++){
		
		if(i < pieceNumber){
			this.adaptoids[this.BLACK].push(0);
			//this.adaptoids[this.BLACK].push(new Adaptoid(this.scene, this.BLACK, this.adaptoid));
			//this.adaptoids[this.WHITE].push(new Adaptoid(this.scene, this.WHITE, this.adaptoid));
		}
		if(i < legNumber){
			this.members[this.BLACK].push(new Member(this.scene, this.BLACK,'LEG', this.leg));
			this.members[this.WHITE].push(new Member(this.scene, this.WHITE,'LEG', this.leg));
		}
		if(i < clawNumber){
			this.members[this.BLACK].push(new Member(this.scene, this.BLACK,'CLAW', this.claw));
			this.members[this.WHITE].push(new Member(this.scene, this.WHITE,'CLAW', this.claw));
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

Board.prototype.update = function(time){
	
	for(var key in this.sequences){
		this.sequences[key].update(time);
	}
}
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

Board.prototype.display = function(){
	
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
				this.cell.display();
			
			this.scene.popMatrix();
		}	
	}
	
	for(var x = 0; x < this.adaptoids[this.BLACK].length; x++){
		var k =  x/this.adaptoids[this.BLACK].length
		pos = this.getPosition(this.width,Math.PI * k, this.BLACK);
		this.scene.pushMatrix();
			
			this.scene.translate(pos.x,pos.z, pos.y);
			this.cell.display();
			
		this.scene.popMatrix();
		pos = this.getPosition(this.width,Math.PI * k, this.WHITE);
		this.scene.pushMatrix();
			
			this.scene.translate(pos.x,pos.z, pos.y);
			this.cell.display();
			
		this.scene.popMatrix();
		
	}
}