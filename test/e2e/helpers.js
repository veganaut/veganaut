/* global by, element, browser */
'use strict';

/**
 * Holds the protractor instance we are currently bound to
 */
var ptor;

var elements = {
    menuButton: element(by.css('button.menu-button')),
    logoutButton: element(by.css('button.nav-logout'))
};

var helpers = {
    MENU_DELAY: 100,
    GRAPH_DELAY: 800,

    /**
     * Binds the helpers to the given protractor instance
     * @param ptorInstance
     */
    bindProtractor: function(ptorInstance) {
        ptor = ptorInstance;
    },

    /**
     * Helper for selecting an item in a drop down by text
     * Taken from https://coderwall.com/p/tjx5zg
     * @param selector
     * @param item
     */
    selectOption: function(selector, item) {
        var selectList, desiredOption;

        selectList = ptor.findElement(selector);
        selectList.click();

        selectList.findElements(by.tagName('option'))
            .then(function findMatchingOption(options) {
                options.some(function(option) {
                    option.getText().then(function(text) {
                        if (item === text) {
                            desiredOption = option;
                            return true;
                        }
                    });
                });
            })
            .then(function() {
                if (desiredOption) {
                    desiredOption.click();
                }
            })
        ;
    },

    /**
     * Checks if we are logged in and if yes logs out
     */
    logoutIfLoggedIn: function() {
        elements.logoutButton.isPresent().then(function(isPresent) {
            if (isPresent) {
                elements.menuButton.click();
                browser.sleep(helpers.MENU_DELAY);
                elements.logoutButton.click();
            }
        });
    },

    /**
     * Tells the backend to load the given fixtures
     * @param {string} [fixtureName='basic']
     */
    loadFixtures: function(fixtureName) {
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
