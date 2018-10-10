Veganaut Changelog
==================

ongoing:
-------------------------------------------

1.0.0: (2018-10-10)
-------------------------------------------
- New design.
- New panorama page.
- All location updates done as individual tasks.
- Clear separation of info tasks and veganize tasks.
- Possibility to mark a location as closed.
- Clearer navigation between different location & product views.
- Better aggregation of multiple ratings (one person only gets one vote).
- New database (PostgreSQL instead of MongoDB).

0.11.0: Much Products (2017-06-28)
-------------------------------------------
* New feature: Dedicated page for products.
* Enhancement: Pagination on the location list page is done through the backend.
* Translations: Completed and corrected French translations.

0.10.0: Such Forgetfulness (2017-02-08)
-------------------------------------------
It's been a while. There have been many changes. Too many to list them all.
But for the occasion of commit number 1000, we'll make a release.
And we'll promise to make more regular named and numbered releases again.

Also, it's not like semantic versioning makes any sense here, but we'll
just keep on putting a zero before and after the actual version number.

0.9.0: Structured Intrigue (2015-12-20)
-------------------------------------------
* New feature: Locations can now be shown in a list (around a center in a given radius).
* New feature: Removing the need to provide anything else than the e-mail when registering.
* New feature: Sending a welcome e-mail to newly registered users with a link to set a password.
* New feature: Showing part of the description and product with rating in the location preview on the map.
* Enhancement: Improving the password fields (no password repeat and possibility to view the password).
* Enhancement: Unified the styles of all the list views and made it more obvious that elements can be opened.
* Enhancement: Unified the styles of displaying products (available / temporarily unavailable / unavailable).

0.8.0: O sole mio (2015-10-20)
-------------------------------------------
* New feature: French version of Veganaut.
* New feature: Locations are now owned by users, not teams. There are no more teams.
* New feature: [Veganaut can now be embedded in another page](http://blog.veganaut.net/2015/05/how-to-embed-the-veganaut-map-on-your-page/).
* New feature: Product names and availability can now be edited.
* New feature: Adding a button on the map that takes you to where you are currently located (using GPS or whatever the device offers).
* Enhancement: Page showing stats and highscores about Veganaut is now called "Community" and shows ranking of user by owned locations and by missions.
* Enhancement: Better display name of search results from OpenStreetMap Nominatim service.
* Enhancement: Only showing gastronomy location options in the product browser ("Vegan Menu" button on the map).
* Performance: Only loading the locations that are in the currently visible map section.
* Security: Map tiles are now loaded over https like the rest of the page.
* Bug fixes: Many.
* Dependencies: Upgrading to Angular 1.4, Mongoose 4.1 and many other minor upgrades.
* Dependencies: Removing dependency on jQuery and D3.js.

0.7.0: Sharing is Caring (2015-04-12)
-------------------------------------------
* New feature: current map coordinates and zoom level now included in page url (i.e. users can now share links to specific map sections)
* New feature: there's now a 6th team with its dedicated colour in addition to the 5 player team: the NPC-team, i.e. a team of non-player characters (currently: admins) who don't get points by completing missions and don't feature in the high scores etc.
* Enhancement: Locations dots on the map now feature the symbol corresponding to their type (i.e. gastronomy or retail) and appear bigger & more opaque or smaller & less opaque based on their offerQuality. Also, the locations with the higher offerQuality are now on top of the others, which makes them easier to see and click when zoomed out. 

0.6.0: Cartwheelbarrow (2015-03-29)
-------------------------------------------
* New feature: homepage which explains the basics about the site and the game and the game's background story
* Enhancement: location preview now features the top-rated vegan option and the number of additional options available; also, it now shows the location's average effortValue rating
* Enhancement: search is now responsive to chosen language and always shows the city/town/village of suggested search results
* Enhancement: add location workflow is now more intuitive and less error-prone
* Enhancement: exact position and type of location can now be edited
* Enhancement: website field in location edit form now accepts urls without "http://"


0.5.0: Public Panda (2015-03-17)
-------------------------------------------
* New feature: filter map based on location type (gastronomy/shopping)
* New feature: Product Browser: push button to show list of products available at the locations in the currently visible map section (ordered by rating)
* New feature: completing missions now affects four newly added profile attributes (pioneer, diplomat, evaluator, gourmet) depending on type of mission and, in case of the pioneer attribute, on whether you're the first to complete certain missions at that location
* New feature: every player now has a public profile (nickname, number of missions completed, scores for pioneer, diplomat, evaluator and gourmet attributes) that can be accessed by clicking on that player's name in the teams view
* Enhancement: average of effortValue missions shown as a weather icon in location details view
* Enhancement: larger map area visible thanks to fancy transparent design; added veganaut logo


0.4.0: Tasmanian Turbo Tractor (2015-01-11)
-------------------------------------------
* New feature: Veganaut is now available in English and German
* New feature: Password reset functionality
* New feature: Search on the map (only places from Open Street Map, not Veganaut locations)
* New feature: Possibility to only show locations with recent activity
* Enhancement: Show time of last mission and recently active Veganauts on the location page


0.3.0: Sicilian Speech Bubble (2014-12-23)
------------------------------------------
* Enhancement: Massive performance improvement on the map


0.2.0: Uygurian Twist (2014-12-14)
----------------------------------
* Enhanced "location details" view: location description and homepage link
* Average of rateOptions missions now shown in location details view
* New: teams view (rankings of teams and players)
* Simplified location conquering mechanics
* Adding locations now supported by search functionality


0.1.0: Private Beta (2014-10-06)
--------------------------------
* First version of the map game: 5 teams, adding & conquering locations by completing missions
* Rating-missions: offerQuality (average rating shown on map), effortValue (not shown anywhere yet), rateOptions (not shown anywhere yet)
* Plus a few other missions
* Register and login, basic profile administration (name, nickname, email, password)
* Feedback-form
