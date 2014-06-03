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
var Stopwatch = (function () {
    'use strict';

    function Stopwatch() {
        this.watches = {};
    }

    Stopwatch.prototype.start = function (name) {
        this.watches[name] = new Date().getTime();
    };

    Stopwatch.prototype.stop = function (name) {
        var now = new Date().getTime();
        var time = now - this.watches[name];

        delete this.watches[name];

        return time;
    };

    return Stopwatch;

}());
