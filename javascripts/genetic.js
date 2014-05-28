var Genetic = (function () {
    'use strict';

    function Genetic(params, logger) {
        this.params = $.extend({}, params);
        this.logger = logger;
    }

    Genetic.prototype.solve = function (problems) {
        this.logger.log("solved all problems: {}", problems);
    };

    return Genetic;

}());
