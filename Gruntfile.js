/*global module:false*/
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    //grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-qunit-istanbul');
    grunt.loadNpmTasks('grunt-contrib-uglify');


    // Project configuration.
    grunt.initConfig({
        meta:{
            version:'1.0.1',
            banner:'/*! pager.js - v<%= meta.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '* http://oscar.finnsson.nu/pagerjs/\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
                'Oscar Finnsson; Licensed MIT */'
        },
        server:{
            port:8000,
            base:'.'
        },
        qunit:{
            options: {
                '--web-security': 'no',
                coverage: {
                    src: ['pager.js'],
                    instrumentedFiles: 'temp/',
                    htmlReport: 'report/coverage',
                    coberturaReport: 'report/',
                    linesThresholdPct: 85
                }
            },
            files:['test/**/*.html']
        },
        uglify:{
            dist:{
                options: {
                    banner: '<%= meta.banner %>'
                },
                files: {
                    'dist/pager.min.js': ['pager.js']
                }
            },
            demo:{
                options: {
                    banner: '<%= meta.banner %>'
                },
                files: {
                    'pagerjs.com/demo/pager.min.js': ['pager.js']
                }
            }
        },
        watch:{
            files:'<config:lint.files>',
            tasks:'lint qunit'
        },
        jshint:{
            files: ['pager.js'],
            options: {
                "curly": true,
                "eqeqeq": true,
                "immed": true,
                "latedef": true,
                "newcap": true,
                "noarg": true,
                "sub": true,
                "undef": true,
                "boss": true,
                "eqnull": true,
                "browser": true,
                "globals": {
                    "jQuery": true,
                    "ko": true,
                    "$": true,
                    "define": true,
                    "_": true
                }
            }
        },
        less:{
            dist:{
                files:{
                    'dist/pager.css':'pager.less'
                }
            },
            test:{
                files:{
                    'test/pager.css':'pager.less'
                }
            },
            demo:{
                files:{
                    'pagerjs.com/demo/pager.css':'pager.less'
                }
            }
        }
    });

    // Default task.
    grunt.registerTask('default', ['jshint', 'less', 'qunit', 'uglify']);

    grunt.registerTask('travis', ['qunit', 'jshint']);

};
