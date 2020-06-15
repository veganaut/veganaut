module.exports = function(config) {
    'use strict';
    config.set({
        // Base path, that will be used to resolve files and exclude
        basePath: '../',

        // List of files / patterns to load in the browser
        files: [
            'app/lib/lodash/lodash.js',
            'app/lib/angular/angular.js',
            'app/lib/angular-route/angular-route.js',
            'node_modules/angular-mocks/angular-mocks.js',
            'app/lib/leaflet/dist/leaflet-src.js',
            'app/veganaut/app.js',
            'app/components/ui/vgUiModule.js',
            'app/components/**/*.js',
            'app/veganaut/**/*.js',
            'test/unit/**/*.js'
        ],

        // List of files to exclude
        exclude: [
        ],

        // Test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress'],

        // Enable / disable colors in the output (reporters and logs)
        colors: true,

        // Level of logging
        // Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // Enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Frameworks to use
        frameworks: ['jasmine'],

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: false
    });
};
