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
        graphCounter = 0, license, totalStatistics;

    license = "------------------------------------------------\n";
    license += "mknapsack solver Copyright (C) 2014 Simon Kessler\n";
    license += "This program comes with ABSOLUTELY NO WARRANTY\n";
    license += "------------------------------------------------\n";

    parserLogger = new Logger('#parser-log textarea');
    geneticLogger = new Logger('#genetic-log textarea');
    geneticLogger.setReverse(true);

    parser = new ORParser(parserLogger);
    /*
        contains:
        {
            bestFitness: 1,
            averageFitness: 1,
            params: {}
        }
    */
    totalStatistics = [];

    function createPlot(data) {
        var plotData, bestQuality, computingTime;

        plotData = data.statistics;
        bestQuality = data.bestQuality;
        computingTime = data.computingTime;

        totalStatistics.push({
            run: graphCounter,
            fittestSoltution: bestQuality,
            computingTime: computingTime,
            params: {
                generations: geneticParams.generationsLimit,
                populationSize: geneticParams.populationSize,
                mutateProbability: geneticParams.mutateProbability,
                crossoverProbability: geneticParams.crossoverProbability,
                offspringsProportion: geneticParams.offspringsProportion,
            }
        });

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
        $('#show-total-stats').prop('disabled', false);

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

        // build problem selector
        var $option;
        var $target = $('#problemIndex');
        $target.html('');
        problems.forEach(function (problem, i) {
            $option = $('<option value="' + i + '">problem ' + i + ' (' + problem.profits.length + ' items)</option>');
            $target.append($option);
        });
    });

    $('#solve').click(function () {
        geneticLogger.clear();
        geneticLogger.log(license);
        $('#solve').prop('disabled', true);
        $('#show-total-stats').prop('disabled', true);
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

    $('#show-total-stats').click(function () {
        var $table = $('.stats-table');
        var columns = totalStatistics.length + 1;
        var rows = 8;
        var $row, $head;

        $table.html('');

        // build table
        for (var i = 0; i < rows; i++) {

            if (i === 0) {
                $head = $('<thead></thead>');
                $row = $('<tr></tr>');
                $head.append($row);
            } else {
                $row = $('<tr></tr>');
            }

            for (var j = 0; j < columns; j++) {
                if (i === 0) {
                    $row.append($('<th></th>'));
                } else {
                    $row.append($('<td></td>'));
                }
            }

            if (i === 0) {
                $table.append($head);
            } else {
                $table.append($row);
            }
        }

        // title column
        $table.find('thead tr:nth-child(1) th').first().html('run');
        $table.find('tbody tr:nth-child(1) td').first().html('generations');
        $table.find('tbody tr:nth-child(2) td').first().html('population');
        $table.find('tbody tr:nth-child(3) td').first().html('mutation');
        $table.find('tbody tr:nth-child(4) td').first().html('crossover');
        $table.find('tbody tr:nth-child(5) td').first().html('offsprings');
        $table.find('tbody tr:nth-child(6) td').first().html('fittest');
        $table.find('tbody tr:nth-child(7) td').first().html('computing time');

        // result rows starting
        $table.find('tbody tr:nth-child(6)').addClass('result');

        totalStatistics.forEach(function (stat, index) {
            var cell = index + 2;

            $table.find('thead tr:nth-child(1) th:nth-child('+cell+')').html(stat.run);
            $table.find('tbody tr:nth-child(1) td:nth-child('+cell+')').html(stat.params.generations);
            $table.find('tbody tr:nth-child(2) td:nth-child('+cell+')').html(stat.params.populationSize);
            $table.find('tbody tr:nth-child(3) td:nth-child('+cell+')').html(stat.params.mutateProbability);
            $table.find('tbody tr:nth-child(4) td:nth-child('+cell+')').html(stat.params.crossoverProbability);
            $table.find('tbody tr:nth-child(5) td:nth-child('+cell+')').html(stat.params.offspringsProportion);
            $table.find('tbody tr:nth-child(6) td:nth-child('+cell+')').html(stat.fittestSoltution);
            $table.find('tbody tr:nth-child(7) td:nth-child('+cell+')').html(stat.computingTime);
        });

        $('.stats').fadeIn();
    });

});
