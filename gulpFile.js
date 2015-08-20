'use strict';

var gulp = require('gulp'),
     inject = require('gulp-inject'),
     less = require('gulp-less'),
     plumber = require('gulp-plumber'),
     sourcemaps = require('gulp-sourcemaps'),
     template = require('gulp-template'),
     tsc = require('gulp-typescript'),
     watch = require('gulp-watch'),
     nodemon = require('nodemon'),
     Builder = require('systemjs-builder'),
     del = require('del'),
     fs = require('fs'),
     path = require('path'),
     join = path.join,
     runSequence = require('run-sequence'),

     express = require('express'),
     serveStatic = require('serve-static'),
     openResource = require('open'),

     tinylr = require('tiny-lr')(),
     connectLivereload = require('connect-livereload');

// --------------
// Configuration.
var APP_BASE = '/';

var config = {   
    PATH: {
        dest: {
            all: 'dist',
            dev: {
                all: 'dist/dev',
                lib: 'dist/dev/lib',
                css: 'dist/dev/css',
                ng2: 'dist/dev/lib/angular2.js',
                router: 'dist/dev/lib/router.js'
            }
        },
        src: {
            // Order is quite important here for the HTML tag injection.
            lib: [
              './node_modules/angular2/node_modules/traceur/bin/traceur-runtime.js',
              './node_modules/es6-module-loader/dist/es6-module-loader-sans-promises.js',
              './node_modules/es6-module-loader/dist/es6-module-loader-sans-promises.js.map',
              './node_modules/reflect-metadata/Reflect.js',
              './node_modules/reflect-metadata/Reflect.js.map',
              './node_modules/systemjs/dist/system.src.js',
              './node_modules/angular2/node_modules/zone.js/dist/zone.js',
              './node_modules/es6-promise/dist/es6-promise',
              './node_modules/jquery/dist/jquery.js',
              './node_modules/jquery/dist/jquery.js.map',
              './node_modules/bootstrap/dist/js/bootstrap.js',
              './node_modules/bootstrap/dist/css/bootstrap.css',
              './node_modules/bootstrap/dist/css/bootstrap.css.map'
            ]
        }
    },

    PORT: 3000,
    LIVE_RELOAD_PORT: 4002,

    ng2Builder: new Builder({
        paths: {
            'angular2/*': 'node_modules/angular2/es6/dev/*.js',
            rx: 'node_modules/angular2/node_modules/rx/dist/rx.js'
        },
        meta: {
            rx: {
                format: 'cjs'
            }
        }
    }),

    HTMLMinifierOpts: { conditionals: true },

    tsProject: tsc.createProject('tsconfig.json', {
        typescript: require('typescript')
    })
};

var utils = {
    getVersion: function () {
        //var pkg = JSON.parse(fs.readFileSync('package.json'));
        return '1.0.0';//pkg.version;
    },

    notifyLiveReload: function (e) {
        var fileName = e.path;
        tinylr.changed({
            body: {
                files: [fileName]
            }
        });
    },

    transformPath: function (env) {
        var v = '?v=' + this.getVersion();
        return function (filepath) {
            var filename = filepath.replace('/' + config.PATH.dest[env].all, '') + v;
            arguments[0] = join(APP_BASE, filename);
            return inject.transform.apply(inject.transform, arguments);
        };
    },

    injectableDevAssetsRef: function () {
        var src = config.PATH.src.lib.map(function (path) {
            return join(config.PATH.dest.dev.lib, path.split('/').pop());
        });

        src.push(config.PATH.dest.dev.ng2,
                 config.PATH.dest.dev.router,
                 join(config.PATH.dest.dev.all, '**/*.css'));

        return src;
    },

    templateLocals: function () {
        return {
            VERSION: this.getVersion(),
            APP_BASE: APP_BASE
        }
    },

    serveSPA: function (env) {
        var app;
        app = express().use(APP_BASE,
            connectLivereload({ port: config.LIVE_RELOAD_PORT }),
            serveStatic(join(__dirname, config.PATH.dest[env].all)));

        app.all(APP_BASE + '*', function (req, res, next) {
            res.sendFile(join(__dirname, config.PATH.dest[env].all, 'index.html'));
        });

        app.listen(config.PORT, function () {
            openResource('http://localhost:' + config.PORT + APP_BASE);
        });
    }
};

// --------------
// Clean.

gulp.task('clean', function (done) {
    del(config.PATH.dest.dev.all, done);
});

// --------------
// Build dev.

gulp.task('build.ng2', function () {
    config.ng2Builder.build('angular2/router', config.PATH.dest.dev.router, {});
    return config.ng2Builder.build('angular2/angular2', config.PATH.dest.dev.ng2, {});
});


gulp.task('build.lib', ['build.ng2'], function () {
    return gulp.src(config.PATH.src.lib)
      .pipe(gulp.dest(config.PATH.dest.dev.lib));
});

gulp.task('build.js', function () {
    var result = gulp.src(['./app/**/**/*.ts', './app/**/*.ts'])
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(tsc(config.tsProject));

    return result.js
      .pipe(sourcemaps.write())
      .pipe(template(utils.templateLocals()))
      .pipe(gulp.dest(config.PATH.dest.dev.all));
});

gulp.task('build.less', function () {
    return gulp.src('./app/less/*.less')
      .pipe(less({
          paths: [path.join(__dirname, 'less', 'includes')]
      }))
      .pipe(gulp.dest(config.PATH.dest.dev.css));
});

gulp.task('build.assets', ['build.js', 'build.less'], function () {
    return gulp.src(['./app/**/**/*.html', './content/css/*.css'])
      .pipe(gulp.dest(config.PATH.dest.dev.all));
});

gulp.task('build.index', function () {
    var target = gulp.src(utils.injectableDevAssetsRef(), { read: false });
    return gulp.src('./index.html')
      .pipe(inject(target, { transform: utils.transformPath('dev') }))
      .pipe(template(utils.templateLocals()))
      .pipe(gulp.dest(config.PATH.dest.dev.all));
});

gulp.task('build.app', function (done) {
    runSequence('build.assets', 'build.index', done);
});

gulp.task('build', function (done) {
    runSequence('build.lib', 'build.app', done);
});

// Livereload.

gulp.task('livereload', function () {
    tinylr.listen(config.LIVE_RELOAD_PORT);
});

gulp.task('demon', function () {
    nodemon({
        ignore: ['./app/typings',
            './node_modules/',
            './scripts/'
        ]
    })
});

gulp.task('watch', function (cb) {
    watch(['./app/less/**'], function (e) {
        runSequence('build.less', function () {
            utils.notifyLiveReload(e);
        });
    });
    watch(['./app/**'], function (e) {
        runSequence('build.assets', function () {
            utils.notifyLiveReload(e);
        });
    });
});

// --------------
// Test.

// To be implemented.

// --------------
// Serve dev.
gulp.task('default', ['demon', 'watch']);

gulp.task('serve', ['clean', 'build', 'livereload'], function () {
    runSequence('default', function () {
        utils.notifyLiveReload(e);
    });
    utils.serveSPA('dev');
});

// --------------
