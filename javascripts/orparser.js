/*
The mknapsack solver is a web-based javascript tool to solve the knapsack
problem with a genetic algorithm.
Copyright (C) 2014 Simon Kessler

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
var ORParser = (function () {
    'use strict';

    function ORParser(logger) {
        this.problems = [];
        this.logger = logger;
        this.stopwatch = new Stopwatch();
    }

    ORParser.prototype.parse = function (input) {
        if (input.length === 0) {
            return;
        }
        this.stopwatch.start('parse');

        var tokens = input.match(/\S+/g);
        this.problems = [];
        this.parseTokens(tokens);

        this.logger.log("Total parsing time: {} ms", this.stopwatch.stop('parse'));

        return this.problems;
    };

    ORParser.prototype.parseTokens = function (tokens) {
        var numberOfProblems = tokens[0];
        this.logger.log("number of problems: " + numberOfProblems);
        this.logger.log('------------------------');

        var i = 1;
        var p = 0;
        var k;
        while (p < numberOfProblems) {

            // problem header: N M OptimalSolution
            var numProfits = this.getToken(tokens, i);
            i++;
            var numWeights = this.getToken(tokens, i);
            var numBagLimits = numWeights;
            i++;
            var optimalSolution = this.getToken(tokens, i);
            i++;

            // parse single problem block
            var problem = {
                optimal: optimalSolution,
                profits: [],
                weights: [],
                bagLimits: []
            };

            // profits
            for (k = 0; k < numProfits; k++) {
                problem.profits.push(this.getToken(tokens, i + k));
            }

            i += numProfits;

            // weights
            for (k = 0; k < numWeights; k++) {
                problem.weights.push([]);
                for (var j = 0; j < numProfits; j++) {
                    var weight = this.getToken(tokens, i + k * numProfits + j);
                    problem.weights[k].push(weight);
                }
            }

            i += numProfits * numWeights;

            // bag limits
            for (k = 0; k < numBagLimits; k++) {
                problem.bagLimits.push(this.getToken(tokens, i + k));
            }

            i += numBagLimits;

            this.problems.push(problem);

            p++;
        }

        this.reorderProblemsDataStructure();
        this.logProblems();
    };

    ORParser.prototype.reorderProblemsDataStructure = function () {
        var reordedProblems = [];

        this.problems.forEach(function (problem) {
            var reordered = {
                optimal: problem.optimal,
                profits: problem.profits,
                constraints: []
            };

            for (var i = 0; i < problem.weights.length; i++) {
                var constraint = {
                    bagLimit: problem.bagLimits[i],
                    weights: problem.weights[i]
                };
                reordered.constraints.push(constraint);
            }
            reordedProblems.push(reordered);
        });

        this.problems = reordedProblems;
    };

    ORParser.prototype.logProblems = function () {
        var logger = this.logger;

        this.problems.forEach(function (problem, i) {
            logger.log('- Problem {}:', i);
            logger.log(problem);
            logger.log('-------------------------');
        });
    };

    ORParser.prototype.getToken = function (tokens, i) {
        return parseInt(tokens[i], 10);
    };


    return ORParser;

}());
