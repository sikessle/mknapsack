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
$(document).ready(function () {
    'use strict';

    var input, parser, problems, genetic, parserLogger,
        geneticLogger, geneticParams, problemIndex,
        graphCounter = 0, license;

    license = "------------------------------------------------\n";
    license += "mknapsack solver Copyright (C) 2014 Simon Kessler\n";
    license += "This program comes with ABSOLUTELY NO WARRANTY\n";
    license += "------------------------------------------------\n";

    parserLogger = new Logger('#parser-log textarea');
    geneticLogger = new Logger('#genetic-log textarea');
    geneticLogger.setReverse(true);

    parser = new ORParser(parserLogger);


    function createPlot(data) {
        var plotData, bestQuality, computingTime;

        plotData = data.statistics;
        bestQuality = data.bestQuality;
        computingTime = data.computingTime;

        var best = {
            data: plotData.bestFitness,
            label: "fittest solution"
        };

        var average = {
            data: plotData.averageFitness,
            label: "average fitness of population"
        };

        var optimal = {
            data: [
                [0, problems[problemIndex].optimal],
                [geneticParams.generationsLimit, problems[problemIndex].optimal]
            ],
            label: "optimal solution",
            color: "#3c763d"
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
        params += " &bull; time: " + computingTime + " ms";
        params += " &bull; generations: " + geneticParams.generationsLimit;
        params += " &bull; population: " + geneticParams.populationSize;
        params += " &bull; mutation: " + geneticParams.mutateProbability;
        params += " &bull; crossover: " + geneticParams.crossoverProbability;
        params += " &bull; offsprings: " + geneticParams.offspringsProportion;

        $container.append('<p><small>' + params + '</small></p>');
        $container.append($('<div class="graph"></div>'));

        var $plotElem = $container.find('.graph');

        $plotElem.width($('.results .tab-content').width());

        $.plot($plotElem, [best, average, optimal], {
            series: {
                lines: { lineWidth: 1 }
            },
            grid: {
                hoverable: true,
            },
            legend: {
                position: "se"
            }
        });

        setTimeout(function () {
            $('.results .nav-tabs a[href="' + containerId + '"]').tab('show');
        }, 200);

        $('#solve').prop('disabled', false);

        graphCounter++;
    }

    $('#parse').click(function () {
        $('.parser').insertBefore('.results');
        $('.parser .nav-tabs a[href="#parser-log"]').tab('show');
        $('.results .panel').removeClass('panel-success').addClass('panel-default');
        input = $('#input textarea').val();
        parserLogger.clear();
        parserLogger.log(license);
        problems = parser.parse(input);
        $('#solve').prop('disabled', false);
    });

    $('#solve').click(function () {
        geneticLogger.clear();
        geneticLogger.log(license);
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
