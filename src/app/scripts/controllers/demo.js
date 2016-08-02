'use strict';


angular.module('app')
  .controller('DemoCtrl', function ($interval,$scope) {

    $scope.time = 1012;

	$interval(function() {
		//$scope.time += 15200;
	}, 1000);    
    
});
