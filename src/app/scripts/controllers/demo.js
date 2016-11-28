'use strict';


angular.module('app')
  .controller('DemoCtrl', function ($interval,$scope) {

    $scope.submit = function() {
    	alert('Submitted');
    }

	$scope.disabled = true;
    $scope.enable = function() {
    	$scope.disabled = false;
    	$scope.label = 'Duration';
    }

    $scope.durations = [
    	{mins:0.554, goal:'1m'},
    	{mins:25, goal:'25m'},
    	{mins:960, goal:'16h'},
    	{mins:1000, goal:'16h 40m'},
    	{mins:965.5, goal:'16h 6m'},
    	{mins:2895, goal:'2d 16m'},
    ];


});
