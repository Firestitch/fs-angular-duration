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

        /**
         * @ngdoc method
         * @name format
         * @methodOf fs.fsDuration
         * @param {number} time Time represented in the specified units
         * @param {string} options.unit The unit used to measure time (second, minute)
         * @param {object} options &nbsp;
         * @param {bool} options.round Drop the remainder ie. 5h 2m = 5h
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

            options.round = options.round===undefined ? false : options.round;
            options.unit = options.unit===undefined ? 'second' : options.unit;
            options.abr = options.abr===undefined ? true : options.abr;
            options.suffix = options.suffix===true ? (time>0 ? " ago" : " from now") : "";

            options.limits = options.limits || {};
            options.limits.second = options.limits.second || 60;
            options.limits.minute = options.limits.minute || 60;
            options.limits.hour = options.limits.hour || 24;
            options.limits.day = options.limits.day || 30.5;

            if(options.unit=='minute') {
                time = time * 60;
            } else if(options.unit=='hour') {
                time = time * 60 * 60;
            }
            
            if((typeof time!='string' && typeof time!='number') || !parseInt(time)) {
                return '0' + (options.abr ? "s" : plural(['second','seconds'],0));
            }

            time = parseInt(time);

            if(time<=options.limits.second)
                return time + (options.abr ? "s" : plural(['second','seconds'],time)) + options.suffix;

            var remainder_seconds = Math.floor(time % 60);
            if(remainder_seconds) {
                remainder_seconds = remainder_seconds + (options.abr ? "s" : plural(['second','seconds'],remainder_seconds));
            }

            var minutes = Math.round(time/60);

            if(time<=(options.limits.minute * 60))
                return minutes + (options.abr ? "m" : plural(['minute','minutes'],minutes)) + (options.round || !remainder_seconds ? '' : ' ' + remainder_seconds) + options.suffix;
        
            var hours = time / 3600;
            hours = options.round ? Math.round(hours) : Math.floor(hours);

            var remainder_minutes = Math.floor((time % (options.limits.minute * 60))/60);
            if(remainder_minutes) {
                remainder_minutes = remainder_minutes + (options.abr ? "m" : plural(['minute','minutes'],remainder_minutes));
            }

            if(time<=(options.limits.hour * 60 * 60))
                return hours + (options.abr ? "h" : plural(['hour','hours'],hours)) + (options.round || !remainder_minutes ? '' : ' ' + remainder_minutes) + options.suffix;
            
            var days = time / 3600 / 24;
            days = options.round ? Math.round(days) : Math.floor(days);

            var remainder_hours = Math.floor((time % (options.limits.hour * 60 * 60))/60/60);
            if(remainder_hours) {
                remainder_hours = remainder_hours + (options.abr ? "h" : plural(['hour','hours'],remainder_hours));          
            }

            if(time<=(options.limits.day * 60 * 60 * 24))
                return days + (options.abr ? "d" : plural(['day','days'],days,false)) + (options.round || !remainder_hours ? '' : ' ' + remainder_hours) + options.suffix;   

            var months = time / 3600 / 24 / 30.417;
            months = options.round ? Math.round(months) : Math.floor(months);         

            var remainder_days = Math.floor((time % (options.limits.day * 60 * 60 * 24))/60/60/24);
            if(remainder_days) {
                remainder_days = remainder_days + (options.abr ? "d" : plural(['day','days'],remainder_days,false));            
            }

            return months + (options.abr ? "M" : plural(['month','months'],months,false)) + (options.round || !remainder_days ? '' : ' ' + remainder_days) + options.suffix;  
        }
    });
})();
