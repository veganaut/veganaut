/* global by */
'use strict';

/**
 * Holds the protractor instance we are currently bound to
 */
var ptor;

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
    }
};

// Protractor runs in Node, so use module syntax to export functionality
module.exports = helpers;
