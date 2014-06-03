/*
The mknapsack solver is a web-based javascript tool to solve the knapsack
problem with a genetic algorithm.
Copyright (C) {2014}  {Simon Kessler}

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
var Logger = (function () {
    'use strict';

    function Logger(target) {
        this.$target = $(target);
        this.reverse = false;
    }

    Logger.prototype.setReverse = function (flag) {
        this.reverse = flag;
    };

    Logger.prototype.log = function (msg) {
        var line, i, arg;

        line = msg;

        for (i = 1; i < arguments.length; i += 1) {
            arg = this.handleObject(arguments[i]);
            line = line.replace("{}", arg);
        }

        line = this.handleObject(line);
        this.writeOut(line);
    };

    Logger.prototype.handleObject = function (obj) {
        var result = obj;

        if (typeof obj === 'object' && JSON) {
            result = JSON.stringify(obj);
        }
        return result;
    };

    Logger.prototype.writeOut = function (msg) {
        if (this.reverse) {
            this.$target.prepend(msg + '\n');
        } else {
            this.$target.append(msg + '\n');
        }
    };

    Logger.prototype.clear = function () {
        this.$target.html('');
    };


    return Logger;

}());
