/*jslint browser: true*/
/*global $, jQuery, ORParser*/

$(document).ready(function () {
    'use strict';

    var input, parser, problems, genetic, parserLogger, geneticLogger;

    parserLogger = new Logger('#parser-log');
    geneticLogger = new Logger('#genetic-log');

    parser = new ORParser(parserLogger);
    genetic = new Genetic({
        prop: 'val'
    });

    $('#parse').click(function () {
        $('.parser .nav-tabs a[href="#parser-log"]').tab('show');

        input = $('#input textarea').val();
        parserLogger.clear();
        problems = parser.parse(input);
        geneticLogger.clear();
        $('#solve').prop('disabled', false);
    });

    $('#solve').click(function () {
        genetic.solve(problems);
    });

});
