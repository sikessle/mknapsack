var Genetic = (function () {
    'use strict';

    // -------------------------------------------------------------------------

    /**
     * Represents a problem to optimize.
     * @typedef {Object} Problem
     * @property {Number} optimal - the optimal solution or 0 if unknown
     * @property {Array<Number>} profits - the profit (value) of each item.
     * @property {Array<Constraint>} constraints - multiple constraints
     */

    /**
     * Represents a constraint.
     * @typedef {Object} Constraint
     * @property {Number} bagLimit - the total limit of the bag
     * @property {Array<Number>} weights - the weights of each item
     */

    /**
     * Solution vector of a problem.
     * @typedef {Array<Number>} solution: 0 means the i-th value is not packed
     * and 1 means it is packed. i.e. [0, 1, 1, 0] -> packs only the second and
     * third objects.
     */

    /**
     * Evaluation Module.
     * @typedef {Object} EvaluationModule
     * @property {Function} evaluate(solution, problem)
     */

    /**
     * Population
     * @typedef {Array<Solution>} Population
     */

    /**
     * Logger
     * @typedef {Object} Logger
     * @property {Function} log(message)
     */

    // -------------------------------------------------------------------------

    /**
     * Evaluation Module.
     * Evaluates the solutions.
     * It has domain knowledge.
     * @constructor
     */
    function EvaluationModule() {
    }

    /**
     * Sets the current problem.
     * @param {Problem} problem
     */
    EvaluationModule.prototype.setProblem = function (problem) {
        this.problem = problem;
    };


    /**
     * Evaluates the quality of a solution.
     * If any constraint is violated -1 is returned,
     * otherwise a non-negative integer.
     * @param {Solution} solution
     * @returns {Number} the evaluated value. -1 if constraints are violated, else a
     * value >= 0.
     */
    EvaluationModule.prototype.evaluate = function (solution) {
        var totalProfit = 0;

        for (var i = 0; i < solution.length; i++) {
            if (solution[i] === 1) {
                totalProfit += this.problem.profits[i];
            }
        }

        var contraintsMet = this.checkConstraints(solution);

        if (!contraintsMet) {
            return -1;
        }
        return totalProfit;
    };

    /**
     * Checks if any constraint is violated or not.
     * @param {Solution} solution
     * @returns {Boolean} true if constraints are met, else false
     */
    EvaluationModule.prototype.checkConstraints = function (solution) {
        var totalWeight, constraint, constraintMet, bagLimit;

        constraintMet = true;

        for (var c = 0; c < this.problem.constraints.length; c++) {
            constraint = this.problem.constraints[c];
            bagLimit = this.problem.constraints[c].bagLimit;
            totalWeight = this.getWeight(solution, constraint);
            if (totalWeight > bagLimit) {
                constraintMet = false;
                break;
            }
        }

        return constraintMet;
    };

    /**
     * Returns the weight of a solution based on the constraints.
     * @param {Solution} solution
     * @param {Constraint} constraint
     * @return {Number} the total weight of the solution.
     */
    EvaluationModule.prototype.getWeight = function (solution, constraint) {
        var weight = 0;

        for (var i = 0; i < solution.length; i++) {
            if (solution[i] === 1) {
                weight += constraint.weights[i];
            }
        }

        return weight;
    };

    // -------------------------------------------------------------------------

    /**
     * Population Module.
     * Maintains the population.
     * - initialization
     * - population size
     * - replacement of members by given members
     *
     * @constructor
     * @param {Number} populationSize The number of solutions per population.
     */
    function PopulationModule(populationSize) {
        this.size = populationSize;
        this.evaluation = new EvaluationModule();
    }

    /**
     * Creates an initial population with solutions and returns it.
     * @returns {Population}
     */
    PopulationModule.prototype.createInitial = function () {
        // TODO
        return [[1, 1, 1, 1, 1, 1]];
    };

    // -------------------------------------------------------------------------

    /**
     * Reproduction Module.
     * - parent selection
     * - fitness techniques
     * - crossover
     * - mutation
     *
     * @constructor
     * @param {EvaluationModule} evaluationModule The eval module to use.
     */
    function ReproductionModule(evaluationModule) {
        this.evaluationModule = evaluationModule;
    }

    /**
     * fitness-is-evaluation.
     * @param {Solution} solution
     * @returns {Number} -1 if constraints violated else >= 0
    */
    ReproductionModule.prototype.getFitness = function (solution) {
        return this.evaluationModule.evaluate(solution);
    };

    /**
     * Survival of the fittest! Returns the fittest solution in a population.
     * @param {Population} population
     * @returns {Solution} the fittest solution or an empty solution
     */
    ReproductionModule.prototype.getFittestSolution = function (population) {
        var highestFitness = -1,
            fittestSolution = [],
            fitness,
            repoModule = this;

        population.forEach(function (solution) {
            fitness = repoModule.getFitness(solution);
            if (fitness > highestFitness) {
                highestFitness = fitness;
                fittestSolution = solution;
            }
        });

        return fittestSolution;
    };

    /**
     * Returns the offspring generation
     * @param {Population} population
     * @returns {Population} the next generation of a population
     */
    ReproductionModule.prototype.generateOffspringPopulation = function (population) {
        // TODO
        return population;
    };

    // -------------------------------------------------------------------------


    /**
     * Controls the three modules and their interaction.
     * @constructor
     * @param {Object} params
     * @param {Logger} logger
     */
    function Genetic(params, logger) {
        this.params = $.extend({}, params);
        this.logger = logger;
        this.stopwatch = new Stopwatch();
        this.problem = {};
        this.evaluationModule = new EvaluationModule();
        this.populationModule = new PopulationModule(params.populationSize);
        this.reproductionModule = new ReproductionModule(this.evaluationModule);
    }

    /**
     * Solves the given single problem and stops the time.
     * @param {Problem} problem
     */
    Genetic.prototype.solve = function (problem) {
        this.stopwatch.start('total');

        this.problem = problem;

        this.initModules();
        this.solveProblemInternal();

        var totalTime = this.stopwatch.stop('total');
        this.logger.log('total time: {} ms', totalTime);
    };

    /** initializes the modules */
    Genetic.prototype.initModules = function () {
        this.evaluationModule.setProblem(this.problem);
    };

    /** the main solving controller */
    Genetic.prototype.solveProblemInternal = function () {
        var population;

        population = this.populationModule.createInitial();

        for (var gen = 0; gen < this.params.generationsLimit; gen++) {
            this.logger.log("generation {}:", gen);

            // TODO log current population

            population = this.reproductionModule.generateOffspringPopulation(population);

            this.logSeparator();
        }

        var bestSolution = this.reproductionModule.getFittestSolution(population);
        var quality = this.evaluationModule.evaluate(bestSolution);
        this.logger.log("best solution with profit: {} is {}", quality, bestSolution);
    };

    Genetic.prototype.logSeparator = function () {
        this.logger.log("---------------------");
    };

    return Genetic;

}());
