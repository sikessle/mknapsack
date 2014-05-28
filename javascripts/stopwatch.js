var Stopwatch = (function () {
    'use strict';

    function Stopwatch() {
        this.watches = {};
    }

    Stopwatch.prototype.start = function (name) {
        this.watches[name] = new Date().getTime();
    };

    Stopwatch.prototype.stop = function (name) {
        var now = new Date().getTime();
        var time = now - this.watches[name];

        delete this.watches[name];
        
        return time;
    };

    return Stopwatch;

}());
