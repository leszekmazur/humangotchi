appka.factory('StatisticFactory', function() {
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////FACTORY////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	var Stat = function(){
		this.dh = [];
		this.afsmean = {f:0,m:0,r:0,l:0,t:0,s:0};//srednia dla danego ageform
		this.mean = {f:0,m:0,r:0,l:0,t:0,s:0};//srednia dzienna
		this.afsdata = {f:[],m:[],r:[],l:[],t:[],s:[]};
		this.sdata = {f:[],m:[],r:[],l:[],t:[],s:[]};
	}
	Stat.prototype.prepareDH = function(){
		for(var q=0;q<24;q++){
			this.dh.push({i:q});
		}
		console.log("prepareDH ",this.dh.length)
	}
	Stat.prototype.inputData = function(fd,md,rd,ld,td,sd){
		//co godzine
		this.sdata.f.push(fd);
		this.sdata.m.push(md);
		this.sdata.r.push(rd);
		this.sdata.l.push(ld);
		this.sdata.t.push(td.v);
		this.sdata.s.push(sd ? 0 : 1);
	}
	Stat.prototype.inputAFData = function(){
		//console.log("inputAFData ",this.afsdata,this.mean)
		this.afsdata.f.push(this.mean.f);
		this.afsdata.m.push(this.mean.m);
		this.afsdata.r.push(this.mean.r);
		this.afsdata.l.push(this.mean.l);
		this.afsdata.t.push(this.mean.t);
		this.afsdata.s.push(this.mean.s);
	}
	Stat.prototype.getAFMean = function(){
		var afs = {a:0,b:0,c:0,l:0,t:0,s:0};
		//food
		for(var afdp in this.afsdata.f){
			afs.a += this.afsdata.f[afdp];
		}
		this.afsmean.f = afs.a / this.afsdata.f.length;
		//morale
		for(var amdp in this.afsdata.m){
			afs.b += this.afsdata.m[amdp];
		}
		this.afsmean.m = afs.b / this.afsdata.m.length;
		//rest
		for(var ardp in this.afsdata.r){
			afs.c += this.afsdata.r[ardp];
		}
		this.afsmean.r = afs.c / this.afsdata.r.length;
		//light
		for(var aldp in this.afsdata.l){
			afs.l += this.afsdata.l[aldp];
		}
		this.afsmean.l = afs.l / this.afsdata.l.length;
		//trash
		for(var atdp in this.afsdata.t){
			afs.t += this.afsdata.t[atdp];
		}
		this.afsmean.t = afs.t / this.afsdata.t.length;
		//sick
		for(var asdp in this.afsdata.s){
			afs.s += this.afsdata.s[asdp];
		}
		this.afsmean.s = afs.s / this.afsdata.s.length;
		
		this.clearAFData();
		//console.log("getAFMean START ",afs)
		//console.log(this.afsdata)
		//console.log("getAFMean END ",this.afsmean.f,this.afsmean.m,this.afsmean.r,this.afsmean.l,this.afsmean.t)
		return this.afsmean;
	}
	Stat.prototype.getMean = function(wc){
		var fs = {a:0,b:0,c:0,l:0,t:0,s:0};
		//food
		for(var fdp in this.sdata.f){
			fs.a += this.sdata.f[fdp];
		}
		this.mean.f = fs.a / this.sdata.f.length == null ? 0 : fs.a / this.sdata.f.length;
		//morale
		for(var mdp in this.sdata.m){
			fs.b += this.sdata.m[mdp];
		}
		this.mean.m = fs.b / this.sdata.m.length == null ? 0 : fs.b / this.sdata.m.length;
		//rest
		for(var rdp in this.sdata.r){
			fs.c += this.sdata.r[rdp];
		}
		this.mean.r = fs.c / this.sdata.r.length == null ? 0 : fs.c / this.sdata.r.length;
		//light
		for(var ldp in this.sdata.l){
			fs.l += this.sdata.l[ldp];
		}
		this.mean.l = fs.l / this.sdata.l.length == null ? 0 : fs.l / this.sdata.l.length;
		//trash
		for(var tdp in this.sdata.t){
			fs.t += this.sdata.t[tdp];
		}
		this.mean.t = fs.t / this.sdata.t.length == null ? 0 : fs.t / this.sdata.t.length;
		//sick
		for(var sdp in this.sdata.s){
			fs.s += this.sdata.s[sdp];
		}
		this.mean.s = fs.s / this.sdata.s.length == null ? 0 : fs.s / this.sdata.s.length;
		
		if(wc){this.clearData();}
		//console.log("getMean START ",fs)
		//console.log("getMean END ",this.mean.f,this.mean.m,this.mean.r,this.mean.l,this.mean.t)
		return this.mean;
	}
	Stat.prototype.clearData = function(){
		this.sdata.f = [];
		this.sdata.m = [];
		this.sdata.r = [];
		this.sdata.l = [];
		this.sdata.t = [];
		this.sdata.s = [];
	}
	Stat.prototype.clearAFData = function(){
		this.afsdata.f = [];
		this.afsdata.m = [];
		this.afsdata.r = [];
		this.afsdata.l = [];
		this.afsdata.t = [];
		this.afsdata.s = [];
	}
	return Stat;
});
