appka.factory('HomeFactory', function($http) {
	var Ho = function(){
		this.trash = {v:0,m:0};
		
		//mebel => n: nazwa, c: koszt zakupu, b: bonus
		this.furnit = [];
		
		this.social = {m:500,a:5};
		
		this.restB = 0;
		this.foodB = 0;
		this.moraB = 0;
		this.addsList = [];
		
		this.calcTrash = function(fd){
			var ft = fd[0] - fd[1];
			
			console.log("calctrash ",this.trash.v,ft)
			
			this.trash.v = Math.min(this.trash.v+ft,this.trash.m);
		}
	}
	Ho.prototype.addBonusItem = function(nitm){
		if(this.addsList.length < 6){
			this.addsList.push(nitm);
			return;
		}
	}
	Ho.prototype.calcBonuses = function(){
		this.restB = 0;
		for(var rb in this.addsList){
			if(this.addsList[rb].t == 'r'){
				this.restB =+ this.addsList[rb].m;
			}
			if(this.addsList[rb].t == 'f'){
				this.foodB =+ this.addsList[rb].m;
			}
			if(this.addsList[rb].t == 'm'){
				this.moraB =+ this.addsList[rb].m;
			}
		}
		return [this.restB,this.foodB,this.moraB,this.trash];
	}
	Ho.prototype.addTrash = function(nt){
		this.trash.v = Math.min(this.trash.v+nt,this.trash.m);
	}
	Ho.prototype.setStartTrash = function(stvv,stmv){
		this.trash.v = stvv;
		this.trash.m = stmv;
	}
	return Ho;
});