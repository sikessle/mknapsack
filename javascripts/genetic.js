var Genetic = (function () {
    'use strict';

    // -------------------------------------------------------------------------

    /*
        Evaluation Module.
        Evaluates the solutions.
        It has domain knowledge.
    */
    function EvaluationModule() {
    }

    /*
        Evaluates the quality of a solution.
        If any constraint is violated -1 is returned,
        otherwise a non-negative integer.
        @solution
        @problem
        @return the evaluated value. -1 if constraints are violated, else a
                value >= 0.
    */
    EvaluationModule.prototype.evaluate = function (solution, problem) {
        var totalProfit = 0;

        for (var i = 0; i < solution.length; i++) {
            if (solution[i] === 1) {
                totalProfit += problem.profits[i];
            }
        }

        var contraintsMet = this.checkConstraints(solution, problem);

        if (!contraintsMet) {
            return -1;
        }
        return totalProfit;
    };

    /*
        Checks if any constraint is violated or not.
        @solution
        @problem
        @return true if constraints are met, else false
    */
    EvaluationModule.prototype.checkConstraints = function (solution, problem) {
        var totalWeight, constraintWeights, constraintMet, bagLimit;

        constraintMet = true;

        for (var c = 0; c < problem.constraints.length; c++) {
            constraintWeights = problem.constraints[c].weights;
            bagLimit = problem.constraints[c].bagLimit;
            totalWeight = this.getWeight(solution, constraintWeights);
            if (totalWeight > bagLimit) {
                constraintMet = false;
                break;
            }
        }

        return constraintMet;
    };

    /*
        returns the weight of a solution based on the constraints.
        @solution
        @constraint [] of weights
        @return the total weight of the solution.
    */
    EvaluationModule.prototype.getWeight = function (solution, constraint) {
        var weight = 0;

        for (var i = 0; i < solution.length; i++) {
            if (solution[i] === 1) {
                weight += constraint[i];
            }
        }

        return weight;
    };

    // -------------------------------------------------------------------------

    /*
        Population Module.
        Maintains the population.
        - initialization
        - population size
        - replacement of members by given members
    */
    function PopulationModule(populationSize) {
        this.size = populationSize;
        this.evaluation = new EvaluationModule();
    }

    /*
        creates an initial population with solutions and returns it.
        @return a population with solutions [ [0, 1, ..], [1, 1, ..], .. ]
    */
    PopulationModule.prototype.createInitial = function () {

    };

    // -------------------------------------------------------------------------

    /*
        Reproduction Module.
        - parent selection
        - fitness techniques
        - crossover
        - mutation
    */
    function ReproductionModule() {
        this.evaluationModule = new EvaluationModule();
    }

    /*
        fitness-is-evaluation.
        @solution must be [0, 1, ..] for choosing the items to pack.
        @problem
        @return -1 if constraints violated else >= 0
    */
    ReproductionModule.prototype.fitness = function (solution, problem) {
        return this.evaluationModule.evaluate(solution, problem);
    };

    /*
        selects parents based on fitness.
        @population [] of solutions: [ [0, 1, ..], [1, 1, ..], .. ]
        @return [] with two members
    */
    ReproductionModule.prototype.selectParents = function (population) {

    };

    // -------------------------------------------------------------------------


    /*
        controls the three modules and their interaction.
    */
    function Genetic(params, logger) {
        this.params = $.extend({}, params);
        this.logger = logger;
        this.stopwatch = new Stopwatch();
        this.problem = {};
        this.evaluationModule = new EvaluationModule();
        this.populationModule = new PopulationModule(params.populationSize);
        this.reproductionModule = new ReproductionModule();
    }

    /*
        solves the given single problem and stops the time.
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

        var population = this.populationModule.createInitial();

        for (var gen = 0; gen < this.params.generationsLimit; gen++) {
            this.logger.log("generation {}:", gen);

            this.reproductionModule.
            /*
                TODO
                work on population.

            */

            var solution = [1, 1, 1, 1, 1, 1];
            var profit = this.reproductionModule.fitness(solution, this.problem);
            this.logger.log("fitness of {}:\n == {} ==", solution, profit);
            this.logger.log("problem: {}", this.problem);

            this.logSeparator();
        }
    };

    Genetic.prototype.logSeparator = function () {
        this.logger.log("---------------------");
    };

    return Genetic;

}());
