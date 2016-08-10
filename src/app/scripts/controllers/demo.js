'use strict';


angular.module('app')
  .controller('DemoCtrl', function ($interval,$scope) {

    $scope.time = 3000;

	$interval(function() {
		//$scope.time += 15200;
	}, 1000);    
    
});
