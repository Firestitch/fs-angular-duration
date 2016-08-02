'use strict';


angular.module('app')
  .controller('DemoCtrl', function ($interval,$scope) {

    $scope.time = 30;

	$interval(function() {
		//$scope.time += 15200;
	}, 1000);    
    
});
