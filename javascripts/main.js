$(document).ready(function () {
    'use strict';

    var input, parser, problems, genetic, parserLogger,
        geneticLogger, geneticParams, problemIndex,
        graphCounter = 0;

    parserLogger = new Logger('#parser-log textarea');
    geneticLogger = new Logger('#genetic-log textarea');
    geneticLogger.setReverse(true);

    parser = new ORParser(parserLogger);


    function createPlot(plotData, bestQuality) {

        var best = {
            data: plotData.best,
            label: "fittest solution"
        };

        var average = {
            data: plotData.average,
            label: "average fitness of population"
        };

        var containerId = '#plot-' + graphCounter;

        $('.results .nav-tabs').append('<li><a href="' + containerId + '" data-toggle="tab">Plot ' + graphCounter + '</a></li>');
        $('.results .tab-content').append('<div class="tab-pane fade" id="plot-' + graphCounter + '"></div>');

        var $container = $(containerId);
        var params = "";

        params += "problem: " + problemIndex;
        params += " &bull; variables: " + problems[problemIndex].profits.length;
        params += " &bull; result: " + bestQuality;
        params += " (optimal: " + problems[problemIndex].optimal + ")";
        params += " &bull; generations: " + geneticParams.generationsLimit;
        params += " &bull; population: " + geneticParams.populationSize;
        params += " &bull; mutation: " + geneticParams.mutateProbability;
        params += " &bull; crossover: " + geneticParams.crossoverProbability;
        params += " &bull; offsprings: " + geneticParams.offspringsProportion;

        $container.append('<p>' + params + '</p>');
        $container.append($('<div class="graph"></div>'));

        var $plotElem = $container.find('.graph');

        $plotElem.width($('.results .tab-content').width());

        $.plot($plotElem, [best, average], {
            series: {
                lines: { lineWidth: 1 }
            },
            grid: {
                hoverable: true
            }
        });

        setTimeout(function () {
            $('.results .nav-tabs a[href="' + containerId + '"]').tab('show');
        }, 100);

        $('#solve').prop('disabled', false);

        graphCounter++;
    }

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
        $('#solve').prop('disabled', true);
        $('.results').insertBefore('.parser');
        $('.results .nav-tabs a[href="#genetic-log"]').tab('show');
        $('.results .panel').removeClass('panel-default').addClass('panel-success');
        problemIndex = parseInt($('#problemIndex').val());

        geneticParams = {
            delay: 5,
            mutateProbability: parseFloat($('#mutateProbability').val()),
            crossoverProbability: parseFloat($('#crossoverProbability').val()),
            generationsLimit: parseInt($('#generationsLimit').val()),
            populationSize: parseInt($('#populationSize').val()),
            offspringsProportion: parseFloat($('#offspringsProportion').val())
        };

        genetic = new Genetic(geneticParams, geneticLogger);
        genetic.solve(problems[problemIndex], createPlot);
    });

    $('#reset').click(function () {
        document.location.reload(true);
    });

});
