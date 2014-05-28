/*jslint browser: true*/
/*global $, jQuery, console*/
var ORParser = (function () {
    'use strict';

    function ORParser() {
        this.numberOfProblems = 0;
        this.problems = [];
    }

    ORParser.prototype.parse = function (input) {
        console.log('starting parsing');
        var tokens = input.split(' ');
        this.parseTokens(tokens);
    };

    ORParser.prototype.parseTokens = function (tokens) {
        var i, numberOfValues, numberOfConstraints, optimalSolution;

        this.numberOfProblems = tokens[0];

        for (i = 1; i < tokens.length; i++) {
            
        }
    };

    return ORParser;

}());
