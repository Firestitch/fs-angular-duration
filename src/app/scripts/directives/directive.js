(function () {
    'use strict';

  /**
   * @ngdoc directive
   * @name fs.directives:fs-duration
   * @restrict E
   * @param {object} fsModel The modal object. The format should be in minnutes
   * @param {string} fsLabel The input label
   * @param {expression} fsDisabled An expression to enable/disable the input
   * @param {expression} fsRequired An expression to require the input for valiation
   */

    angular.module('fs-angular-duration',['fs-angular-date','fs-angular-util'])
    .directive('fsDuration', function(fsDate, fsUtil) {
        return {
            templateUrl: 'views/directives/duration.html',
            restrict: 'E',
            scope: {
              model: '=?fsModel',
              label: '@?fsLabel',
              disabled: '=?fsDisabled',
              required: '=?fsRequired'
            },
            link: function($scope, element) {
            	angular.element(element[0].querySelector("input[type='text']")).data('scope',$scope);
            },
            controller: function($scope) {

				$scope.name = 'input_' + fsUtil.guid();
				$scope.input = '';

				$scope.$watch('model',function(model) {
					if(model) {
						$scope.input = fsDate.duration(model * 60, { seconds: 0, remainder: 'string'});
					}
				});

				$scope.change = function() {
					var value = $scope.input;
					try {

						$scope.model = parseMinutes(value);

						if($scope.model) {
							value = fsDate.duration($scope.model * 60, { second: 0, remainder: 'string' });
						}

					} catch(e) {}
					$scope.input = value;
				}

				$scope.validate = function(value) {

					try {
						parseMinutes(value);
					} catch(e) {
						return e;
					}

					return true;
				}

	            function parseMinutes(string) {

					if(!string)
					  	return 0;

					var string = new String(string);
					var chunks = string.trim().match(/(\d+)[YyMdhms]?/g);

					if(!chunks || chunks.length==0)
					  	throw 'Invalid duration format';

					var seconds = 0;
					angular.forEach(chunks, function(chunk) {
						var matches = chunk.match(/(\d+)([YMdhms]?)/);

						if(matches.length==3) {
							var unit = matches[2] ? matches[2] : 'm';
							var factor = {
								Y:60*60*24*365,
								M:60*60*24*30.5,
								d:60*60*24,
								h:60*60,
								m:60,
								s:1
							}[unit];

							seconds += matches[1]*factor;
						} else {
							throw 'Invalid duration format';
						}
					});

					return seconds/60;
	            }
            }
        };
    });
})();