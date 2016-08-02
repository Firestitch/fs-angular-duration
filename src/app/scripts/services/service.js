(function () {
    'use strict';

    /**
     * @ngdoc interface
     * @name app.services:prettytimeService
     * @description Demo: <a href="http://firestitch.github.io/fs-angular-demos/#/prettytime">http://firestitch.github.io/fs-angular-demos/#/prettytime</a>
     */

    angular.module('fs-angular-duration')
    .factory('fsDuration', function () {
       
        var service = {        
            format:format,
            formatTimestamp: formatTimestamp
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
         * @methodOf app.services:prettytimeService
         * @param {number|date} timestamp A numeric timestamp or a Date object
         * @param {bool=} [round=true] Rounds the pretty time. ie: 5d 12h (not rounded) 5d (rounded) 
         * @param {bool=} [abr=true] Abbriviate the units of measurement. ie: 5d (abbreviated) 5 days (not abbreviated) 
         * @param {bool=} [suffix=false] add the word 'ago' or 'from now' to the end of the pretty string
         * @description Accepts a difference in time and return a pretty formated version ie. 6566533 = 7 days
         */
        function formatTimestamp(timestamp,round,abr,suffix) {
            
            if(timestamp instanceof Date)
                timestamp = timestamp.getTime()/1000;           

            var now = (new Date()).getTime()/1000;

            return format(now - timestamp,round,abr,suffix);
        }

        /**
         * @ngdoc method
         * @name format
         * @methodOf app.services:prettytimeService
         * @param {number} timestamp A numeric timestamp
         * @param {bool=} [round=true] Rounds the pretty time. ie: 5d 12h (not rounded) 5d (rounded) 
         * @param {bool=} [abr=true] Abbriviate the units of measurement. ie: 5d (abbreviated) 5 days (not abbreviated) 
         * @param {bool=} [suffix=false] add the word 'ago' or 'from now' to the end of the pretty string
         * @description Accepts a difference in time and return a pretty formated version ie. 6566533 = 7 days
         */
        function format(time,options) {

            options = options || {};
            options.round = options.round===undefined ? false : options.round;
            options.abr = options.abr===undefined ? true : options.abr;
            options.suffix = options.suffix===true ? (time>0 ? " ago" : " from now") : "";

            var limits = {  second: 60,         //60 seconds
                            minute: 3600,       //1 hour
                            hour: 86400,        //24 hours
                            day: 2628028,       //30.417 days
                            month: 15768172 };  //6 months

            if((typeof time!='string' && typeof time!='number') || !parseInt(time)) {
                return '0' + (options.abr ? "s" : plural(['second','seconds'],0));
            }

            time = parseInt(time);

            if(time<=limits.second)
                return time + (options.abr ? "s" : plural(['second','seconds'],time)) + options.suffix;

            var remainder_seconds = Math.floor(time % 60);
            if(remainder_seconds) {
                remainder_seconds = remainder_seconds + (options.abr ? "s" : plural(['second','seconds'],remainder_seconds));
            }

            var minutes = Math.round(time/60);

            if(time<=limits.minute)
                return minutes + (options.abr ? "m" : plural(['minute','minutes'],minutes)) + (options.round || !remainder_seconds ? '' : ' ' + remainder_seconds) + options.suffix;
        
            var hours = time / 3600;
            hours = options.round ? Math.round(hours) : Math.floor(hours);

            var remainder_minutes = Math.floor((time % limits.minute)/60);
            if(remainder_minutes) {
                remainder_minutes = remainder_minutes + (options.abr ? "m" : plural(['minute','minutes'],remainder_minutes));
            }

            if(time<=limits.hour)
                return hours + (options.abr ? "h" : plural(['hour','hours'],hours)) + (options.round || !remainder_minutes ? '' : ' ' + remainder_minutes) + options.suffix;
            
            var days = time / 3600 / 24;
            days = options.round ? Math.round(days) : Math.floor(days);

            var remainder_hours = Math.floor((time % limits.hour)/60/60);
            if(remainder_hours) {
                remainder_hours = remainder_hours + (options.abr ? "h" : plural(['hour','hours'],remainder_hours));          
            }

            if(time<=limits.day)
                return days + (options.abr ? "d" : plural(['day','days'],days,false)) + (options.round || !remainder_hours ? '' : ' ' + remainder_hours) + options.suffix;   

            var months = time / 3600 / 24 / 30.417;
            months = options.round ? Math.round(months) : Math.floor(months);         

            var remainder_days = Math.floor((time % limits.day)/60/60/24);
            if(remainder_days) {
                remainder_days = remainder_days + (options.abr ? "d" : plural(['day','days'],remainder_days,false));            
            }

            return months + (options.abr ? "m" : plural(['month','months'],months,false)) + (options.round || !remainder_days ? '' : ' ' + remainder_days) + options.suffix;  
        }
    });
})();
