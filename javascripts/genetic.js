var Genetic = (function () {
    'use strict';

    function Genetic(params, logger) {
        this.params = $.extend({}, params);
        this.logger = logger;
        this.stopwatch = new Stopwatch();
    }

    Genetic.prototype.solve = function (problems) {
        this.stopwatch.start('total');
        
        this.logger.log("solved all problems: {}", problems);

        var totalTime = this.stopwatch.stop('total');
        this.logger.log('total time: {} ms', totalTime);
    };

    return Genetic;

}());
