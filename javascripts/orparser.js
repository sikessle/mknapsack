/*jslint browser: true*/
/*global $, jQuery, console*/
var ORParser = (function () {
    'use strict';

    function ORParser() {
        this.problems = [];
    }

    ORParser.prototype.parse = function (input) {
        console.log('starting parsing');
        var tokens = input.match(/\S+/g);
        this.parseTokens(tokens);
        return this.problems;
    };

    ORParser.prototype.parseTokens = function (tokens) {
        var i, p, numProfits,
            numWeights, optimalSolution, numBagLimits, numberOfProblems,
            problem, k, j, weight;

        numberOfProblems = tokens[0];
        console.log("number of problems: " + numberOfProblems);

        i = 1;
        p = 0;
        while (p < numberOfProblems) {
            // problem header: N M OptimalSolution
            numProfits = this.getToken(tokens, i);
            i += 1;
            numWeights = this.getToken(tokens, i);
            numBagLimits = numWeights;
            i += 1;
            optimalSolution = this.getToken(tokens, i);
            i += 1;

            console.log('numProfits: %d, numWeights: %d, numBagLimits: %d, optimal: %d',
                numProfits, numWeights, numBagLimits, optimalSolution);


            // parse single problem block
            problem = {
                profits: [],
                weights: [],
                bagLimits: []
            };

            // profits
            for (k = 0; k < numProfits; k += 1) {
                problem.profits.push(this.getToken(tokens, i + k));
            }

            i += numProfits;

            // weights
            for (k = 0; k < numWeights; k += 1) {
                problem.weights.push([]);
                for (j = 0; j < numProfits; j += 1) {
                    weight = this.getToken(tokens, i + k * numProfits + j);
                    problem.weights[k].push(weight);
                }
            }

            i += numProfits * numWeights;

            // bag limits
            for (k = 0; k < numBagLimits; k += 1) {
                problem.bagLimits.push(this.getToken(tokens, i + k));
            }

            i += numBagLimits;


            console.log('problem: %o', problem);

            this.problems.push(problem);

            p += 1;
        }
    };

    ORParser.prototype.getToken = function (tokens, i) {
        return parseInt(tokens[i], 10);
    };


    return ORParser;

}());
