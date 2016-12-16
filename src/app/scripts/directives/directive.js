(function () {
    'use strict';

  /**
   * @ngdoc directive
   * @name fs.directives:fs-duration
   * @restrict E
   * @param {object} fsModel The modal object. The format should be in minnutes
   * @param {string} fsLabel The input label
   * @param {string} fsClass The css class pass on to the md-input-container
   * @param {expression} fsDisabled An expression to enable/disable the input
   * @param {expression} fsRequired An expression to require the input for valiation
   * @param {object} fsOptions Options to pass to fsDate.duration for formatting the display value
   * @param {expression} fsChange An expression evaluated when the duration input is changed
   */

    angular.module('fs-angular-duration',['fs-angular-date','fs-angular-util'])
    .directive('fsDuration', function(fsDate, fsUtil, $timeout) {
        return {
            templateUrl: 'views/directives/duration.html',
            restrict: 'E',
            replace: true,
            scope: {
              model: '=?fsModel',
              label: '@?fsLabel',
              disabled: '=?fsDisabled',
              required: '=?fsRequired',
              options: '=?fsOptions',
              onChange: '@?fsChange',
              class: '@?fsClass'
            },
            link: function($scope, element) {
            	angular.element(element[0].querySelector("input[type='text']")).data('scope',$scope);
            },
            controller: function($scope) {

            	var options = $scope.options || {};
            	options.remainder = options.remainder===undefined ? 'string' : options.remainder;
            	options.seconds = options.seconds===undefined ? false: options.seconds;
            	options.months = options.months===undefined ? false : options.months;
            	options.years = options.years===undefined ? false : options.years;
            	options.precision = options.precision===undefined ? false : options.precision;

				$scope.name = 'input_' + fsUtil.guid();

				$scope.model = fsUtil.int($scope.model);
				if($scope.model) {
					$scope.input = fsDate.duration($scope.model * 60, options);
				}

				$scope.change = function() {
					var value = $scope.input;
					try {

						$scope.model = parse(sanitize(value));

						if($scope.model) {
							value = fsDate.duration($scope.model * 60, options);
						}

						if($scope.onChange) {
							$timeout(function() {
								$scope.$parent.$eval($scope.onChange);
							});
						}

					} catch(e) {}

					$scope.input = value;
				}

				$scope.validate = function(value) {

					try {
						parse(sanitize(value));
					} catch(e) {
						return e;
					}

					return true;
				}

				function sanitize(value) {
					if(value) {
						value = value.trim().replace(/(\d+)\s+/g,'$1').replace(/\s+/,' ');

						if(value.match(/^\d*(\.\d*)?$/))
							value += 'm';
					}

					return value;
				}

	            function parse(string) {

					if(!string)
					  	return 0;

					var seconds = 0;
					angular.forEach(string.split(' '), function(chunk) {

						var matches = chunk.match(/^(\d*\.?\d*)([YMdhms])$/);

						if(!matches) {
							throw 'Invalid duration format';
						}

						var factor = {
							Y:60*60*24*365,
							M:60*60*24*30.5,
							d:60*60*24,
							h:60*60,
							m:60,
							s:1
						}[matches[2]];

						seconds += matches[1]*factor;
					});

					return seconds/60;
	            }
            }
        };
    });
})();