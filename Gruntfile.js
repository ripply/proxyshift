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

        less: {
            transpile: {
                files: {
                    'ionic/www/css/<%= pkg.name %>.css': [
                        'ionic/www/css/style.css',
                        'ionic/www/css/*/css/*',
                        'ionic/www/lib/angular-ui-grid/ui-grid.min.css',
                        'ionic/www/lib/ng-material-floating-button/mfb/dist/mfb.css',
                        'ionic/less/main.less'
                    ],
                    'static/css/login-form-style.css': [
                        'static/css/form-elements.css',
                        'static/css/login-form-style.less'
                    ],
                    'static/css/style.css': [
                        'bower_components/font-awesome/css/font-awesome.css',
                        'bower_components/bootstrap/dist/css/bootstrap.css',
                        'static/css/owl.carousel.css',
                        'static/css/owl.theme.css',
                        'static/css/responsive.css',
                        'static/css/style.less'
                    ]
                }
            }
        },

        concatt: {
            'build/<%= pkg.name %>.js': ['build/vendor.js', 'build/app.js']
        },

        concat : {
            options: {
                //sourceMap :true
            },
            index: {
                src: [
                    'static/partials/main.header.html',
                    'static/partials/main.header.includes.html',
                    'static/partials/main.header.body.html',
                    'static/partials/main.body.html',
                    'static/partials/main.footer.nonsticky.html',
                    'static/partials/main.footer.content.html',
                    'static/partials/main.body.javascript.html',
                    'static/partials/main.end.html'
                ],
                dest: 'static/index.html'
            },
            contactusfail: {
                src: [
                    'static/partials/main.header.html',
                    'static/partials/main.header.body.html',
                    'static/partials/contactusfail.body.html',
                    'static/partials/main.footer.sticky.html',
                    'static/partials/main.footer.content.html',
                    'static/partials/main.end.html'
                ],
                dest: 'static/contactusfail.html'
            },
            contactussuccess: {
                src: [
                    'static/partials/main.header.html',
                    'static/partials/main.header.body.html',
                    'static/partials/contactussuccess.body.html',
                    'static/partials/main.footer.sticky.html',
                    'static/partials/main.footer.content.html',
                    'static/partials/main.end.html'
                ],
                dest: 'static/contactussuccess.html'
            },
            privacypolicy: {
                src: [
                    'static/partials/main.header.html',
                    'static/partials/privacypolicy.header.html',
                    'static/partials/main.header.body.html',
                    'static/partials/privacypolicy.body.html',
                    'static/partials/main.footer.sticky.html',
                    'static/partials/main.footer.content.html',
                    'static/partials/main.end.html'
                ],
                dest: 'static/privacy-policy.html'
            },
            termsofservice: {
                src: [
                    'static/partials/main.header.html',
                    'static/partials/privacypolicy.header.html',
                    'static/partials/main.header.body.html',
                    'static/partials/tos.body.html',
                    'static/partials/main.footer.sticky.html',
                    'static/partials/main.footer.content.html',
                    'static/partials/main.end.html'
                ],
                dest: 'static/terms-of-service.html'
            },
            handlebarsMain : {
                src: [
                    'static/partials/main.header.html',
                    'static/partials/main.header.body.html',
                    'static/partials/main.handlebars',
                    'static/partials/main.footer.sticky.html',
                    'static/partials/main.footer.content.html',
                    'static/partials/main.end.html'
                ],
                dest: 'views/layouts/main.handlebars'
            }
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

        uglifyy : {
            options : {
                //sourceMap : true,
                //sourceMapIncludeSources : true,
                //sourceMapIn : '.tmp/main.js.map'
            },
            dist : {
                src  : '<%= concat.dist.dest %>',
                dest : 'ionic/www/main.min.js'
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
                    'static/js/mainlibs.min.js': [
                        'static/js/modernizr.custom.js',
                        'bower_components/jquery/dist/jquery.js',
                        'static/js/jquery.isotope.js',
                        'bower_components/bootstrap/dist/js/bootstrap.js',
                        'bower_components/smoothscroll/smoothscroll.js',
                        'static/js/owl.carousel.js'
                    ],
                    'static/js/ltie9.min.js': [
                        'bower_components/html5shiv/dist/html5shiv.js',
                        'bower_components/respond/dest/respond.src.js'
                    ],
                    'ionic/www/libs.min.js': [
                        <!-- In windows apps this fixes dynamic content errors -->
                        //'ionic/www/lib/ionic/release/js/ionic.bundle.js',
                        'ionic/www/lib/jquery/dist/jquery.js',
                        'ionic/www/lib/lodash/lodash.js',
                        'ionic/www/lib/angular-cookies/angular-cookies.min.js',
                        'ionic/www/lib/angular-http-auth/src/http-auth-interceptor.js',
                        'ionic/www/lib/angular-messages/angular-messages.js',
                        'ionic/www/lib/moment/min/moment.min.js',
                        'ionic/www/lib/moment-timezone/builds/moment-timezone-with-data.js',
                        'ionic/www/lib/tzdetect/tzdetect.js',
                        'ionic/www/lib/jstz/jstz.js',
                        'ionic/www/lib/angular-ui-grid/ui-grid.js',
                        'ionic/www/lib/angular-gettext/dist/angular-gettext.js',
                        'ionic/www/lib/angular-local-storage/dist/angular-local-storage.js',
                        'ionic/www/lib/ionic-fancy-select/src/ionic-fancy-select.js',
                        'ionic/www/lib/angular-resource/angular-resource.js',
                        'ionic/www/lib/ionic-timepicker/dist/ionic-timepicker.bundle.min.js',
                        'ionic/www/lib/ionic-datepicker/dist/ionic-datepicker.bundle.min.js',

                        //'ionic/www/lib/angular-toastr/dist/angular-toastr.tpls.js',
                        'ionic/www/js/directives/ionic-timepicker-nonmodal.directive.js',
                        'ionic/www/js/directives/ionic-timepicker-hours.directive.js',
                        'ionic/www/js/directives/ionic-timepicker-single.js',
                        //'ionic/www/lib/validator-js/validator.js',

                        'ionic/www/js/App.js',
                        'ionic/www/js/controllers/Controllers.js',
                        'ionic/www/js/controllers/AppController.js',
                        'ionic/www/js/controllers/LoginController.js',
                        'ionic/www/js/controllers/SignupController.js',
                        'ionic/www/js/controllers/MenuController.js',
                        'ionic/www/js/controllers/SettingsController.js',
                        'ionic/www/js/controllers/GroupsController.js',
                        'ionic/www/js/controllers/CreateGroupController.js',
                        'ionic/www/js/controllers/GroupSettingsController.js',
                        'ionic/www/js/controllers/GroupMembersController.js',
                        'ionic/www/js/controllers/GroupLocationsController.js',
                        'ionic/www/js/controllers/UserLocationsController.js',
                        'ionic/www/js/controllers/sendinvite/BaseSendInviteDirectiveController.js',
                        'ionic/www/js/controllers/SendInviteDirectiveController.js',
                        'ionic/www/js/controllers/createsublocation/BaseManageLocationDirectiveController.js',
                        'ionic/www/js/controllers/ManageLocationDirectiveController.js',
                        'ionic/www/js/controllers/LoginLogoutController.js',
                        'ionic/www/js/controllers/LogoutController.js',
                        'ionic/www/js/controllers/OpenShiftsController.js',
                        'ionic/www/js/controllers/ShiftsListController.js',
                        'ionic/www/js/controllers/OpenShiftsDirectiveController.js',
                        'ionic/www/js/controllers/MyShiftsController.js',
                        'ionic/www/js/controllers/MyShiftsDirectiveController.js',
                        'ionic/www/js/controllers/BaseModelController.js',
                        'ionic/www/js/controllers/shiftlist/BaseShiftListDirectiveController.js',
                        'ionic/www/js/controllers/ShiftCalendarController.js',
                        'ionic/www/js/controllers/LoadingController.js',
                        'ionic/www/js/controllers/RequestShiftController.js',
                        'ionic/www/js/controllers/popover/RequestShiftNoticeController.js',
                        'ionic/www/js/controllers/requestshifts/RequestShiftSelectLocationController.js',
                        'ionic/www/js/controllers/requestshifts/RequestShiftCreateShiftController.js',
                        'ionic/www/js/controllers/requestshifts/RequestShiftSelectUserClassController.js',
                        'ionic/www/js/controllers/GroupInvitationController.js',
                        'ionic/www/js/controllers/InvitationController.js',
                        'ionic/www/js/controllers/ManagingShiftsDirectiveController.js',
                        'ionic/www/js/controllers/ManagerController.js',
                        'ionic/www/js/controllers/ManageShiftController.js',
                        'ionic/www/js/controllers/users/BaseUsersListController.js',
                        'ionic/www/js/controllers/types/JobTypeController.js',
                        'ionic/www/js/controllers/settings/LocationEditorController.js',
                        'ionic/www/js/controllers/CreateShiftModalController.js',
                        'ionic/www/js/controllers/FilterableIncrementalSearchController.js',
                        'ionic/www/js/controllers/ShiftInfoController.js',
                        'ionic/www/js/controllers/OpenShiftsTabController.js',
                        'ionic/www/js/controllers/newshift/BaseNewShiftController.js',
                        'ionic/www/js/controllers/newshift/DateNewShiftController.js',
                        'ionic/www/js/controllers/newshift/WhenNewShiftController.js',
                        'ionic/www/js/controllers/newshift/WhereNewShiftController.js',
                        'ionic/www/js/controllers/newshift/WhoNewShiftController.js',
                        'ionic/www/js/controllers/newshift/ReviewNewShiftController.js',
                        'ionic/www/js/controllers/UserJobsController.js',
                        'ionic/www/js/controllers/ManagingJobsController.js',
                    <!-- **** DIRECTIVES **** -->
                        'ionic/www/js/shared/Validation.js',
                        'ionic/www/js/shared/ShiftShared.js',
                        'ionic/www/js/directives/ValidationDirectiveGenerator.js',
                        'ionic/www/js/directives/Directives.js',
                        'ionic/www/js/directives/LoginDirective.js',
                        'ionic/www/js/directives/LoginLogoutDirective.js',
                        'ionic/www/js/directives/UserDirective.js',
                        'ionic/www/js/directives/ShiftCalendarDirective.js',
                        'ionic/www/js/directives/ShiftListDirective.js',
                        'ionic/www/js/directives/SendInviteDirective.js',
                        'ionic/www/js/directives/CreateSubclassDirective.js',
                        'ionic/www/js/directives/ManageLocationDirective.js',
                        'ionic/www/js/directives/MyShiftsDirective.js',
                        'ionic/www/js/directives/ManagingShiftsDirective.js',
                        'ionic/www/js/controllers/GroupByDayFilter.js',
                        'ionic/www/js/directives/DividerCollectionRepeat.js',
                    <!-- **** SERVICES **** -->
                        'ionic/www/js/services/ConfigService.js',
                        'ionic/www/js/services/authentication/CsrfInterceptorService.js',
                        'ionic/www/js/services/authentication/AuthenticationService.js',
                        'ionic/www/js/services/SessionService.js',
                        'ionic/www/js/services/CookiesService.js',
                        'ionic/www/js/services/resources/Resources.js',
                        'ionic/www/js/services/LongRequestEventNotifierService.js',
                        'ionic/www/js/services/routing/StateHistoryService.js',
                        'ionic/www/js/services/InitializeServices.js',
                        'ionic/www/js/services/ResourceUpdateAggregatorService.js',
                        'ionic/www/js/services/ShiftIntervalTreeCacheService.js',
                        'ionic/www/js/services/ErrorMessageService.js',
                        'ionic/www/js/shared/PushAppIds.js',
                        'ionic/www/js/services/PushProcessingService.js',
                        'ionic/www/js/services/ShiftProcessingService.js',
                        'ionic/www/js/services/IonicService.js',
                        'ionic/www/js/services/UserSettingsService.js',
                        'ionic/www/js/services/UserInfoService.js',
                        'ionic/www/js/services/RemoteUserSettingsService.js',
                        'ionic/www/js/services/ResourceService.js',
                        'ionic/www/js/services/CreateShiftService.js',
                    ]
                }]
            }
        },

        ngtemplates:  {
            'scheduling-app': {
                src: 'ionic/www/**/*.html',
                dest: 'ionic/www/template.js',
                options: {
                    //usemin: 'dist/vendors.js' // <~~ This came from the <!-- build:js --> block
                    url:    function(url) { return url.replace('ionic/www/', ''); }
                }
            }
        },

        // for changes to the front-end code
        watch: {
            scripts: {
                files: ['client/templates/**/*', 'client/src/**/*.js', 'views/**/*'],
                tasks: ['clean:dev', 'concat', 'copy:dev']
            },
            concat: {
                files: ['static/partials/**/*'],
                tasks: ['concat']
            },
            uglify: {
                files: ['ionic/www/js/**/*.js', 'ionic/www/lib/**/*.js'],
                tasks: ['uglify']
            },
            ngtemplates: {
                files: ['ionic/www/**/*.html'],
                tasks: ['ngtemplates']
            },
            less: {
                files: [
                    'ionic/less/**/*.less',
                    'ionic/www/css/**/style.css',
                    'static/css/form-elements.css',
                    'static/css/owl.carousel.css',
                    'static/css/owl.theme.css',
                    'static/css/**/*.less',
                    'bower_components/font-awesome/css/font-awesome.css',
                    'bower_components/bootstrap/dist/css/bootstrap.css'
                ],
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
                    watchedFolders: ['controllers', 'app', 'views'],
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
                tasks: ['nodemon:dev', 'watch:less', 'watch:uglify', 'watch:ngtemplates', 'watch:concat'],
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

    grunt.loadNpmTasks('grunt-angular-templates');
};
