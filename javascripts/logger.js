/*jslint browser: true*/
/*global $, jQuery*/
var Logger = (function () {
    'use strict';

    function Logger(target) {
        this.$target = $(target);
        this.jsonIndent = 4;
    }

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
            result = JSON.stringify(obj, null, this.jsonIndent);
        }
        return result;
    };

    Logger.prototype.writeOut = function (msg) {
        this.$target.append(msg + '\n');
    };

    Logger.prototype.clear = function () {
        this.$target.html('');
    };


    return Logger;

}());
