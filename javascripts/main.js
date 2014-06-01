$(document).ready(function () {
    'use strict';

    var input, parser, problems, genetic, parserLogger, geneticLogger, geneticParams;

    geneticParams = {
        delay: 0,
        mutateProbability: 0.1,
        crossoverProbability: 1,
        generationsLimit: 3000,
        populationSize: 14
    };

    parserLogger = new Logger('#parser-log textarea');
    geneticLogger = new Logger('#genetic-log textarea');
    geneticLogger.setReverse(true);

    parser = new ORParser(parserLogger);
    // TODO setDataLogger (for data capturing) (bufferedLogger decorator)
    genetic = new Genetic(geneticParams, geneticLogger);

    $('#parse').click(function () {
        $('.parser').insertBefore('.results');
        $('.parser .nav-tabs a[href="#parser-log"]').tab('show');
        $('.results .panel').removeClass('panel-success').addClass('panel-default');
        input = $('#input textarea').val();
        parserLogger.clear();
        problems = parser.parse(input);
        $('#solve').prop('disabled', false);
    });

    $('#solve').click(function () {
        geneticLogger.clear();
        $('.results').insertBefore('.parser');
        $('.results .nav-tabs a[href="#genetic-log"]').tab('show');
        $('.results .panel').removeClass('panel-default').addClass('panel-success');
        // FIXME currently only solves the first problem in the file. make user-selectable
        genetic.solve(problems[0]);
    });

    $('#reset').click(function () {
        document.location.reload(true);
    });

});
