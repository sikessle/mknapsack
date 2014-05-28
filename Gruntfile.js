module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        watch: {
            style: {
                files: ['stylesheets/**/*.less'],
                tasks: ['less']
            }
        },

        less: {
            development: {
                files: {
                    "stylesheets/main.min.css": "stylesheets/main.less"
                },
                options: {
                    compress: true
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['watch']);

};
