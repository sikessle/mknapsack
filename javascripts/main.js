$(document).ready(function () {
    'use strict';

    var input, parser, problems, genetic, parserLogger, geneticLogger, geneticParams;

    parserLogger = new Logger('#parser-log textarea');
    geneticLogger = new Logger('#genetic-log textarea');
    geneticLogger.setReverse(true);

    parser = new ORParser(parserLogger);

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
        var problemIndex = parseInt($('#problemIndex').val());

        geneticParams = {
            delay: 0,
            mutateProbability: parseFloat($('#mutateProbability').val()),
            crossoverProbability: parseFloat($('#crossoverProbability').val()),
            generationsLimit: parseInt($('#generationsLimit').val()),
            populationSize: parseInt($('#populationSize').val())
        };

        genetic = new Genetic(geneticParams, geneticLogger);
        genetic.solve(problems[problemIndex], function (plotData) {
            $.plot($("#graph-1"), [plotData]);
            $('.results .nav-tabs a[href="#plot-1"]').tab('show');
        });
    });

    $('#reset').click(function () {
        document.location.reload(true);
    });

});
