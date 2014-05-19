// An example configuration file.
exports.config = {
    // Do not start a Selenium Standalone sever - only run this using chrome.
    chromeOnly: true,
    chromeDriver: '../node_modules/protractor/selenium/chromedriver',

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome'
    },

    // Spec patterns are relative to the location of this config.
    // Suites may be used. When run without a command line parameter,
    // all suites will run. If run with --suite=frontPage, only the patterns matched
    // by that suite will run.
    suites: {
        full: '../test/e2e/**/*Test.js',
        authentication: '../test/e2e/authenticationTest.js',
        frontPage: '../test/e2e/frontPageTest.js',
        profile: '../test/e2e/profileTest.js',
        referenceCodes: '../test/e2e/referenceCodesTest.js',
        register: '../test/e2e/registerTest.js',
        socialGraph: '../test/e2e/socialGraphTest.js'
    },

    baseUrl: 'http://127.0.0.1:8000/',

    // Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    }
};
