/*jslint browser: true*/
/*global $, jQuery, ORParser*/

$(document).ready(function () {
    'use strict';

    var input, parser;

    input = $('#input').val();

    parser = new ORParser();
    parser.parse(input);
});
