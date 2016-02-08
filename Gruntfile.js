module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bower: {
            install: {
                options: {
                    targetDir: 'client/requires',
                    layout: 'byComponent'
                }
            }
        },

        clean: {
            build: ['build'],
            dev: {
                src: ['ionic/www/js/app.js', 'ionic/www/css/<%= pkg.name %>.css', 'ionic/www/js/<%= pkg.name %>.js']
            },
            prod: ['dist']
        },

        browserify: {
            vendor: {
                src: ['ionic/www/js/**/*.js'],
                dest: 'ionic/www/libs.js',
                options: {
                    transform: [
                        'deamdify'
                    ],
                    shim: {
                        ionic: {
                            path: 'ionic/lib/ionic/release/js/ionic.bundle.min.js',
                            exports: 'angular'
                        },
                        jquery: {
                            path: 'ionic/lib/jquery/dist/jquery.js',
                            exports: '$'
                        },
                        lodash: {
                            path: 'ionic/lib/lodash/lodash.js',
                            exports: '_'
                        },
                        'angular-cookies': {
                            path: 'ionic/lib/angular-cookies/angular-cookies.min.js',
                            depends: {
                                ionic: 'angular'
                            },
                            exports: null
                        },
                        'httpauth': {
                            path: 'ionic/lib/angular-http-auth/src/http-auth-interceptor.js',
                            depends: {
                                ionic: 'angular'
                            },
                            exports: null
                        },
                        'angular-messages': {
                            path: 'ionic/lib/angular-http-auth/src/http-auth-interceptor.js',
                            depends: {
                                ionic: 'angular'
                            },
                            exports: null
                        },
                        momentjs: {
                            path: 'ionic/lib/moment/min/moment.min.js',
                            exports: 'moment',
                            depends: {
                                jquery: '$'
                            }
                        },
                        tzdetect: {
                            path: 'ionic/lib/tzdetect/tzdetect.js',
                            depends: {
                                momentjs: 'moment'
                            },
                            exports: null
                        },
                        'ui-grid': {
                            path: 'ionic/lib/angular-ui-grid/ui-grid.js',
                            depends: {
                                ionic: 'angular'
                            },
                            exports: null
                        },/*
                        validator: {
                            path: 'ionic/lib/validator-js/validator.js',
                            exports: null
                        },*/
                        'angular-gettext': {
                            path: 'ionic/lib/angular-gettext/dist/angular-gettext.js',
                            depends: {
                                ionic: 'angular'
                            },
                            exports: null
                        },
                        'angular-local-storage': {
                            path: 'ionic/lib/angular-local-storage/dist/angular-local-storage.js',
                            depends: {
                                ionic: 'angular'
                            },
                            exports: null
                        },
                        'ionic-fancy-select': {
                            path: 'ionic/lib/ionic-fancy-select/src/ionic-fancy-select.js',
                            depends: {
                                ionic: 'angular'
                            },
                            exports: null
                        },
                        'angular-resource': {
                            path: 'ionic/lib/angular-resource/angular-resource.js',
                            depends: {
                                ionic: 'angular'
                            },
                            exports: null
                        },
                        'ionic-timepicker': {
                            path: 'ionic/lib/ionic-timepicker/dist/ionic-timepicker.bundle.min.js',
                            depends: {
                                ionic: 'angular'
                            },
                            exports: null
                        },
                        'ionic-datepicker': {
                            path: 'ionic/lib/ionic-datepicker/dist/ionic-datepicker.bundle.min.js',
                            depends: {
                                ionic: 'angular'
                            },
                            exports: null
                        }
                    }
                }
            },
            app: {
                files: {
                    'build/app.js': ['client/src/main.js']
                },
                options: {
                    transform: ['ractivate', 'hbsfy'],
                    external: ['jquery', 'underscore', 'backbone', 'backbone.marionette', 'moment', 'fullcalendar']
                }
            },
            test: {
                files: {
                    'build/tests.js': [
                        'client/spec/**/*.test.js'
                    ]
                },
                options: {
                    transform: ['ractivate', 'hbsfy'],
                    external: ['jquery', 'underscore', 'backbone', 'backbone.marionette']
                }
            }
        },

        less: {
            transpile: {
                files: {
                    'ionic/www/css/<%= pkg.name %>.css': [
                        'ionic/www/css/style.css',
                        'ionic/www/css/*/css/*',
                        'ionic/www/lib/angular-ui-grid/ui-grid.min.css',
                        'ionic/less/main.less'
                    ]
                }
            }
        },

        concat: {
            'build/<%= pkg.name %>.js': ['build/vendor.js', 'build/app.js']
        },

        copy: {
            dev: {
                files: [{
                    src: 'build/<%= pkg.name %>.js',
                    dest: 'public/js/<%= pkg.name %>.js'
                }, {
                    src: 'build/<%= pkg.name %>.css',
                    dest: 'public/css/<%= pkg.name %>.css'
                }, {
                    src: 'client/img/*',
                    dest: 'public/img/'
                }]
            },
            prod: {
                files: [{
                    src: ['client/img/*'],
                    dest: 'dist/img/'
                }]
            }
        },

        // CSS minification.
        cssmin: {
            minify: {
                src: ['build/<%= pkg.name %>.css'],
                dest: 'dist/css/<%= pkg.name %>.css'
            }
        },

        // Javascript minification.
        uglify: {
            compile: {
                options: {
                    //compress: true,
                    verbose: true,
                    mangle: false
                },
                files: [{
                    'ionic/www/libs.js': [
                        <!-- In windows apps this fixes dynamic content errors -->
                        'ionic/lib/ionic/release/js/ionic.bundle.js',
                        'ionic/lib/jquery/dist/jquery.js',
                        'ionic/lib/lodash/lodash.js',
                        'ionic/lib/angular-cookies/angular-cookies.min.js',
                        'ionic/lib/angular-http-auth/src/http-auth-interceptor.js',
                        'ionic/lib/angular-messages/angular-messages.js',
                        'ionic/lib/moment/min/moment.min.js',
                        'ionic/lib/moment-timezone/builds/moment-timezone-with-data.js',
                        'ionic/lib/tzdetect/tzdetect.js',
                        'ionic/lib/jstz/jstz.js',
                        'ionic/lib/angular-ui-grid/ui-grid.js',
                        //'ionic/lib/validator-js/validator.min.js',
                        'ionic/lib/angular-gettext/dist/angular-gettext.js',
                        'ionic/lib/angular-local-storage/dist/angular-local-storage.js',
                        'ionic/lib/ionic-fancy-select/src/ionic-fancy-select.js',
                        'ionic/lib/angular-resource/angular-resource.js',
                        'ionic/lib/ionic-timepicker/dist/ionic-timepicker.bundle.min.js',
                        'ionic/lib/ionic-datepicker/dist/ionic-datepicker.bundle.min.js',
                        //'ionic/www/js/**/*.js'
                    ]
                }]
            }
        },

        // for changes to the front-end code
        watch: {
            scripts: {
                files: ['client/templates/**/*', 'client/src/**/*.js', 'views/**/*'],
                tasks: ['clean:dev', 'browserify:app', 'concat', 'copy:dev']
            },
            less: {
                files: ['ionic/less/**/*.less', 'ionic/www/css/**/style.css'],
                tasks: ['less:transpile', 'copy:dev']
            },
            test: {
                files: ['build/app.js', 'client/spec/**/*.test.js'],
                tasks: ['browserify:test']
            },
            karma: {
                files: ['build/tests.js'],
                tasks: ['jshint:test', 'karma:watcher:run']
            }
        },

        // for changes to the node code
        nodemon: {
            dev: {
                options: {
                    file: 'server.js',
                    nodeArgs: ['--debug'],
                    watchedFolders: ['controllers', 'app'],
                    env: {
                        PORT: '3300'
                    }
                }
            }
        },

        // server tests
        simplemocha: {
            options: {
                globals: [
                    'expect',
                    'sinon',
                    'models',
                    'sess',
                    'resetDatabasePromise',
                    'issue' // TODO: Where is this global coming from?
                ],
                timeout: 10000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'spec'
            },

            server: {
                src: ['spec/spechelper.js', 'spec/**/*.test.js']
                //src: ['spec/spechelper.js', 'spec/app/groups.test.js']
                //src: ['spec/spechelper.js', 'spec/app/session.test.js']
                //src: ['spec/spechelper.js', 'spec/app/shifts.test.js']
                //src: ['spec/spechelper.js', 'spec/app/users.test.js']
            }
        },

        // mongod server launcher
        shell: {
            mongo: {
                command: 'mongod',
                options: {
                    async: true
                }
            }
        },

        concurrent: {
            dev: {
                tasks: ['nodemon:dev', 'watch:scripts', 'watch:less'],
                options: {
                    logConcurrentOutput: true
                }
            },
            test: {
                tasks: ['watch:karma'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        // for front-end tdd
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            watcher: {
                background: true,
                singleRun: false
            },
            test: {
                singleRun: true
            }
        },

        jshint: {
            all: ['Gruntfile.js', 'client/src/**/*.js', 'client/spec/**/*.js'],
            dev: ['client/src/**/*.js'],
            test: ['client/spec/**/*.js']
        }
    });

    //grunt.registerTask('init:dev', ['clean', 'bower', 'browserify:vendor']);
    grunt.registerTask('init:dev', ['bower']);

    grunt.registerTask('build:dev', ['clean:dev', 'browserify:vendor', 'browserify:app', 'browserify:test', 'jshint:dev', 'less:transpile', 'uglify', 'concat', 'copy:dev']);
    grunt.registerTask('build:prod', ['clean:prod', 'browserify:vendor', 'browserify:app', 'jshint:all', 'less:transpile', 'concat', 'cssmin', 'uglify', 'copy:prod']);

    grunt.registerTask('heroku', ['init:dev', 'build:dev']);

    //grunt.registerTask('server', ['build:dev', 'concurrent:dev']);
    grunt.registerTask('server', ['concurrent:dev']);
    grunt.registerTask('test:server', ['concurrent:dev', 'simplemocha:server']);

    grunt.registerTask('test:client', ['karma:test']);
    grunt.registerTask('tdd', ['karma:watcher:start', 'concurrent:test']);

    grunt.registerTask('test', ['test:server', 'test:client']);
};
