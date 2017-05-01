appka.factory('OptionsFactory', function() {
	var Opt = function(){
		this.reflip = {ison:false,rtim:1000,list:[]};
		this.takeFocus = true;
		this.focuspause = false;
		this.lookforfocus = true;
		
		this.fullscreen = {v:false,s:false};//v-wartosc; s-na starcie
	}
	Opt.prototype.addFlipList = function(rid){
		this.reflip.list.push(rid);
		//console.log("add ",this.reflip.list)
	}
	Opt.prototype.removeFlipList = function(rid){
		for(var q in this.reflip.list){
			if(rid == this.reflip.list[q]){
				this.reflip.list.splice(q,1);
			}
		}
		//console.log("remove ",this.reflip.list)
	}
	return Opt;
});