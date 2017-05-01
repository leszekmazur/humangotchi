appka.controller("INDEXCONTRL",function($scope,$http,$sce,$compile,$interval,$timeout,$cacheFactory){

	$scope.slideindex = 1;
	$scope.ob = false;
	$scope.nh = {bo:false,n:"",s:false,r:{f:0,m:0,r:0},m:0};
	angular.element(document).ready(function () {
		console.log("INDEXCONTRL begins")
	});
	$scope.init = function(){
		console.log("INDEXCONTRL init")
	}
	$scope.switchOB = function(){
		$scope.ob = !$scope.ob;
	}
	$scope.refreshBo = function(){
		if($scope.nh.n != ""){
			$scope.nh.bo = true;
			return;
		}
		$scope.nh.bo = false;
	}
	$scope.openAccordion = function(toop){
		var x = document.getElementById(toop);
		if (x.className.indexOf("w3-show") == -1) {
			x.className += " w3-show";
		} else {
			x.className = x.className.replace(" w3-show", "");
		}
	}
	$scope.openBigContainer = function(){
		$scope.bo = !$scope.bo;
		var x = document.getElementById('bigone');
		if (x.className.indexOf("w3-show") == -1) {
			x.className += " w3-show";
		} else {
			x.className = x.className.replace(" w3-show", "");
		}
	}
	$scope.plusDivsnew = function(n){
		$scope.showDivs($scope.slideindex += n);
	}
	$scope.showDivs = function(n){
		$scope.slideindex = n;
		var x = document.getElementsByClassName("myslides");
		if (n > x.length) {
			$scope.slideindex = 1;
		}
		if (n < 1) {
			$scope.slideindex = x.length;
		}
		for (var i = 0; i < x.length; i++) {
			 x[i].style.display = "none";
		}
		x[$scope.slideindex-1].style.display = "block";
		console.log("showDivs ",n,x.length,x[n-1])
	}
});