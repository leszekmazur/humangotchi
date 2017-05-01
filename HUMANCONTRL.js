appka.controller("HUMANCONTRL",function($scope,$http,$sce,$compile,$interval,$timeout,$cacheFactory,HumanFactory,HomeFactory,FriendsFactory,TimeFactory,ItemsFactory,StatisticFactory,OptionsFactory){

	$scope.human = new HumanFactory();
	$scope.time = new TimeFactory();
	$scope.options = new OptionsFactory();
	$scope.resours = new ItemsFactory();
	$scope.home = new HomeFactory();
	$scope.friends = new FriendsFactory();
	$scope.mt = 500;// TO JEST GLOWNY PRZELICZNIK CZASU - IM MNIEJSZY, TYM SZYBCIEJ
	$scope.stats = new StatisticFactory();
	
	$scope.paused = false;//czy pauza
	angular.element(document).ready(function () {
		$scope.beginMainGame(null);
	});
	$scope.init = function(){
		console.log("HUMANCONTRL init");
		
	}
	$scope.blee = function(){
		console.log("BLEEEEEEEEEEEEEEEEE");
	}
	$scope.addBodyBlurEvent = function(){
		if($scope.options.takeFocus){
			window.addEventListener('blur',function(){
				$scope.options.focuspause = true;
				$scope.pauseFocus();
			});
			window.addEventListener('focus',function(){
				$scope.options.focuspause = false;
				$scope.pauseFocus();
			});
		}
	}
	
	$scope.beginMainGame = function(idata){
		console.log("beginMainGame")
		console.log($scope.human.genWelcomeMsg());
		
		$scope.loadAgeformsList();
		
		$scope.getFoodList();
		$scope.getMoraleList();
		$scope.getActionList();
		
		
		
		
		$scope.friends.generateList(0);
		
		$scope.home.setStartTrash(0,1000);
		$scope.$on("lmFoodEvent",function (event, args) {
			console.log("recive data from lmFoodEvent ", args);
			$scope.home.calcTrash(args.val)
		});
		$scope.$on("lmAgeFormChangeEvent",function (event) {
			console.log("recive data from lmAgeFormChangeEvent ");
			$scope.human.calcAFVariables($scope.stats.getAFMean(),$scope.human.ageform == 0 ? false : true);
		});
		
		
		$scope.$watch('time.day', function(nv){
			$scope.dayCases();
		});
		$scope.$watch('time.hou', function(nv){
			if($scope.human.afList.length != 0){
				$scope.human.timeStep($scope.home.calcBonuses());
			}
			$scope.stats.inputData($scope.human.params.f,$scope.human.params.m,$scope.human.params.r,$scope.human.light?1:0,$scope.home.trash,$scope.human.sick.v)
		});
		$scope.$watch('time.min', function(nv){
			$scope.refreshActions();
		});
		$scope.addBodyBlurEvent();
		
		
		$scope.setWorldTime();
	
	}
	$scope.loadAgeformsList = function(){
		$scope.stats.inputData($scope.human.params.f,$scope.human.params.m,$scope.human.params.r,$scope.human.light?1:0,$scope.home.trash)
		$scope.stats.getMean(true);
		$http.get("ageformlist.json").success(function(data){
			$scope.human.getAFList(data.list);
			$scope.human.createHuman(null);
			$scope.stats.prepareDH();
			
			//$scope.human.testForAgeForm();
		});
	}
	$scope.dayCases = function(){
		$scope.daySocial();
		if($scope.time.day != 0){$scope.stats.getMean(true);}
		$scope.stats.inputAFData();
		//console.log("STATS: ",$scope.stats.getMean(true));
	}
	$scope.daySocial = function(){
		$scope.human.money += $scope.home.social.m;
		$scope.human.ap += $scope.home.social.a;
	}
	$scope.setWorldTime = function(){
		$scope.mTimer = $interval(function(){
			$scope.time.tick($scope.paused)
		},$scope.mt);
	}
	$scope.refreshTimer = function(){
		$scope.emptyMTimer();
		$scope.setWorldTime();
	}
	$scope.emptyMTimer = function(){
		$interval.cancel($scope.mTimer);
		$scope.mTimer = undefined;
	}
	$scope.pauseFocus = function(){
		//console.log("pauseFocus ",$scope.options.focuspause)
		if(!$scope.options.lookforfocus){
			return;
		}
		if($scope.options.focuspause){
			$scope.paused = true;
			$scope.emptyMTimer();
			//console.log("focus pause ON")
		}
		if(!$scope.options.focuspause && $scope.paused == true){
			$scope.emptyMTimer();
			//console.log("focus pause OFF")
		}
	}
	$scope.pauseClick = function(){
		//console.log("$scope.options.focuspause ",$scope.options.focuspause)
		$scope.paused = !$scope.paused;
		$scope.emptyMTimer();
		if(!$scope.paused){
			$scope.setWorldTime();
		}
	}
	$scope.flipcard = function(cid,$event){
		var card = document.getElementById(cid);
		if(card == null){
			return;
		}
		
		$event === null?console.log("empty flipcard..."):console.log("... ",$event.target.nodeName);
		if($event !== null && $event.target.nodeName === "SPAN" || $event !== null && $event.target.nodeName === "INPUT" || $event !== null && $event.target.nodeName === "BUTTON" || $event !== null && $event.target.nodeName === "LABEL"){
			return;
		}
		if(card.className.indexOf("tonoflip") != -1){
			return;
		}
		if(card.className.indexOf("lightcase") != -1 && !$scope.human.light){
			return;
		}
		if (card.className.indexOf("flipped") == -1) {
			card.className += " flipped";
			$scope.options.addFlipList(cid);
			
			if (card.className.indexOf("noresize") == -1) {
				$scope.oneCellBigById(cid)
				$scope.update();
			}
			
		} else {
			
			//$scope.allCellsNormal();
			$scope.oneCellNormalById(cid);
			card.className = card.className.replace(" flipped", "");
			$scope.options.removeFlipList(cid);
			$scope.update();
		}
		
	}
	$scope.itemEndDrag = function(cid){
		//3.poczatek drop
		console.log("itemEndDrag ",cid)
		var dchild = document.getElementById(cid);
		var dtype = cid.slice(0,1);
		var dnr = cid.slice(4);
		//console.log("dchild.parentNode.parentNode.id ",dchild.parentNode)
		var resList;
		switch(dtype){
			case "f":
				$scope.flipcard("card1",null);
				resList = $scope.resours.rfl;
				break;
			case "m":
				$scope.flipcard("card2",null);
				resList = $scope.resours.rml;
				console.log("resList ",resList)
				break;
		}
		$scope.human.addResource(dtype,dnr,resList)
	}
	$scope.testForItemCost = function(tp,ic){
		//$scope.resours $scope.human
		var vl = tp == 'f'?$scope.resours.rfl[ic].c:$scope.resours.rml[ic].c;
		if(tp == 'f' && vl <= $scope.human.money){
			return true;
		}
		if(tp == 'm' && vl <= $scope.human.money){
			return true;
		}
		return false;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	$scope.allCellsNormal = function(){
		for(var q=0;q<9;q++){
			var tn = document.getElementById("con"+q);
			if (tn.className.indexOf("mcell-big") != -1) {
				tn.className = tn.className.replace(" mcell-big", "");
			}
		}
	}
	$scope.oneCellNormalById = function(tnid){
		var tb = document.getElementById(tnid).parentNode.parentNode;
		tb.className = tb.className.replace(" mcell-big", "");
	}
	$scope.oneCellBigById = function(tbid){
		var tb = document.getElementById(tbid).parentNode.parentNode;
		tb.className += " mcell-big";
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	$scope.turnLight = function(){
		$scope.human.light = !$scope.human.light;
		
		console.log("$scope.human.light ",$scope.human.light)
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	$scope.getHttp = function(lnk){
		$http.get(lnk).success(function(data){
			console.log("getHttp ",lnk);
			var rd = data.list;
			return rd;
		});
	}
	
	
	$scope.getFoodList = function(){
		$http.get("foodlist.json").success(function(data){
			$scope.resours.putAllFood(data.list);
		});
	}
	$scope.getMoraleList = function(){
		$http.get("moralslist.json").success(function(data){
			$scope.resours.putAllMorales(data.list);
		});
	}
	$scope.getActionList = function(){
		$http.get("actionlist.json").success(function(data){
			$scope.resours.putAllActions(data.list);
		});
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	$scope.humanHourActionResponse = function(hf){
		console.log("humanHourActionResponse ",hf);
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	$scope.calcHomeRestBonus = function(){
		return $scope.home.calcRB();
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	$scope.testForRestrictAF = function(indx){
		for(var a in $scope.resours.rfl[indx].r){
			if($scope.resours.rfl[indx].r[a] == $scope.human.ageform){
				return false;
			}
		}
		return true;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	$scope.openAccordion = function(toop){
		var x = document.getElementById(toop);
		if (x.className.indexOf("w3-show") == -1) {
			x.className += " w3-show";
		} else {
			x.className = x.className.replace(" w3-show", "");
		}
	}
	$scope.getImagePhoto = function(dn){
		var ph = document.getElementById(dn);
		html2canvas(ph, {
			onrendered: function(canvas) {
				canvas.toBlob(function(blob) {
					var imn = 'portrait-' + $scope.time.mem.da + '.' + $scope.time.mem.mo + '.' + $scope.time.mem.ye + '-' + $scope.human.name.toUpperCase()
					saveAs(blob, imn+".png");
				});
			}
		});
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	$scope.testAction = function(aidx){
		//$scope.resours.acl[aidx]
		var res = false;
		var aftest = $scope.testActionForAgeform(aidx);
		var aptest = $scope.testActionForActionpoints(aidx);
		var astest = $scope.testActionSickBySick(aidx);
		var ajtest = $scope.testActionForJob(aidx);
		res = aftest && aptest ? true : false;
		res = $scope.resours.acl[aidx].e.ac ? true : res;
		res = astest ? res : astest;
		res = ajtest ? res : ajtest;
		//res = $scope.resours.acl[aidx].s && $scope.human.sick.v ? true : res;
		//console.log("testAction ",$scope.resours.acl[aidx].s,$scope.human.sick.v)
		return res;
	}
	$scope.testActionSickBySick = function(aidx){
		if(aidx == null){return false;}
		if($scope.human.sick.v == true){
			return true;
		}else{
			if($scope.resours.acl[aidx].s){
				return false;
			}else{
				return true;
			}
		}
		return false;
	}
	$scope.testActionForAgeform = function(aidx){
		if(aidx == null){return false;}
		for(var a in $scope.resours.acl[aidx].x){
			if($scope.human.ageform == $scope.resours.acl[aidx].x[a]){
				return false;
			}
		}
		return true;
	}
	$scope.testActionForActionpoints = function(aidx){
		if($scope.human.ap < $scope.resours.acl[aidx].a){
			return false;
		}
		return true;
	}
	$scope.testActionForHomeFurniture = function(aidx){
		if(aidx == null || $scope.resours.acl[aidx].h == null){return true;}
		if($scope.resours.acl[aidx].h.length == 0){return true;}
		for(var a in $scope.home.furnit){
			if(a.n == $scope.resours.acl[aidx].h[0]){
				return true;
			}
		}
		return false;
	}
	$scope.testActionForJob = function(aidx){
		if(aidx == null){return false;}
		if(($scope.resours.acl[aidx].p && $scope.human.job.n != "") || !$scope.resours.acl[aidx].p){
			return true;
		}
		return false;
	}
	$scope.testActionForFriends = function(aidx){
		var res = false;
		if(aidx == null || $scope.resours.acl[aidx].f == null){return true;}
		if($scope.resours.acl[aidx].f.length == 0){
			res=true;
		}else{
			if($scope.friends.list.length == 0){
				res=false;
			}else{
				var htp = $scope.resours.acl[aidx].f.length;
				for(var acfr in $scope.resours.acl[aidx].f){
					for(var hffl in $scope.friends.list){
						if($scope.resours.acl[aidx].f[acfr] == $scope.friends.list[hffl].t){
							htp--;
							if(htp == 0){
								res=true;
								break;
							}
						}
					}
				}
			}
		}
		return res;
	}
	$scope.testForActionBlocked = function(aidx){
		if($scope.resours.acl[aidx].e.ac && $scope.resours.acl[aidx].b){
			return true;
		}
		return false;
	}
	$scope.useAction = function(ai){
		if(!$scope.testForSomeActionsAreAandB(ai)){
			return;
		}
		if($scope.resours.acl[ai].e.ac){
			console.log("this ",$scope.resours.acl[ai].n," is now active ",$scope.resours.acl[ai].e.ps)
			return;
		}
		//console.log("useAction ",ai,$scope.resours.acl[ai].w);
		$scope.resours.acl[ai].e.ac = true;
		$scope.resours.acl[ai].e.ps = $scope.resours.acl[ai].r;
		
		$scope.human.lowAp($scope.resours.acl[ai].a);
		
		
		//$scope.testForActionBlocked(ai)
	}
	$scope.refreshActions = function(){
		for(var a in $scope.resours.acl){
			if($scope.resours.acl[a].e.ac){
				$scope.resours.acl[a].e.ps--;
				if($scope.resours.acl[a].e.ps == 0){
					$scope.resours.acl[a].e.ac = false;
					$scope.fireAction(a);
					continue;
				}
			}
		}
	}
	$scope.fireAction = function(aidx){
		var acu = $scope.getValue($scope.resours.acl[aidx].w)
		var valchange = 0;
		if(typeof($scope.resours.acl[aidx].v) == 'number'){
			if($scope.resours.acl[aidx].v > 0){
				valchange = acu + $scope.resours.acl[aidx].v;
			}else if($scope.resours.acl[aidx].v < 0){
				valchange = acu - $scope.resours.acl[aidx].v;
			}
		}else if(typeof($scope.resours.acl[aidx].v) == 'string'){
			if($scope.resours.acl[aidx].v == 'mm'){
				valchange = 0;
			}
			if($scope.resours.acl[aidx].v == 'nf'){
				valchange = "nf";
			}
			if($scope.resours.acl[aidx].v == 'nj'){
				valchange = "nj";
			}
			if($scope.resours.acl[aidx].v == 'sc'){
				valchange = "sc";
			}
		}else if(typeof($scope.resours.acl[aidx].v) == 'boolean'){
			valchange = $scope.resours.acl[aidx].v;
		}
		//console.log("action reloaded and fireAction: ",valchange,acu);
		if(typeof valchange != 'number'){
			console.log("THIS IS NOT A NUMBER ",$scope.resours.acl[aidx].w,valchange)
			$scope.specialActionConsequences($scope.resours.acl[aidx].w,valchange);
			return;
		}
		$scope.setValue($scope.resours.acl[aidx].w,valchange)
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	$scope.getValue = function(vrsl){
		var t0 = $scope[vrsl[0]];
		var t1 = $scope[vrsl[0]][vrsl[1]];
		var t2 = $scope[vrsl[0]][vrsl[1]][vrsl[2]];
		var res = t2 != null ? t2 : t1;
		return res;
	}
	$scope.setValue = function(sl,cv){
		console.log("setValue ",sl,cv)
		if($scope[sl[0]][sl[1]][sl[2]] != null){
			$scope[sl[0]][sl[1]][sl[2]] = cv;
		}else{
			$scope[sl[0]][sl[1]] = cv;
		}
	}
	$scope.specialActionConsequences = function(sl,cv){
		console.log("specialActionConsequences ",sl,cv)
		if(sl[0] == 'friends' && cv == 'nf'){
			$scope.friends.putNewFriend();
		}
		if(sl[1] == 'money' && cv == 'sc'){
			var jc = $scope.human.job.n != "" ? $scope.human.money + $scope.human.job.c : $scope.human.money + 1;
			$scope.setValue(sl,jc)
		}
		if(sl[1] == 'job' && cv == 'nj'){
			$scope.human.findNewJob();
		}
		if(typeof cv == 'boolean'){
			$scope.setValue(sl,cv);
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	$scope.testForSomeActionsAreAandB = function(isthat){
		for(var a in $scope.resours.acl){
			if(a != isthat){
				if($scope.resours.acl[a].e.ac && $scope.resours.acl[a].b){
					//console.log("this actuion ",$scope.resours.acl[a], " is active and can block")
					$scope.addShakeClass('ad'+a)
					return false;
				}
			}
		}
		return true;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	$scope.addShakeClass = function(tsid){
		var x = document.getElementById(tsid);
		if (x.className.indexOf("shaking") == -1) {
			x.className += " shaking";
		} 
		var stim = $timeout(function(){
			x.className = x.className.replace(" shaking", "");
			$interval.cancel(stim);
			stim = undefined;
		},500);
	}
	$scope.flipActionCard = function(cid,evt,tf){
		$scope.flipcard(cid,null);
		$scope.resours.fli = tf;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////
	$scope.checkFullscreen = function(){
		console.log("checkFullscreen ",$scope.options.fullscreen.v)
		if(!$scope.options.fullscreen.v){
			if(document.exitFullscreen) {
				document.exitFullscreen();
			} else if(document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if(document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
			return;
		}
		var element = document.documentElement;
		 if(element.requestFullscreen) {
			element.requestFullscreen();
		} else if(element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if(element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if(element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////
});