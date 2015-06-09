'use strict';

var src = './src',
  dist = './public',
  nodeModules = './node_modules',
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  annotate = require('gulp-ng-annotate'),
  file = require('file'),
  path = require('path'),
  sass = require('gulp-sass'),
  minifyCSS = require('gulp-minify-css'),
  // app = express(),
  // express = require('express'),
  hbsRender = require('gulp-handlebars-render'),
  livereload = require('gulp-livereload'),
  tasks;

tasks = {
  server : {
    startExpress : function () {
      require('./server')   
    },
    startMongo : function () {
    // here the Mongod server startup
    }
  },
  watch : function () {
    // here the watches
    livereload.listen();
    gulp.watch([src + '/javascripts/*.js', src + '/modules/**/*.js', src + '/monteverdeApp.js'], ['build:modules']);
    gulp.watch([src + '/modules/**/*.sass'], ['build:styles']);
    gulp.watch(['views/layouts/template.hbs', src + '/modules/**/*.html'], ['build:templates']);
    gulp.watch([src + '/styles/*.sass', src + '/styles/*.scss'], ['build:maincss']);
  },
    build: {
    js: {
      modules: function () {
        var modules = getModules(src + '/modules/');
        modules.unshift(src + '/monteverdeApp.js');

        gulp.src(modules)
          .pipe(sourcemaps.init())
          .pipe(concat('all.min.js'))
          .pipe(annotate({single_quotes: true}))
          // .pipe(uglify())
          .pipe(sourcemaps.write())
          .pipe(gulp.dest(dist + '/javascripts/'))
          .pipe(livereload());
      },
      fallbacks : function () {
        gulp.src(nodeModules + '/ng-file-upload/src/*.swf')
          .pipe(gulp.dest(dist + '/javascripts/vendors/'))
      },
      vendors: function () {
        gulp.src([
          nodeModules + '/angular/*.min.js',
          nodeModules + '/angular-bootstrap/dist/*.min.js',
          nodeModules + '/ng-flow/dist/ng-flow-standalone.js',
          nodeModules + '/angular-ui-switch/angular-ui-switch.js',
          nodeModules + '/angular-ui-router/release/*.min.js',
          nodeModules + '/satellizer/satellizer.min.js',
          nodeModules + '/ng-dialog/js/*.min.js',
          nodeModules + '/ng-table/dist/*.min.js'
        ])
          .pipe(concat('libraries.js'))
          .pipe(gulp.dest(dist + '/javascripts/vendors/'));
        // Copy the angular map
        gulp.src(nodeModules + '/angular/*.map')
          .pipe(gulp.dest(dist + '/javascripts/vendors/'));
      }
    },
    templates: function () {
      gulp.src(src + '/modules/**/*.html')
         .pipe(gulp.dest(dist + '/views/'))
         .pipe(livereload());
    },
    angularBootstrapTemplates : function () {
      gulp.src(nodeModules + '/angular-bootstrap/template/**/*')
        .pipe(gulp.dest(dist + '/template'))
    },
    styles: {
      modules: function () {
        gulp.src(src + '/modules/**/*.sass')
          .pipe(sourcemaps.init())
          .pipe(concat('modules.min.css'))
          .pipe(sass())
          .pipe(minifyCSS())
          .pipe(sourcemaps.write())
          .pipe(gulp.dest(dist + '/stylesheets/'))
          .pipe(livereload());
      },
      libraries: function () {
        gulp.src([
            nodeModules + '/font-awesome/css/font-awesome.css',
            nodeModules + '/angular-ui-switch/angular-ui-switch.css',
            nodeModules + '/bootstrap/dist/css/bootstrap.css',
            nodeModules + '/ng-table/dist/ng-table.css'
          ])
          .pipe(sourcemaps.init())
          .pipe(concat('libraries.min.css'))
          // .pipe(minifyCSS())
          .pipe(sourcemaps.write())
          .pipe(gulp.dest(dist + '/stylesheets/libs/'));
      },
      copyFonts : function () {
        gulp.src([
            nodeModules + '/font-awesome/fonts/**/*',
            nodeModules + '/bootstrap/fonts/**/*'
          ])
          .pipe(gulp.dest(
            dist + '/stylesheets/fonts'
          ))
      },
      maincss: function () {
        gulp.src(src + '/styles/main.scss')
          .pipe(sourcemaps.init())
          .pipe(concat('monteverde.min.css'))
          .pipe(sass())
          .pipe(minifyCSS())
          .pipe(sourcemaps.write())
          .pipe(gulp.dest(dist + '/stylesheets/'))
          .pipe(livereload());
      }
    }
  }
}


/*
 * Scripts setup
 */
gulp.task('build:fallbacks', tasks.build.js.fallbacks);

/*
 * Scripts setup
 */
gulp.task('build:modules', tasks.build.js.modules);

/**
 * Set scripts (3rd party)
 */
gulp.task('build:libraries', tasks.build.js.vendors);

/**
 * copy fonts
 */
gulp.task('copy:fonts', tasks.build.styles.copyFonts);
/**
 * copy angular ui templates
 */
gulp.task('copy:angular-ui-templates', tasks.build.angularBootstrapTemplates);
/**
 * Sets css
 */
gulp.task('build:maincss', tasks.build.styles.maincss);
gulp.task('build:csslibraries', tasks.build.styles.libraries);
gulp.task('build:styles', tasks.build.styles.modules);

/**
 * Server start task
 */
gulp.task('serverExpress', tasks.server.startExpress);

/**
 * Server start task
 */
gulp.task('serverMongo', tasks.server.startMongo);

/**
 * Watch task
 */
gulp.task('watch', tasks.watch);

/**
 * Templates
 */
gulp.task('build:templates', tasks.build.templates);

/**
 * Gulp grouped tasks
 */
gulp.task('default', [
    'build:maincss',
    'build:csslibraries',
    'build:styles',
    'build:templates',
    'build:libraries',
    'copy:fonts',
    'build:modules',
    'build:fallbacks',
    'copy:angular-ui-templates',
    'watch'
  ]);




/**
 * Iterates through a given folder and find the files that match certain criteria
 * @param  {String} src path of folder to iterate
 * @return {Array} filesToCompile source of files
 */
function getModules(src) {
  var filesToCompile = [];

  // Updating 'filesToCompile' array with expected src's
  file.walkSync(src, function (dirPath, dirs, files) {
    var module = path.basename(dirPath),
      tempModuleFiles = [];

    if (files.length < 1) {
      return;
    }

    // Updating the 'tempModuleFiles' array with files of extension *.js
    for (var i = 0; i < files.length; i++) {
      if (path.extname(path.basename(files[i])) === '.js') {
        tempModuleFiles.push(files[i]);
      }
    }

    if (tempModuleFiles.length < 1) {
      return;
    }

    tempModuleFiles = tempModuleFiles.sort(function (a, b) {
      return path.basename(a, '.js') === module + '.module' ? -1 : 1;
    }).map(function (value) {
      return path.join(dirPath, value);
    });

    filesToCompile = filesToCompile.concat(tempModuleFiles);
  });

  return filesToCompile;
}