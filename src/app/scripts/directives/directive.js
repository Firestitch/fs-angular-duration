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
						$scope.input = fsDate.duration(model * 60, { limits: { hour: 99999 }});
					}
				});

				$scope.change = function() {
					var value = $scope.input;
					try {

						$scope.model = parseMinutes(value);

						if($scope.model) {
							value = fsDate.duration($scope.model * 60, { limits: { hour: 99999 }});
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
					var matches = string.trim().match(/(\d+(?:\.\d*)?)([mh])/g);

					if(!matches || matches.join('')!==string.replace(/\s/,''))
					  	throw 'Invalid duration format';

					var minutes = 0;
					angular.forEach(matches,function(item) {
					 	var time = item.match(/(\d+(?:\.\d*)?)([mh])/);

					 	if(time) {
					    	if(time[2]==='h') {
					        	minutes += parseFloat(time[1]) * 60;
					      	} else if(time[2]==='m') {
					        	minutes += parseFloat(time[1]);
					      	}
					  	}
					});

					return minutes;
	            }
            }
        };
    });
})();