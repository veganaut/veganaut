'use strict';
/**
 * Gulp build file for Veganaut.
 * The build is work in progress and is not fully functional yet.
 */
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var ejs = require('gulp-ejs');
var tap = require('gulp-tap');
var ngHtml2Js = require('gulp-ng-html2js');
var minifyHtml = require('gulp-minify-html');
var browserSync = require('browser-sync').create();

// Error notification settings for plumber.
// Plumber makes shure watcher tasks don't stop when an error occurs
var plumberErrorHandler = {
    errorHandler: function(error) {
        console.log(error.message);
        this.emit('end');
    }
};

var files = {
    js: [
        'app/components/ui/vgUiModule.js',
        'app/components/**/*.js',
        'app/veganaut/app.js',
        'app/veganaut/**/*.js'
    ],
    jsLib: [
        'app/lib/lodash/lodash.js',
        'app/lib/angular/angular.js',
        'app/lib/leaflet/dist/leaflet-src.js',
        'app/lib/angular-route/angular-route.js',
        'app/lib/angular-sanitize/angular-sanitize.js',
        'app/lib/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js',
        'app/lib/angular-loading-bar/build/loading-bar.js',
        'app/lib/angular-simple-logger/dist/angular-simple-logger.light.js', // Needed for angular-leaflet-directive
        'app/lib/angular-leaflet-directive/dist/angular-leaflet-directive.js',
        'app/lib/angular-translate/angular-translate.js',
        'app/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.js'
    ],
    less: 'app/main.less',
    templates: 'app/**/*.tpl.html',
    index: 'app/index.ejs',
    watch: 'app/**/*',
    watchLess: ['app/**/*.less'],
    watchJs: ['app/components/**/*.js', 'app/veganaut/**/*.js'],
    watchTemplates: ['app/**/*.tpl.html']
};

gulp.task('js', ['ngTemplateConcat'], function() {
    return gulp.src(files.js)
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/build/'))
        ;
});

// TODO: don't minify libs ourselves, use the provided min versions (when available)
gulp.task('jsLib', function() {
    return gulp.src(files.jsLib)
        .pipe(concat('lib.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/build/'))
        ;
});

gulp.task('less', function() {
    return gulp.src(files.less)
        .pipe(plumber(plumberErrorHandler))
        .pipe(less({
            compress: true
            // TODO: add urlArgs, but need to split up the vendor css from our own
        }))
        .pipe(postcss([autoprefixer()]))
        .pipe(rename('master.min.css'))
        .pipe(gulp.dest('app/build/'))
        .pipe(browserSync.stream());
    ;
});

gulp.task('ngTemplateConcat', function() {
    // Name of the angular module that we'll create
    var moduleName = 'veganaut.app.templates';

    // Add the file we create to the list of js files
    files.js.push('app/build/templates.js');
    return gulp.src(files.templates)
    // First minify the html
        .pipe(minifyHtml({
            empty: true,
            spare: true,
            loose: true,
            quotes: true
        }))

        // Then convert to js with a custom template, to only have the angular.module definition once
        .pipe(ngHtml2Js({
            template: '$templateCache.put(\'<%= template.url %>\',\'<%= template.prettyEscapedContent %>\');',
            moduleName: moduleName,
            prefix: '/'
        }))

        // Put it all in one file
        .pipe(concat('templates.js'))

        // Surround it with the angular.module definition
        .pipe(tap(function(file) {
            file.contents = Buffer.concat([
                new Buffer('angular.module(\'' + moduleName + '\', []).run([\'$templateCache\', function($templateCache) {'),
                file.contents,
                new Buffer('}]);')
            ]);
        }))

        // Save it. TODO: would be better to pass it directly to the 'js' task
        .pipe(gulp.dest('app/build/'))
        ;
});

// TODO: find better way to pass results between tasks
var webPathJsFiles = [];

/**
 * Creates a list of all js files with their full web path
 */
gulp.task('listJsFiles', function() {
    var basePath = __dirname + '/app';
    return gulp.src([].concat(files.jsLib, files.js))
        .pipe(tap(function(file) {
            if (file.path.indexOf(basePath) === 0) {
                var webPath = file.path.slice(basePath.length);
                webPathJsFiles.push(webPath);
            }
        }))
        ;
});

// TODO: find a better way to create dev and prod index
var createIndex = function(jsFiles) {
    return gulp.src(files.index)
        .pipe(ejs({
            jsFiles: jsFiles || [],
            bust: Date.now() % 100000 // TODO: make a better bust
        }))
        .pipe(gulp.dest('app/'))
        ;
};

gulp.task('indexDev', ['listJsFiles'], function() {
    return createIndex(webPathJsFiles);
});

gulp.task('indexProduction', function() {
    return createIndex();
});

gulp.task('serve-reload', ['indexDev'], function(done) {
    // Used for hard reload incase we are not able to hot reload
    browserSync.reload();
    done();
});

gulp.task('serve', ['less', 'indexDev'], function() {
    browserSync.init({
        proxy: 'localhost:8000'
    });

    gulp.watch(files.watchLess, ['less']);
    gulp.watch(files.watchJs.concat(files.watchTemplates), ['serve-reload']);
});

gulp.task('watch', ['serve']);

gulp.task('dev', ['less', 'indexDev']);

gulp.task('production', ['js', 'jsLib', 'less', 'indexProduction']);
