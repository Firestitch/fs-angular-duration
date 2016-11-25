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



});
