(function () {
    'use strict';

    angular.module('fs-angular-duration',[])
    .directive('fsDuration', function(fsDuration) {
        return {
            template: '{{duration}}',
            restrict: 'E',
            scope: {
               time: "=fsTime",
               round: "@?fsRound",
               abr: "@?fsAbr",
               suffix: "@?fsSuffix",
               unit: "@?fsUnit"
            },

            controller: function($scope) {


                $scope.$watch('time',function(time) {
               
                  $scope.unit = $scope.unit || 'second';
                  $scope.abr = $scope.abr === 'true';
                  $scope.round = $scope.round === 'true';

                  if(time && $scope.unit=='minute') {
                    time = parseInt(time) * 60;
                  }

                  var options = { round: $scope.round,
                                  abr: $scope.abr,
                                  suffix: $scope.suffix };

                  $scope.duration = fsDuration.format(time,options);
                });
            }
        };
    });
})();