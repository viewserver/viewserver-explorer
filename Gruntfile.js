/* jshint node:true, es3:false */

/*
 * Copyright 2016 Claymore Minds Limited and Niche Solutions (UK) Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var mountFolder = function (connect, dir) {
    'use strict';
    return connect.static(require('path').resolve(dir));
};

var fs = require('fs');

module.exports = function (grunt) {
    'use strict';

    // Loads all grunt tasks
    require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);

    // App configuration
    var config = grunt.file.readJSON('config.json');

    // Tasks configuration
    grunt.initConfig({

        config: config,

        pkg: grunt.file.readJSON('package.json'),
        bowerConfig: grunt.file.readJSON('./bower.json'),

        clean: {
            options: {
                force: true
            },
            destination: {
                src: ['<%= config.destination %>']
            },
            cssdev: {
                src: ['<%= config.source %>/css/style.css']
            }
        },

        concat: {
            build: {
                src: [
                    '<%= requirejs.build.options.out %>'
                ],
                dest: '<%= config.destination %>/app.js'
            },
            cssdev: {
                src: [
                    'app/bower_components/bootstrap/dist/css/bootstrap.min.css',
                    'app/bower_components/ng-grid/ng-grid.css',
                    'app/bower_components/angular-multi-select/angular-multi-select.css',
                    '<%= sass.dev.dest %>'
                ],
                dest: '<%= config.source %>/css/style.css'

            },
            cssbuild: {
                src: [
                    'app/bower_components/bootstrap/dist/css/bootstrap.min.css',
                    'app/bower_components/ng-grid/ng-grid.css',
                    'app/bower_components/angular-multi-select/angular-multi-select.css',
                    '<%= sass.build.dest %>'
                ],
                dest: '<%= config.destination %>/css/style.css'

            }
        },

        connect: {
            options: {
                hostname: config.hostname
            },
            source: {
                options: {
                    port: config.port,
                    livereload: config.livereloadPort,
                    open: true,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'demo'),
                            mountFolder(connect, config.source)
                        ];
                    }
                }
            }
        },

        copy: {
            gitignore: {
                files: [{
                    expand: true,
                    dot: true,
                    dest: '<%= config.destination %>',
                    src: [
                        '.gitignore',
                    ]
                }]
            },
            build: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.source %>',
                    dest: '<%= config.destination %>',
                    src: [
                        'images/**/*',
                        '*.js',
                        '*.swf',
                        '*.png',
                        'components/globalData/**/*.json',
                        'version.json',
                        'mapTemplates/*.*',
                        '**/*.proto',


                        'bower_components/angular/angular.min.js',
                        'bower_components/angular-route/angular-route.min.js',
                        'bower_components/augment/augment.js',
                        'bower_components/requirejs/require.js',
                        'bower_components/jquery/dist/jquery.min.js'
                    ]
                }]
            }
        },

        cssmin: {
            options: {
                banner: '/*! <%= pkg.title %> <%= pkg.version %> (built on <%= grunt.template.today() %>) */',
                keepSpecialComments: 0
            },
            build: {
                src: [
                    '<%= sass.build.dest %>'
                ],
                dest: '<%= config.destination %>/css/style.css'
            },
            dev: {
                src: [
                    '<%= sass.dev.dest %>'
                ],
                dest: '<%= config.source %>/css/style.css'
            }
        },

        htmlmin: {
            build: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    keepClosingSlash: true
                },
                expand: true,
                cwd: '<%= config.source %>',
                src: ['**/*.html', '!**/bower_components/**'],
                dest: '<%= config.destination %>'
            }
        },

        requirejs: {
            build: {
                options: {
                    name: 'app',
                    baseUrl: '<%= config.source %>',
                    mainConfigFile: '<%= config.source %>/config.js',
                    optimize: 'none',
                    normalizeDirDefines: 'all',
                    out: '<%= config.destination %>/app.js',
                    paths: {
                        jquery: 'empty:',
                        angular: 'empty:',
                        angularRoute: 'empty:',
                    }
                }
            }
        },

        sass: {
            options: {
                style: 'expanded',
                lineNumbers: true,
                loadPath: '<%= config.source %>/sass',
                compass: true
            },
            dev: {
                options: {},
                src: '<%= config.source %>/sass/main.scss',
                dest: '<%= config.source %>/css/style.css'
            },
            build: {
                src: '<%= config.source %>/sass/main.scss',
                dest: '<%= config.destination %>/css/style.css'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.title %> <%= pkg.version %> (built on <%= grunt.template.today() %>) */\n',
                mangle: false,
                compress: true
            },
            build: {
                /*expand: true,*/
                src: ['<%= requirejs.build.options.out %>'],
                dest: '<%= config.destination %>/app.min.js'
            }
        },

        bump: {
            options: {
                files: ['package.json', 'bower.json', '<%= config.source %>/version.json'],
                updateConfigs: ['pkg'],
                commit: true,
                commitMessage: 'Release %VERSION%',
                commitFiles: ['-a'],
                createTag: false,
                push: false,
                pushTo: 'origin'
            }
        },


        bowerCreateConfig: {
            dist: {
                options: {
                    dest: '<%= config.destination %>',
                    space: 2,
                    config: {
                        name: '<%= bowerConfig.name %>',
                        ignore: [],
                        version: '<%= bowerConfig.version %>',
                        main: '<%= config.destination %>/app.min.js',
                        private: '<%= bowerConfig.private %>',
                        dependencies: '<%= bowerConfig.dependencies %>'
                    }
                }
            }
        },

        watch: {
            styles: {
                files: ['<%= config.source %>/**/*.scss'],
                tasks: ['clean:cssdev', 'sass:dev', 'cssmin:dev',  'concat:cssdev']
            },
            scripts: {
                files: ['<%= config.source %>/**/*.js'],
            },
            served: {
                options: {
                    livereload: config.livereloadPort
                },
                files: [
                    '<%= config.source %>/**/*.html', // View files
                    '<%= config.destination %>/css/**/*.css', // Compiled CSS files from Sass
                    '<%= config.source %>/**/*.js' // JS files
                ]
            }
        }
    });

    // "build" task
    grunt.registerTask('build', 'Builds from /src to /dest while concatenating, minifying & uglifying sources.', function () {

        return grunt.task.run([
            'clean:destination',
            'htmlmin:build',
            'copy:build',
            'copy:gitignore',
            'sass:build',
            'cssmin:build',
            'concat:cssbuild',
            'requirejs:build',
            'uglify:build',
            'concat:build',
            'bowerCreateConfig'
        ]);
    });

    // "serve" task
    grunt.registerTask('serve', 'Serves library source on a given url to be consumed by a client during development', function () {
        var tasks = [
            'clean:destination',
            'sass:dev',
            'cssmin:dev',
            'concat:cssdev',
            'connect:source',
            'watch'
        ];

        return grunt.task.run(tasks);
    });

    grunt.registerTask('default', 'This is the default development task. Lints & serves locally while watching for changes', function () {
        return grunt.task.run(['serve']);
    });
};
