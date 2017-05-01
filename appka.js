var appka = angular.module('HUMANGOTCHIAPP', ['ng','ngRoute','dcbImgFallback','masonry']);
appka.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
		.when('/', {
			templateUrl: 'welcome.html',
			controller: 'INDEXCONTRL'
		})
		.when('/index', {
			templateUrl: 'welcome.html',
			controller: 'INDEXCONTRL'
		})
		.when('/game', {
			templateUrl: 'game.html',
			controller: 'HUMANCONTRL'
		})
		.otherwise({
			redirectTo: '/game'
		});
  }]);
  
  
  