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
     * @typedef {Array<Number>} solution - 0 means the i-th value is not packed
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
     * - checking for doubles and ensuring only valid solutions are part of the
     *   population
     *
     * @constructor
     * @param {Number} populationSize The number of solutions per population.
     * @param {EvaluationModule} evaluationModule
     */
    function PopulationModule(populationSize, evaluationModule) {
        this.populationSize = populationSize;
        this.evaluation = evaluationModule;
    }

    /**
     * Creates an initial population with solutions and returns it.
     * @param {Number} solutionSize the number of numbers a solution must have
     * @returns {Population}
     */
    PopulationModule.prototype.createInitial = function (solutionSize) {
        var population = [], packed, r;

        // create randomly a valid population
        while (population.length < this.populationSize) {
            var solution = [];

            for (var s = 0; s < solutionSize; s++) {
                packed = Math.round(Math.random());
                solution.push(packed);
            }

            // remove item as long as the solution is not valid.
            while (this.evaluation.evaluate(solution) < 0) {
                r = Math.floor(Math.random() * solution.length);
                solution[r] = 0;
            }

            if (this.isValidAndNotDouble(solution, population)) {
                population.push(solution);
            }
        }

        return population;
    };

    /**
     * Checks if the given solution is valid (quality >= 0) and not already in the
     * population (avoid double solutions).
     * @param {Solution} solution The solution to check against the population.
     * @param {Population} population
     * @returns {Boolean} true if the solution is valid and not twice in the population.
     */
    PopulationModule.prototype.isValidAndNotDouble = function (solution, population) {
        var isValid = this.evaluation.evaluate(solution) >= 0;
        var isDouble = false;

        for (var s = 0; s < population.length; s++) {
            var isSame = true;
            for (var i = 0; i < solution.length; i++) {
                if (population[s][i] != solution[i]) {
                    isSame = false;
                    break;
                }
            }
            if (isSame) {
                isDouble = true;
                break;
            }
        }

        return this.evaluation.evaluate(solution) >= 0 && !isDouble;
    };

    /**
     * Replaces the worst solution from the population with all from the
     * offspring population.
     * @param {Population} population The population to modify.
     * @param {Array<Number>} fitnesses the fitness values of the population
     * @param {Population} offsprings The offsprings which will take
     *                     the place from the worst ones in the population.
     */
    PopulationModule.prototype.replaceWorst = function (population, fitnesses, offsprings) {
        var n = offsprings.length;
        var mapping = [];

        for (var i = 0; i < fitnesses.length; i++) {
            mapping.push({
                index: i,
                fitness: fitnesses[i]
            });
        }

        // sort by worst fitness
        mapping.sort(function (a, b) {
            if (fitnesses[a.index] < fitnesses[b.index]) {
                return -1;
            }
            if (fitnesses[a.index] > fitnesses[b.index]) {
                return 1;
            }
            return 0;
        });
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
     * @param {Number} mutateProbability The probability of a mutation (0 to 1)
     * @param {Number} crossoverProbability The probability of a crossover (0 to 1)
     */
    function ReproductionModule(evaluationModule, mutateProbability, crossoverProbability) {
        this.evaluationModule = evaluationModule;
        this.mutateProbability = mutateProbability;
        this.crossoverProbability = crossoverProbability;
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
     * Computes the probabilites of each solution to be chosen as parent.
     * @param {Population} population
     * @returns {Array<Number>} the probabilites of each solution, 0 to 1
     */
    ReproductionModule.prototype.computeProbabilites = function (population) {
        var probabilites = [],
            fitnesses = [],
            fitness,
            totalFitness = 0,
            p,
            self = this;

        population.forEach(function (solution) {
            fitness = self.getFitness(solution);
            totalFitness += fitness;
            fitnesses.push(fitness);
        });

        fitnesses.forEach(function (fitness) {
            p = fitness / totalFitness;
            probabilites.push(p);
        });

        return probabilites;
    };

    /**
     * Returns two parents based on the given probabilites.
     * @param {Population} population
     * @param {Array<Number>} probabilites
     * @returns {Array<Solution>} two unique parents
     */
    ReproductionModule.prototype.getParents = function (population, probabilites) {
        var parents = [],
        r, parent, intervals = [], interval, isDouble;

        // create intervals
        for (var i = 0; i < probabilites.length; i++) {
            interval = {};
            interval.from = i === 0 ? 0 : intervals[i - 1].to;
            interval.to = interval.from + probabilites[i];
            intervals.push(interval);
        }

        while (parents.length < 2) {
            r = Math.random();
            parent = this.getSolutionByProbability(population, intervals, r);

            if (parents.length === 1) {
                isDouble = true;
                for (var s = 0; s < parents[0].length; s++) {
                    if (parent[s] !== parents[0][s]) {
                        isDouble = false;
                    }
                }
            } else {
                isDouble = false;
            }

            if (!isDouble) {
                parents.push(parent);
            }
        }

        return parents;
    };



    /**
     * Checks if the event with the given probability happened.
     * @param {Number} probability the probability of the event
     * @returns {Boolean} true if is probable
     */
    ReproductionModule.prototype.isProbable = function (probability) {
        return Math.random() <= probability;
    };

    /**
     * Returns a solution based on a random number. If this random number is in
     * the interval i, then return solution i.
     * @param {Population} population
     * @param {Array<Object>} intervals (from, to)
     * @param {Number} r a random number
     * @returns {Solution} a solution
     */
    ReproductionModule.prototype.getSolutionByProbability = function (population, intervals, r) {
        var solution;

        for (var i = 0; i < intervals.length; i++) {
            if (r >= intervals[i].from && r < intervals[i].to) {
                solution = population[i];
                break;
            }
        }

        return solution;
    };

    /**
     * Returns two children of the given two parents by crossover-techniques.
     * Using uniform crossover with probabilty of 0.5.
     * @param {Array<Solution>} parents two parents
     * @returns {Array<Solution>} two offsprings
     */
    ReproductionModule.prototype.getOffsprings = function (parents) {
        var offsprings = [];
        var parentIndex;
        var c1, c2;

        c1 = parents[0].slice(0);
        c2 = parents[1].slice(0);

        if (this.isProbable(this.crossoverProbability)) {
            for (var i = 0; i < parents[0].length; i++) {
                parentIndex = this.isProbable(0.5) ? 0 : 1;

                c1[i] = parents[parentIndex][i];
                c2[i] = parents[1 - parentIndex][i];
            }
        }

        offsprings.push(c1);
        offsprings.push(c2);

        return offsprings;
    };

    /**
     * Mutates with a given probability the solution at one position.
     * Only accepts good mutation which improve the fitness.
     * @param {Solution} solution the solution to mutate
     */
    ReproductionModule.prototype.mutate = function (solution) {
        var r = Math.random();
        var oldFitness = this.getFitness(solution);

        if (this.isProbable(this.mutateProbability)) {
            var pos = Math.floor(Math.random() * solution.length);
            solution[pos] = 1 - solution[pos];
            var newFitness = this.getFitness(solution);
            // bad mutation
            if (newFitness < oldFitness) {
                // revert mutation
                solution[pos] = 1 - solution[pos];
            }
        }
    };

    // -------------------------------------------------------------------------


    /**
     * Controls the three modules and their interaction.
     * @constructor
     * @param {Object} params Parameters to control the algorithm
     * @param {Number} params.delay time between consecutive generations computation.
     * @param {Number} params.mutateProbability between 0 and 1
     * @param {Number} params.crossoverProbability between 0 and 1
     * @param {Number} params.populationSize
     * @param {Number} params.generationsLimit
     * @param {Number} params.offspringsProportion proportion (0 to 1) of the population
     *                 which will be replaced by some offsprings.
     * @param {Logger} logger
     */
    function Genetic(params, logger) {
        this.params = $.extend({}, params);
        this.logger = logger;
        this.stopwatch = new Stopwatch();
        this.evaluationModule = new EvaluationModule();
        this.populationModule = new PopulationModule(params.populationSize,
            this.evaluationModule);
        this.reproductionModule = new ReproductionModule(this.evaluationModule,
            params.mutateProbability, params.crossoverProbability);
    }

    /**
     * Solves the given single problem and stops the time.
     * @param {Problem} problem
     * @param {Callback} callback called when the problem is solved and passed the plot data.
     */
    Genetic.prototype.solve = function (problem, callback) {
        this.problem = problem;
        this.onFinished = callback;
        this.currentPopulation = [];
        this.generationCounter = 0;

        this.initPlotObject();
        this.initModules();

        this.solveProblemInternal();
    };

    Genetic.prototype.initPlotObject = function () {
        this.plotData = {};
        this.plotData.best = [];
        this.plotData.average = [];
    };

    /** initializes the modules */
    Genetic.prototype.initModules = function () {
        this.evaluationModule.setProblem(this.problem);
    };

    /** the main solving controller */
    Genetic.prototype.solveProblemInternal = function () {
        var populationSize = this.problem.profits.length;

        this.stopwatch.start('total');
        this.currentPopulation = this.populationModule.createInitial(populationSize);
        this.stepAndEnqueue();
    };

    Genetic.prototype.stepAndEnqueue = function () {
        this.logger.log("generation {}", this.generationCounter);

        this.storePlotData();

        if (this.isGenerationLimitReached()) {
            this.analyzeBestSolution();
        } else {
            this.generateOffspringPopulation();
            setTimeout(this.stepAndEnqueue.bind(this), this.params.delay);
        }
    };

    Genetic.prototype.isGenerationLimitReached = function () {
        return this.generationCounter === this.params.generationsLimit;
    };

    Genetic.prototype.analyzeBestSolution = function () {
        var best = this.reproductionModule.getFittestSolution(this.currentPopulation);
        var quality = this.evaluationModule.evaluate(best);
        var totalTime = this.stopwatch.stop('total');

        this.logger.log("total best solution with profit {} is {} (optimal: {})",
            quality, best, this.problem.optimal);

        this.logger.log('total time: {} ms', totalTime);

        this.onFinished(this.plotData, quality);
    };

    /** stores plotting data */
    Genetic.prototype.storePlotData = function () {
        var gen = this.generationCounter;
        var pop = this.currentPopulation;
        var totalFitness = 0;
        var averageFitness;
        var bestFitness;
        var bestSolution;

        for (var i = 0; i < pop.length; i++) {
            totalFitness += this.reproductionModule.getFitness(pop[i]);
        }
        averageFitness = totalFitness/pop.length;

        bestSolution = this.reproductionModule.getFittestSolution(pop);
        bestFitness = this.reproductionModule.getFitness(bestSolution);

        this.plotData.best.push([gen, bestFitness]);
        this.plotData.average.push([gen, averageFitness]);
    };

    /**
     * Replaces the current population with some offsprings
     */
    Genetic.prototype.generateOffspringPopulation = function () {
        var offspringPopulation = [],
            probabilites = [],
            fitnesses = [],
            reproduction = this.reproductionModule,
            parents,
            children,
            offspringsLimit;

        offspringsLimit = this.params.offspringsProportion * this.params.populationSize;
        probabilites = reproduction.computeProbabilites(this.currentPopulation);

        while (offspringPopulation.length < offspringsLimit) {
            parents = reproduction.getParents(this.currentPopulation, probabilites);
            children = reproduction.getOffsprings(parents);

            this.insertChildren(children, offspringPopulation);
        }

        fitnesses = this.getFitnessValuesOfCurrentPopulation();

        this.populationModule.replaceWorst(this.currentPopulation,
            fitnesses, offspringPopulation);
        this.generationCounter++;
    };



    /**
     * Computes the fitness values of each solution in the current population.
     * @returns {Array<Number>} The fitness values of the population
     */
    Genetic.prototype.getFitnessValuesOfCurrentPopulation = function () {
        var pop = this.currentPopulation;
        var result = [];

        for (var i = 0; i < pop.length; i++) {
            result.push(this.reproductionModule.getFitness(pop[i]));
        }

        return result;
    };

    /**
     * Inserts the children into the offsprings population
     * @param {Array<Solution>} children
     * @param {Population} offspringPopulation
     */
    Genetic.prototype.insertChildren = function (children, offspringPopulation) {
        var pop = this.populationModule;

        for (var i = 0; i < children.length; i++) {
            if (pop.isValidAndNotDouble(children[i], offspringPopulation)) {
                offspringPopulation.push(children[i]);
            }
        }
    };

    return Genetic;

}());
