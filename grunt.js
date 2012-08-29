/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        meta:{
            version:'0.3.0',
            banner:'/*! pager.js - v<%= meta.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '* http://oscar.finnsson.nu/pagerjs/\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
                'Oscar Finnsson; Licensed MIT */',
            amdStart:"define(['jquery','underscore','knockout'], function($,_,ko) {",
            amdEnd:'return pager;});'
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
            dist:{
                src:['<banner:meta.banner>', '<file_strip_banner:pager.js>'],
                dest:'dist/pager.concat.js'
            },
            amd:{
                src:['<banner:meta.banner>', '<banner:meta.amdStart>', '<file_strip_banner:pager.js>', '<banner:meta.amdEnd>'],
                dest:'dist/pager.amd.concat.js'
            },
            amddemo:{
                src:['<banner:meta.banner>', '<banner:meta.amdStart>', '<file_strip_banner:pager.js>', '<banner:meta.amdEnd>'],
                dest:'demo/pager.amd.min.js'
            }
        },
        min:{
            dist:{
                src:['<banner:meta.banner>', '<file_strip_banner:pager.js>'],
                //src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
                dest:'dist/pager.min.js'
            },
            amd:{
                src:['<banner:meta.banner>', '<banner:meta.amdStart>', '<file_strip_banner:pager.js>', '<banner:meta.amdEnd>'],
                dest:'dist/pager.amd.min.js'
            },
            amddemo:{
                src:['<banner:meta.banner>', '<banner:meta.amdStart>', '<file_strip_banner:pager.js>', '<banner:meta.amdEnd>'],
                dest:'demo/pager.amd.min.js'
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
        uglify:{}
    });

    // Default task.
    grunt.registerTask('default', 'lint qunit concat min');

};
