/*global module:false*/
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-less');

    // Project configuration.
    grunt.initConfig({
        meta:{
            version:'0.5.0',
            banner:'/*! pager.js - v<%= meta.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '* http://oscar.finnsson.nu/pagerjs/\n' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
                'Oscar Finnsson; Licensed MIT */',
            amdStart:"define(['jquery','underscore','knockout'], function($,_,ko) { ",
            amd_start_jquery_hashchange:"define(['jquery','underscore','knockout', 'hashchange'], function($,_,ko) { ",
            amd_start_historyjs:"define(['jquery','underscore','knockout', 'history'], function($,_,ko) { ",
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
                src:['<banner:meta.banner>', '<banner:meta.amd_start_jquery_hashchange>', '<file_strip_banner:pager.js>',
                    '<file_strip_banner:start-jquery-hashchange.js>', '<banner:meta.amdEnd>'],
                dest:'demo/pager.amd.hash.min.js'
            }
        },
        min:{
            dist:{
                src:['<banner:meta.banner>', '<file_strip_banner:pager.js>', '<file_strip_banner:start-naive.js>'],
                dest:'dist/pager.min.js'
            },
            amd:{
                src:['<banner:meta.banner>', '<banner:meta.amdStart>',
                    '<file_strip_banner:pager.js>', '<file_strip_banner:start-naive.js>', '<banner:meta.amdEnd>'],
                dest:'dist/pager.amd.min.js'
            },
            amd_jquery_hashchange:{
                src:['<banner:meta.banner>', '<banner:meta.amd_start_jquery_hashchange>', '<file_strip_banner:pager.js>',
                    '<file_strip_banner:start-jquery-hashchange.js>', '<banner:meta.amdEnd>'],
                dest:'dist/pager.amd.hash.min.js'
            },
            amd_historyjs:{
                src:['<banner:meta.banner>', '<banner:meta.amd_start_historyjs>', '<file_strip_banner:pager.js>',
                    '<file_strip_banner:start-historyjs.js>', '<banner:meta.amdEnd>'],
                dest:'dist/pager.amd.history.min.js'
            },
            amddemo:{
                src:['<banner:meta.banner>', '<banner:meta.amd_start_jquery_hashchange>', '<file_strip_banner:pager.js>',
                    '<file_strip_banner:start-jquery-hashchange.js>', '<banner:meta.amdEnd>'],
                dest:'demo/pager.amd.hash.min.js'
            },
            boilerplate:{
                src:['<banner:meta.banner>', '<banner:meta.amd_start_historyjs>', '<file_strip_banner:pager.js>',
                    '<file_strip_banner:start-historyjs.js>', '<banner:meta.amdEnd>'],
                dest:'boilerplate/public/javascript/pager.amd.history.min.js'
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

};
