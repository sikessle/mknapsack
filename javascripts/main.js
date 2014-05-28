/*jslint browser: true*/
/*global $, jQuery, ORParser*/

$(document).ready(function () {
    'use strict';

    var input, parser, problems, genetic, parserLogger, geneticLogger;

    parserLogger = new Logger('#parser-log textarea');
    geneticLogger = new Logger('#genetic-log textarea');

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
        $('.results .nav-tabs a[href="#genetic-log"]').tab('show');
        $('.results .panel').removeClass('panel-default').addClass('panel-success');
        genetic.solve(problems);
    });

    $('#reset').click(function () {
        document.location.reload(true);
    });

});
