/*jslint browser: true*/
/*global $, jQuery, ORParser*/

$(document).ready(function () {
    'use strict';

    var input, parser, problems;

    input = $('#input').val();

    parser = new ORParser();
    problems = parser.parse(input);
});
