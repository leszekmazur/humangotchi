appka.factory('HumanFactory', ['$rootScope',function($rootScope,scope,FriendsFactory) {
	var Hu = function(){
		this.msg = "";
		this.name = "Laszlo";
		this.iswoman = false;
		this.lm = 0;//zlicza wszystkie miesiace zycia
		
		// 0-idle,1-eating,2-drinking,3-playing
		this.state = 0;
		this.params = {f:0,m:0,r:0};
		this.fall = {f:100,m:100,r:100};
		this.bonus = {f:0,m:0,r:0};
		this.light = true;
		this.rest = 0;
		
		this.sick = {v:false,o:0};
		this.ap = 0;
		
		//0-egg,1-child,2-teenage,3-adult,4-old,5-dead
		this.ageform = 0;
		
		//podforma: 0 - ugly, 1 - normal, 2-beautiful
		this.subform = 1;
		
		//this.afList = [0,9,144,216,780,1212];
		//this.afList = [0,2,4,6,8,10];
		this.afList = [];
		this.afMn = 1;
		
		this.job = {n:"",c:0};
		
		this.money = 0;
	}
	Hu.prototype.getAFList = function(adata){
		for(var a=0;a<adata.length;a++){
			var afe = {n:adata[a].n,
						t:adata[a].t,
						f:{f:adata[a].f[0],m:adata[a].f[1],r:adata[a].f[2]},
						b:{f:adata[a].b[0],m:adata[a].b[1],r:adata[a].b[2]}};
			this.afList.push(afe);
		}
		console.log("this.afList ",this.afList.length)
	}
	Hu.prototype.timeStep = function(shome){
		console.log("human => timeStep ",this.lm)
		this.testForAgeForm();
		this.testForSick(shome);
		this.calcHourAct(shome);
		this.lm++;
	}
	Hu.prototype.findNewJob = function(){
		var jl = [["1st",20],["2st",40],["3st",60],["14st",80],["5st",100],["6st",120],["7st",140],["8st",160]];
		var hj = jl[Math.floor(Math.random()*jl.length)];
		this.job.n = hj[0];
		this.job.c = hj[1];
	}
	Hu.prototype.fireFromJob = function(){
		this.job = {n:"",c:0};
	}
	Hu.prototype.testForSick = function(sh){
		var fm = 1-(this.params.f / 1000)// > 0.5? -1 : 1;
		var rm = 1-(this.params.r / 1000)// > 0.5? -1 : 1;
		var tm = (sh[3].v / sh[3].m)// > 0.5? 1 : -1;
		var tst = (((fm + rm) * 0.5) + tm) * 0.5;
		if(Math.random()<tst - this.sick.o){//Math.max(tst - this.sick.o,0)){
			this.sick.v = true;
		}else{
			if(Math.random()>(this.sick.o * 1.5)){
				this.sick.o = Math.min(this.sick.o+0.1,0.9);
			}
			
		}
		console.log('sick ',fm,rm,tm," ",this.sick.v,tst,this.sick.o)
	}
	Hu.prototype.testForAgeForm = function(){
		console.log("testForAgeForm ",this.lm,this.afList.length)
		for(var x in this.afList){
			if(this.lm == Math.round(this.afList[x].t*this.afMn)){
				console.log("new ageform! ",x,this.lm,this.afList[x].n);
				this.ageform = x;
				this.changeAgeformParams();
				console.log("dispatchEvent about testForAgeForm == true ",this.ageform,this.subform)
				$rootScope.$broadcast('lmAgeFormChangeEvent');
				break;
			}
		}
	}
	Hu.prototype.changeAgeformParams = function(){
		for(var fll in this.fall){
			
			this.fall[fll] = Math.max(Math.pow((this.afList[this.ageform].f[fll]+1),2)*5,1);
			console.log("changeAgeformParams ",fll,this.fall[fll],this.afList[this.ageform].f[fll])
		}
	}
	Hu.prototype.calcAFVariables = function(afm,sdl){
		console.log("calcAFVariables ",afm);
		var fam = afm.f < 333 ? 0 : afm.f < 666 ? 1 : 2;
		var mam = afm.m < 333 ? 0 : afm.m < 666 ? 1 : 2;
		var ram = afm.r < 333 ? 0 : afm.r < 666 ? 1 : 2;
		var lam = afm.l < 0.33 || afm.l > 0.66 ? 0 : 2;
		var tam = afm.t < 333 ? 2 : afm.t < 666 ? 1 : 0;
		var sam = afm.s < 0.33 ? 0 : afm.s < 0.66 ? 1 : 2;
		var afvm = (fam+mam+ram+lam+tam+sam) * 0.16666;
		//console.log("AFVariables ",fam,mam,ram,lam,tam,sam,"   ",afvm)
		var minv = Math.abs(this.subform - 3) * 0.4;
		var maxv = minv + 0.4;
		var nsf = 1;
		if(afvm >= minv && afvm <= maxv){
			nsf = 1;
		}else{
			if(afvm < minv){
				nsf = 0;
			}
			if(afvm > maxv){
				nsf = 2;
			}
		}
		console.log("AFVariables ",nsf,this.subform,minv,maxv)
		if(sdl){this.subform = nsf;}else{this.subform = 1;}
	}
	Hu.prototype.genWelcomeMsg = function(){
		this.msg += " Greetings & Welcome in this game.";
		return this.msg;
	}
	Hu.prototype.createHuman = function(data){
		this.iswoman = Math.random() < 0.5 ? true : false;
		if(data != null){
			this.params.f = data.p.f;
			this.params.m = data.p.m;
			return Hu;
		}
		this.params.f = Math.ceil(Math.random()*1000);
		this.params.m = Math.ceil(Math.random()*1000);
		this.params.r = Math.ceil(Math.random()*1000);
		
		this.money = 1000;
		this.ap = 50;

		this.testForAgeForm();
	}
	Hu.prototype.calcHourAct = function(shome){
		var res = [];
		for(var p in this.params){
			//var rparam = 
			//console.log("hour ",p)
			if(p != "r"){
				if(p == 'f'){
					var ovp = this.params[p];
					this.params[p] = Math.max(this.params[p]-this.fall[p],0);
					var nvp = this.params[p];
					$rootScope.$broadcast('lmFoodEvent', {com:p,val:[ovp,nvp],itf:this.fall[p]});
				}else{
					/* zliczanie MORALE */
					this.params[p] = Math.max(Math.min(1000,Math.ceil((((this.params.f / 1000) + (this.params.r / 1000)) - (shome[3].v / shome[3].m))*1000)),0);
					this.params[p] = this.sick.v ? Math.round(this.params[p]*0.5):this.params[p];
				}
				continue;
			}else{
				if(this.light){
					console.log("swiatlo =minus=> rest")
					this.params[p] = Math.max(this.params[p]-this.fall[p],0);
				}else{
					console.log("brak swiatlo =plus=> rest")
					this.params[p] = Math.min(this.params[p]+(100+shome[0]),1000);
				}
			}
			
		}
	}
	Hu.prototype.addResource = function(res,idx,list){
		//console.log("human res,idx,list ",res,idx,list)
		this.params[res] = Math.min(this.params[res]+list[idx].b,1000);
		
		this.money = Math.max(this.money - list[idx].c,0);
		//console.log("addResource ",res,this.params[res],this.params.hasOwnProperty(res));
	}
	Hu.prototype.lowAp = function(lap){
		console.log("lowAp ",this.ap,lap)
		this.ap = Math.max(this.ap-lap,0);
	}
	
	return Hu;
}]);