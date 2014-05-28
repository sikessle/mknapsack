/*jslint browser: true*/
/*global $, jQuery, console*/
var Logger = (function () {
    'use strict';

    function Logger(target) {
        this.$target = $(target);
    }

    Logger.prototype.log = function (msg) {
        if (typeof msg === 'object' && JSON) {
            msg = JSON.stringify(msg);
        }
        var line = $('<div class="line">' + msg + '</div>')
        this.$target.append(line);
    };

    Logger.prototype.clear = function () {
        this.$target.html('');
    }


    return Logger;

}());
