/*global module:false*/
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-less');

    // Project configuration.
    grunt.initConfig({
        meta:{
            version:'0.7.0',
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
        lint:{
            files:['pager.js', 'test/**/*.js']
        },
        qunit:{
            files:['test/**/*.html']
        },
        concat:{
            demo:{
                src:['<banner:meta.banner>', '<file_strip_banner:pager.js>'],
                dest:'pagerjs.com/demo/pager.min.js'
            }
        },
        min:{
            dist:{
                src:['<banner:meta.banner>', '<file_strip_banner:pager.js>'],
                dest:'dist/pager.min.js'
            },
            demo:{
                src:['<banner:meta.banner>', '<file_strip_banner:pager.js>'],
                dest:'pagerjs.com/demo/pager.min.js'
            }
        },
        watch:{
            files:'<config:lint.files>',
            tasks:'lint qunit'
        },
        jshint:{
            options:{
                curly:true,
                eqeqeq:true,
                immed:true,
                latedef:true,
                newcap:true,
                noarg:true,
                sub:true,
                undef:true,
                boss:true,
                eqnull:true,
                browser:true
            },
            globals:{
                jQuery:true,
                ko:true,
                $:true,
                define:true,
                _:true
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
                    'demo/pager.css':'pager.less'
                }
            }
        },
        uglify:{}
    });

    // Default task.
    grunt.registerTask('default', 'lint less qunit concat min');

    grunt.registerTask('travis', 'qunit lint');

};
