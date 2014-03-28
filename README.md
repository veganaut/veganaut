monkey-face
===========

This is the frontend to monkey-tail. Together they're OperationMonkey, i.e. they're going to be a gamified platform (website and phonegap app) helping the international vegan/vegetarian movement to grow faster, be more effective and include a more diverse range of people.

Getting Started
---------------

To run monkey, you'll need to install [nodejs](http://nodejs.org/) and [mongodb](http://www.mongodb.org/).

After that checkout monkey-tail and monkey-face:

    git clone https://github.com/OperationMonkey/monkey-tail.git
    git clone https://github.com/OperationMonkey/monkey-face.git

Install the dependencies using npm:

    (cd monkey-tail; npm install)
    (cd monkey-face; npm install)

Start mongodb if it isn't already running:

    mkdir testdb
    mongod --dbpath testdb

Load the fixtures:

    cd monkey-tail; node ./test/fixtures/basic.js

Start the backend:

    cd monkey-tail; node app.js

If you edit the code, you need to restart the backend.
[Supervisor](https://github.com/isaacs/node-supervisor) will watch the files for you and restart the backend. Install supervisor globally:

    sudo npm install -g supervisor

Then start the server through supervisor:

    cd monkey-face; supervisor app.js

Compile less and start the frontend:

    cd monkey-face
    ./node_modules/.bin/lessc app/less/master.less > app/css/master.css
    node scripts/web-server.js
    open http://localhost:8000/app/index.html


Running Tests
-------------

### Full End-to-End Tests
The backend has a secondary server running so that the frontend can tell it which fixtures to load.
You need to have Chromium (or Chrome) installed to run these (that's gonna change, don't worry).

The tests use [protractor](https://github.com/angular/protractor) which uses Selenium. Selenium can be installed with:

    cd monkey-tail; ./node_modules/protractor/bin/webdriver-manager update

Then, start the e2eBridge,

    cd monkey-tail; supervisor e2eBridge.js

and run protractor in another terminal for running the tests:

    cd monkey-face; ./node_modules/.bin/protractor config/protractor.conf.js

### Backend Tests
Backend integration (end-to-end) tests:

    ./node_modules/.bin/jasmine-node test/e2e/

Backend unit tests:

    ./node_modules/.bin/jasmine-node test/models/

### Frontend Tests
The frontend unit tests use [Karma](https://github.com/karma-runner/karma). Start Karma with:

    ./scripts/unit-test.sh
    open http://localhost:9876/

Karma will automatically rerun all your tests if you change the code.
