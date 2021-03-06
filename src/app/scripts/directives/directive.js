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

    angular.module('fs-angular-duration',['fs-angular-date','fs-angular-util','fs-angular-element'])
    .directive('fsDuration', function(fsDate, fsUtil, $timeout) {
        return {
            templateUrl: 'views/directives/duration.html',
            restrict: 'E',
            replace: true,
            scope: {
              model: '=?fsModel',
              label: '@?fsLabel',
              disabled: '=?fsDisabled',
              required: '@?fsRequired',
              options: '=?fsOptions',
              onChange: '@?fsChange',
              class: '@?fsClass',
              seconds: '=?fsSeconds',
              minutes: '=?fsMinutes',
              hours: '=?fsHours',
              days: '=?fsDays',
              months: '=?fsMonths',
              years: '=?fsYears',
              hint: '@fsHint'
            },
            link: function($scope, element, attr, model) {

	            var input = angular.element(element[0].querySelector('input[type="text"]'));
            	$scope.ngModel = input.controller('ngModel');

            	//Used to pass the scope for fs-validate
            	input.data('validator-scope',$scope);
            },
            controller: function($scope) {
            	$scope.element = {};
            	var options = $scope.options || {};

            	if($scope.seconds!==undefined) {
            		options.seconds = $scope.seconds;
            	}

            	if($scope.minutes!==undefined) {
            		options.minutes = $scope.minutes;
            	}

            	if($scope.hours!==undefined) {
            		options.hours = $scope.hours;
            	}

            	if($scope.days!==undefined) {
            		options.days = $scope.days;
            	}

            	if($scope.months!==undefined) {
            		options.months = $scope.months;
            	}

            	if($scope.years!==undefined) {
            		options.years = $scope.years;
            	}

            	options.remainder = options.remainder===undefined ? 'string' : options.remainder;
            	options.seconds = options.seconds===undefined ? false: options.seconds;
            	options.months = options.months===undefined ? false : options.months;
            	options.years = options.years===undefined ? false : options.years;
            	options.days = options.days===undefined ? false : options.days;
            	options.precision = options.precision===undefined ? false : options.precision;
            	options.unit = 'minute';

				$scope.name = 'input_' + fsUtil.guid();

				$scope.$watch('model',function(nvalue, ovalue) {

					if(!nvalue) {
						$scope.input = '';
						return;
					}

					var model = fsUtil.int(nvalue);
					if(model) {
						$scope.input = fsDate.duration(model, options);
					}

				});

				$scope.keydown = function(e) {
					if(e.keyCode==13) {
						$scope.element.blur();
						$scope.element.focus();
					}
				}

				$scope.change = function() {

					var value = $scope.ngModel.$viewValue;

					if($scope.ngModel.$viewValue) {

						try {

							var model = parse(sanitize(value));

							if(model) {
								value = fsDate.duration(model,options);
								$scope.model = model;
							}

						} catch(e) {}

					} else {
						$scope.model = '';
					}

					$scope.ngModel.$setViewValue(value);
					$scope.ngModel.$render();

					if($scope.onChange) {
						//Timeout needed to updated the model
						setTimeout(function() {
							$scope.$parent.$eval($scope.onChange);
						});
					}
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
						value = fsUtil.string(value)
										.trim()
										.replace(/(\d+)\s+/g,'$1')
										.replace(/\s+/,' ')
										.replace(/^\./,'0.');

						if(value.match(/^\d*(\.\d*)?$/))
							value += 'h';
					}

					return value;
				}

	            function parse(string) {

					if(!string)
					  	return 0;

					var seconds = 0;
					angular.forEach(string.split(' '), function(chunk) {

						var matches = chunk.match(/^(\d+\.?\d*)([YMdhms])$/);

						if(!matches) {
							throw 'Invalid duration format';
						}

						var factor = {
							Y:fsDate.SECONDS_YEAR,
							M:fsDate.SECONDS_MONTH,
							d:fsDate.SECONDS_DAY,
							h:fsDate.SECONDS_HOUR,
							m:fsDate.SECONDS_MINUTE,
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