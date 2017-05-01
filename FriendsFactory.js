appka.factory('FriendsFactory', ['$rootScope',function($rootScope,scope) {
	var Fri = function(){
		this.list = [];
	}
	Fri.prototype.generateList = function(sld){
		if(sld == 0){
			return;
		}
		for(var q=0;q<sld;q++){
			var frien = this.generateFriend();
			this.list.push(frien);
		}
		//console.log("generateList ",this.list)
	}
	Fri.prototype.generateFriend = function(){
		var frien = {t:"",id:0};
		frien.t = Math.random()<0.5?'animal':'human';
		frien.id = this.getId();
		if(this.list.length > 1 && this.testSameId(frien.id)){
			frien.id = this.getId();
		}
		return frien;
	}
	Fri.prototype.testSameId = function(nid){
		for(var f in this.list){
			if(this.list[f].id == nid){
				return true;
			}
		}
		return false;
	}
	Fri.prototype.putNewFriend = function(){
		var frien = this.generateFriend();
		this.list.push(frien);
	}
	Fri.prototype.getId = function(){
		return Math.ceil((this.list.length+1)*(Math.random()*100));
	}
	return Fri;
}]);