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
        Sets the current problem.
        @problem
    */
    EvaluationModule.prototype.setProblem = function (problem) {
        this.problem = problem;
    };

    /*
        Evaluates the quality of a solution.
        If any constraint is violated -1 is returned,
        otherwise a non-negative integer.
        @solution
        @return the evaluated value. -1 if constraints are violated, else a
                value >= 0.
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

    /*
        Checks if any constraint is violated or not.
        @solution
        @problem
        @return true if constraints are met, else false
    */
    EvaluationModule.prototype.checkConstraints = function (solution) {
        var totalWeight, constraintWeights, constraintMet, bagLimit;

        constraintMet = true;

        for (var c = 0; c < this.problem.constraints.length; c++) {
            constraintWeights = this.problem.constraints[c].weights;
            bagLimit = this.problem.constraints[c].bagLimit;
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

        @populationSize The number of solutions per population.
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
        // TODO
        return [[1, 1, 1, 1, 1, 1]];
    };

    // -------------------------------------------------------------------------

    /*
        Reproduction Module.
        - parent selection
        - fitness techniques
        - crossover
        - mutation

        @evaluationModule The eval module to use. must have a
                            evaluate(solution, problem) function.
    */
    function ReproductionModule(evaluationModule) {
        this.evaluationModule = evaluationModule;
    }

    /*
        fitness-is-evaluation.
        @solution must be [0, 1, ..] for choosing the items to pack.
        @return -1 if constraints violated else >= 0
    */
    ReproductionModule.prototype.getFitness = function (solution) {
        return this.evaluationModule.evaluate(solution);
    };

    /*
        Survival of the fittest! Returns the fittest solution in a population.
        @population [] of solutions: [ [0, 1, ..], [1, 1, ..], .. ]
        @return the fittest solution or an empty solution []
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

    /*
        Returns the offspring generation
        @population [] of solutions: [ [0, 1, ..], [1, 1, ..], .. ]
        @return the new next population same size but with the offsprings of the
                given population.
    */
    ReproductionModule.prototype.generateOffspringPopulation = function (population) {
        // TODO
        return population;
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
        this.reproductionModule = new ReproductionModule(this.evaluationModule);
    }

    /*
        solves the given single problem and stops the time.
    */
    Genetic.prototype.solve = function (problem) {
        this.stopwatch.start('total');

        this.problem = problem;

        this.initModules();
        this.startSolving();

        var totalTime = this.stopwatch.stop('total');
        this.logger.log('total time: {} ms', totalTime);
    };

    // initializes the modules
    Genetic.prototype.initModules = function () {
        this.evaluationModule.setProblem(this.problem);
    };

    // the main solving controller
    Genetic.prototype.startSolving = function () {
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
// TODO !!!!!!!!!!!!!!!!!!!!!!!!!! make data capture object to capture all relevant data
// for plots aso.
    return Genetic;

}());
