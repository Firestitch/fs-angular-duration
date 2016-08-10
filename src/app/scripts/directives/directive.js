
(function () {
    'use strict';

  /**
   * @ngdoc directive
   * @name fs.directives:fs-duration
   * @restrict E
   * @param {int} fsTime {@link fs.fsDuration}
   * @param {string} fsUnit {@link fs.fsDuration}
   * @param {bool} fsRound {@link fs.fsDuration}
   * @param {bool} fsAbr {@link fs.fsDuration}
   * @param {bool} fsSuffix {@link fs.fsDuration}   
   * @param {int} limitSecond {@link fs.fsDuration}
   * @param {int} limitMinute {@link fs.fsDuration}
   * @param {int} limitHour {@link fs.fsDuration}
   * @param {int} limitDay {@link fs.fsDuration}
   */

    angular.module('fs-angular-duration',[])
    .directive('fsDuration', function(fsDuration) {
        return {
            template: '{{duration}}',
            restrict: 'E',
            scope: {
               time: "=fsTime",
               remainder: "@?fsRemainder",
               abr: "@?fsAbr",
               suffix: "@?fsSuffix",
               unit: "@?fsUnit",
               limitSecond: "@?fsLimitSecond",
               limitMinute: "@?fsLimitMinute",
               limitHour: "@?fsLimitHour",
               limitDay: "@?fsLimitDay"
            },

            controller: function($scope) {

                $scope.$watch('time',function(time) {
                
                  var options = { unit: $scope.unit,
                                  remainder: $scope.remainder,
                                  abr: $scope.abr,
                                  suffix: $scope.suffix,
                                  limits: {} };

                  if($scope.limitSecond) {
                    options.limits.second = parseInt($scope.limitSecond);
                  }

                  if($scope.limitMinute) {
                    options.limits.minute = parseInt($scope.limitMinute);
                  }

                  if($scope.limitHour) {
                    options.limits.hour = parseInt($scope.limitHour);
                  }

                  if($scope.limitDay) {
                    options.limits.day = parseInt($scope.limitDay);
                  }

                  $scope.duration = fsDuration.format(time,options);
                });
            }
        };
    });
})();