var Genetic = (function () {
    'use strict';

    /*
        Evaluation Module.
        Evaluates the solutions.
        It has domain knowledge.
    */
    function EvaluationModule() {
    }

    // evaluation-is-fitness
    EvaluationModule.prototype.evaluate = function (solution, problem) {
        var fitness = 0;

        for (var i = 0; i < solution.length; i++) {
            if (solution[i] === 1) {
                fitness += problem.profits[i];
            }
        }

        return fitness;
    };

    /*
        Population Module.
        Maintains the population.
        - initialization
        - population size
        - replacement of members by given members
    */
    function PopulationModule() {

    }

    /*
        Reproduction Module.
        - parent selection
        - fitness techniques
        - crossover
        - mutation
    */
    function ReproductionModule() {

    }

    /*
        controls the three modules and their interaction.
    */
    function Genetic(params, logger) {
        this.params = $.extend({}, params);
        this.logger = logger;
        this.stopwatch = new Stopwatch();
        this.problem = {};
        this.evaluation = new EvaluationModule();
        this.population = new PopulationModule();
        this.reproduction = new ReproductionModule();
    }

    /*
        solves the given problems and stops the time.
    */
    Genetic.prototype.solve = function (problem) {
        this.stopwatch.start('total');

        this.problem = problem;
        this.startSolving();

        var totalTime = this.stopwatch.stop('total');
        this.logger.log('total time: {} ms', totalTime);
    };

    // the main solving controller
    Genetic.prototype.startSolving = function () {
        for (var gen = 0; gen < this.params.generationsLimit; gen++) {
            this.logger.log("generation {}:", gen);
            //var solution = [0, 0, 1, 0, 0, 1];
            //var fitness = this.evaluation.evaluate(solution, this.problem);
            //this.logger.log("fitness: {}", fitness);
        }
    };

    return Genetic;

}());
