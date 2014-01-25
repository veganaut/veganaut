module.exports = function(config) {
    'use strict';
    config.set({
        // Base path, that will be used to resolve files and exclude
        basePath: '../',

        // List of files / patterns to load in the browser
        files: [
            'test/e2e/**/*.js'
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
        autoWatch: false,

        // Frameworks to use
        frameworks: ['ng-scenario'],

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
        singleRun: true,

        proxies: {
            '/': 'http://localhost:8000/'
        }
    });
};
