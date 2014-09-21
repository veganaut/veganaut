// An example configuration file.
exports.config = {
    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome'
//        'browserName': 'firefox'
    },

    baseUrl: 'http://127.0.0.1:8000/',

    // Spec patterns are relative to the location of this config.
    suites: {
        full: '../test/e2e/**/*Test.js'
    },

    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    }
};
