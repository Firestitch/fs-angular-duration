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
               round: "@?fsRound",
               abr: "@?fsAbr",
               suffix: "@?fsSuffix",
               unit: "@?fsUnit",
               limitSecond: "@?limitSecond",
               limitMinute: "@?limitMinute",
               limitHour: "@?fsLimitHour",
               limitDay: "@?limitDay"
            },

            controller: function($scope) {

                $scope.$watch('time',function(time) {
               
                  $scope.abr = $scope.abr === 'true';
                  $scope.round = $scope.round === 'true';

                  var options = { unit: $scope.unit,
                                  round: $scope.round,
                                  abr: $scope.abr,
                                  suffix: $scope.suffix,
                                  limits: {} };

                  if($scope.limitSecond) {
                    options.limits.second = $scope.limitSecond;
                  }

                  if($scope.limitHour) {
                    options.limits.minute = $scope.limitMinute;
                  }

                  if($scope.limitHour) {
                    options.limits.hour = $scope.limitHour;
                  }

                  if($scope.limitDay) {
                    options.limits.day = $scope.limitDay;
                  }

                  $scope.duration = fsDuration.format(time,options);
                });
            }
        };
    });
})();