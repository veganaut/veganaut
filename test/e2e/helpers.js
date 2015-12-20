/* global by, element, browser */
'use strict';

/**
 * Selectors for commonly used elements
 * @type {{}}
 */
var elements = {
    menuButton: element(by.css('button.menu-button')),
    logoutButton: element(by.css('button.nav-logout'))
};

var helpers = {
    GRAPH_DELAY: 800,

    /**
     * Adds style rules for easier testing
     */
    loadTestStylesheet: function() {
        // Add style rule to have all transitions have no duration
        browser.executeScript('document.styleSheets[0].insertRule("* { transition-duration: initial !important; }", 1);');
    },

    /**
     * Loads the app at the given initial URL
     * @param {string} [initialUrl='/']
     */
    loadApp: function(initialUrl) {
        // Go to the app
        initialUrl = initialUrl || '/';
        browser.get(initialUrl);
        helpers.loadTestStylesheet();
    },

    /**
     * Logs into the app
     * @param {string} [email='foo@bar.baz']
     * @param {string} [password='foobar']
     */
    login: function(email, password) {
        email = email || 'foo@bar.baz';
        password = password || 'foobar';
        helpers.goToIfNotAlreadyThere('/login');
        element(by.model('form.email')).sendKeys(email);
        element(by.model('form.password')).sendKeys(password + '\n');

        // Login doesn't always work if we don't wait a tiny bit...
        browser.sleep(1);

        // TODO: not sure why this has to be loaded again, but otherwise it doesn't work everywhere
        helpers.loadTestStylesheet();
    },

    /**
     * Log into the app but only if not already logged in
     * @param {string} [email]
     * @param {string} [password]
     */
    loginIfLoggedOut: function(email, password) {
        element(by.css('body.logged-in')).isPresent().then(function(isLoggedIn) {
            if (!isLoggedIn) {
                helpers.login(email, password);
            }
        });
    },

    /**
     * Checks if we are logged in and if yes logs out
     */
    logoutIfLoggedIn: function() {
        elements.logoutButton.isPresent().then(function(isPresent) {
            if (isPresent) {
                helpers.openMenu();
                elements.logoutButton.click();
            }
        });
    },

    /**
     * Checks if we are currently at the given URL and if not go there
     * @param {string} url
     */
    goToIfNotAlreadyThere: function(url) {
        browser.getCurrentUrl().then(function(currentUrl) {
            // Check if the currentUrl already ends with the URL
            // TODO: this test only checks that the end of the URL matches
            if (currentUrl.indexOf(url, currentUrl.length - url.length) === -1) {
                browser.get(url);
            }
        });
    },

    /**
     * Opens the main menu
     */
    openMenu: function() {
        // Make sure the stylesheet is loaded to disable animations
        helpers.loadTestStylesheet();
        elements.menuButton.click();
    },

    /**
     * Tells the backend to load the given fixtures
     * @param {string} [fixtureName='basic']
     */
    loadFixtures: function(fixtureName) {
        // TODO: this completely reloads the angular app before every test, takes forever
        fixtureName = fixtureName || 'basic';
        browser.get('/e2eBridge#/' + fixtureName);
    },

    /**
     * Exposes commonly used elements on the page
     */
    elements: elements
};

// Protractor runs in Node, so use module syntax to export functionality
module.exports = helpers;
