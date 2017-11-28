/* global describe, beforeEach, it, expect, browser, element, by */
'use strict';

var helpers = require('./helpers');

describe('search.', function() {
    beforeEach(function() {
        // Tell backend to reload the fixtures
        helpers.loadFixtures();

        // Go to the app
        helpers.loadApp('/');
    });

    it('can search locations and geo results.', function() {
        var searchButton = element(by.css('.navbar-btn-search'));
        expect(searchButton.isPresent()).toBe(true, 'search button is present');
        searchButton.click();

        var input = element(by.model('globalSearchVm.searchService.searchString'));
        expect(input.isPresent()).toBe(true, 'now shows an input field');
        input.sendKeys('shop\n');

        var locationResults = element(by.css('.location-search-results'));
        expect(locationResults.isDisplayed()).toBe(true, 'shows location results');
        expect(locationResults.getText()).toContain('Reformhaus Ruprecht', 'found Ruprecht (has shop in description)');

        // Click on Ruprecht (the last result)
        locationResults.all(by.css('button')).last().click();
        expect(browser.getCurrentUrl()).toMatch(/\/location\/000000000000000000000007/, 'Goes to location page');

        searchButton.click();
        expect(input.getAttribute('value')).toBe('shop', 'still has the same search string');
        expect(locationResults.isDisplayed()).toBe(true, 'still shows location results');

        input.clear();
        input.sendKeys('berlin\n');
        var geoResults = element(by.css('.geo-search-results'));
        expect(locationResults.isPresent()).toBe(false, 'no location results');
        expect(geoResults.isDisplayed()).toBe(true, 'shows geo results');
        expect(geoResults.getText()).toContain('Berlin', 'found Berlin');
        geoResults.all(by.css('button')).first().click();
        expect(browser.getCurrentUrl()).toMatch(/\/map\/\?zoom=[0-9]+&coords=52\.5[0-9]+,13\.3[0-9]+/, 'shows map of berlin');

        searchButton.click();
        expect(geoResults.isDisplayed()).toBe(true, 'still shows geo results');
    });
});
