appka.factory('ItemsFactory', ['$rootScope',function($rootScope) {
	var Res = function(){
		this.rfl = [];
		this.rml = [];
		this.acl = [];
		this.fli = null;
	}
	Res.prototype.putAllFood = function(fdata){
		for(var a=0;a<fdata.length;a++){
			//console.log("restrict food ",a,fdata[a].r)
			var itm = {n:fdata[a].n,l:fdata[a].l,b:Number(fdata[a].b),c:Number(fdata[a].c),r:fdata[a].r};
			this.rfl.push(itm);
		}
	}
	Res.prototype.putAllMorales = function(mdata){
		for(var a=0;a<mdata.length;a++){
			var itm = {n:mdata[a].n,l:mdata[a].l,b:Number(mdata[a].b),c:Number(mdata[a].c)};
			this.rml.push(itm);
		}
	}
	Res.prototype.putAllActions = function(adata){
		for(var a=0;a<adata.length;a++){
			var itm = {n:adata[a].n,//nazwa
						l:adata[a].l,//obrazek(link)
						w:adata[a].w,//zmienne modyfikowane
						v:adata[a].v,//wartosc zmiany
						r:Number(adata[a].r),//czas przeladowania
						a:Number(adata[a].a),//koszt ap
						h:adata[a].h,//wymagany atrybut Home
						s:Boolean(adata[a].s),//wymagany atrybut Human.Sick
						p:Boolean(adata[a].p),//wymagana praca
						f:Array(adata[a].f),//wymagany typ przyjaciela
						x:adata[a].x,//zastrzezone ageform
						e:{ac:false,ps:0},//czy aktywny, licznik reload
						b:adata[a].b//czy blokuje inne akcje
			};
			this.acl.push(itm);
		}
	}
	
	Res.prototype.tActForAgeform = function(){
		
	}
	return Res;
}]);