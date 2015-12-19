var baseConfig = require('./karma-unit.conf');

module.exports = function(config) {
    'use strict';

    // Load the base config
    baseConfig(config);

    config.reporters = ['progress', 'coverage'];

    // source files, that you wanna generate coverage for
    // do not include tests or libraries
    // (these files will be instrumented by Istanbul)
    config.preprocessors = {
        'app/components/**/*.js': ['coverage'],
        'app/veganaut/**/*.js': ['coverage']
    };

    config.coverageReporter = {
        type: 'html',
        dir: 'build/coverage/'
    };
};
