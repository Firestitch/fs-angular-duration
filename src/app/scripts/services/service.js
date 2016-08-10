(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name fs.fsDuration
     */

    angular.module('fs-angular-duration')
    .factory('fsDuration', function () {
       
        var service = {        
            format:format
        };
       
        return service;

        function plural(words,count) {
            if(count==1)
                return ' ' + words[0];
            return ' ' + words[1];
        }

        function round(number, precision) {
            var factor = Math.pow(10, precision);
            var tempNumber = number * factor;
            var roundedTempNumber = Math.round(tempNumber);
            return roundedTempNumber / factor;
        };


        /**
         * @ngdoc method
         * @name format
         * @methodOf fs.fsDuration
         * @param {number} time Time represented in the specified units
         * @param {string} options.unit The unit used to measure time (second, minute)
         * @param {object} options &nbsp;
         * @param {bool} options.remainder Use a decimal or string for the remainder
         * @param {bool} options.abr Use the full word or abbreviation ie. hr vs. hours
         * @param {bool} options.suffix Adds 'ago' or 'from now' 
         * @param {object} options.limits The upper limits of each unit
                <ul>
                    <li><label>second</label>60</li>
                    <li><label>minute</label>60</li>
                    <li><label>hour</label>24</li>
                    <li><label>day</label>30.5</li>
                </ul>
         */
        function format(time,options) {

            options = options || {};
            options.remainder = options.remainder===undefined ? 'decimal' : options.remainder;
            options.unit = options.unit===undefined ? 'second' : options.unit;
            options.abr = options.abr===undefined ? true : options.abr;
            options.suffix = options.suffix===true ? (time>0 ? " ago" : " from now") : "";

            options.limits = options.limits || {};
            options.limits.second = options.limits.second===undefined ? 60 : options.limits.second;
            options.limits.minute = options.limits.minute===undefined ? 60 : options.limits.minute;
            options.limits.hour = options.limits.hour===undefined ? 24 : options.limits.hour;
            options.limits.day = options.limits.day===undefined ? 30.5 : options.limits.day;

            if(options.unit=='minute') {
                time = time * 60;
            } else if(options.unit=='hour') {
                time = time * 60 * 60;
            }

            time = parseInt(time);

            if(time<options.limits.second)
                return time + (options.abr ? "s" : plural(['second','seconds'],time)) + options.suffix;

            var remainder_seconds = Math.floor(time % 60);
            if(remainder_seconds) {
                remainder_seconds = remainder_seconds + (options.abr ? "s" : plural(['second','seconds'],remainder_seconds));
            }

            var minutes = options.remainder=='decimal' ? round(time/60,1) : Math.floor(time/60);

            if(time<(options.limits.minute * 60))
                return minutes + (options.abr ? "m" : plural(['minute','minutes'],minutes)) + (options.remainder=='string' && remainder_seconds ? ' ' + remainder_seconds : '') + options.suffix;

            var hours = time / 3600;
            hours = options.remainder=='decimal' ? round(hours,1) : Math.floor(hours);

            var remainder_minutes = Math.floor((time % (options.limits.minute * 60))/60);
            if(remainder_minutes) {
                remainder_minutes = remainder_minutes + (options.abr ? "m" : plural(['minute','minutes'],remainder_minutes));
            }

            if(time<(options.limits.hour * 60 * 60))
                return hours + (options.abr ? "h" : plural(['hour','hours'],hours)) + (options.remainder=='string' && remainder_minutes ? ' ' + remainder_minutes : '') + options.suffix;
            
            var days = time / 3600 / 24;
            days = options.remainder=='decimal' ? round(days,1) : Math.floor(days);

            var remainder_hours = Math.floor((time % (options.limits.hour * 60 * 60))/60/60);
            if(remainder_hours) {
                remainder_hours = remainder_hours + (options.abr ? "h" : plural(['hour','hours'],remainder_hours));
            }

            if(time<(options.limits.day * 60 * 60 * 24))
                return days + (options.abr ? "d" : plural(['day','days'],days,false)) + (options.remainder=='string' && remainder_hours ? ' ' + remainder_hours : '') + options.suffix;

            var months = time / 3600 / 24 / 30.417;
            months = options.remainder=='decimal' ? round(months,1) : Math.floor(months);         

            var remainder_days = Math.floor((time % (options.limits.day * 60 * 60 * 24))/60/60/24);
            if(remainder_days) {
                remainder_days = remainder_days + (options.abr ? "d" : plural(['day','days'],remainder_days,false));
            }

            return months + (options.abr ? "M" : plural(['month','months'],months,false)) + (options.remainder=='string' && remainder_days ? ' ' + remainder_days : '') + options.suffix;
        }
    });
})();


