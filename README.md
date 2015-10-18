Veganaut Frontend [![Code Climate](https://codeclimate.com/github/veganaut/veganaut/badges/gpa.svg)](https://codeclimate.com/github/veganaut/veganaut)
=================

This is the frontend of Veganaut: a gamified platform (website and phonegap app) helping the international
vegan/vegetarian movement to grow faster, be more effective and include a more diverse range of people.

Getting Started
---------------

To run Veganaut, you'll need to install [nodejs](http://nodejs.org/) and
[mongodb](http://www.mongodb.org/). On a Mac, the easiest way to do so is `brew
install node mongodb`.

After that checkout veganaut and veganaut-backend:

    git clone https://github.com/veganaut/veganaut.git
    git clone https://github.com/veganaut/veganaut-backend.git

Install the dependencies using npm and let the post install script create a config
file for the backend in `veganaut-backend/app/config.js`:

    (cd veganaut; npm install)
    (cd veganaut-backend; npm install)

Start all the things:

    cd veganaut; ./scripts/run-all.sh

Load the fixtures:

    cd veganaut-backend; node ./test/fixtures/basic.js

The starting script does the following:

* Start MongoDB if it isn't already started
* Run `gulp dev` which creates the index.html file from index.ejs and compiles the less files
    * Note that at the moment there is no gulp watch task, so if you change index.ejs or any of the less files,
      you have to run `./node_modules/.bin/gulp dev` manually. If you use PHP/WebStorm,
      there is also a file watcher that recompiles the less files.
* Start the frontend web server: [http://localhost:8000/](http://localhost:8000/)
* Start the backend. [Supervisor](https://github.com/isaacs/node-supervisor) will automatically restart
the backend when the code is edited.
* Start the backend e2e bridge (needed for the e2e tests)
* Start [Karma](https://karma-runner.github.io/): [http://localhost:9876/](http://localhost:9876/)

Finally, go to [http://localhost:8000/](http://localhost:8000/) and login as foo@bar.baz with password foobar.


Code Quality Tools
------------------

This repo comes with a git-commit hook to run jshint prior to commits. To
enable it, use the following commands after cloning.

    (cd veganaut-backend/.git/ && rm -r hooks/ && ln -s ../git_hooks hooks)
    (cd veganaut/.git/ && rm -r hooks/ && ln -s ../git_hooks hooks)

You can also run JSHint like this:

    (cd veganaut; ./node_modules/.bin/jshint .)
    (cd veganaut-backend; ./node_modules/.bin/jshint .)


Running Tests
-------------

To run all the tests execute:

    cd veganaut; ./scripts/test-all.sh

### Full End-to-End Tests
The backend has a secondary server running so that the frontend can tell it which fixtures to load.
By default the tests use Chromium (or Chrome). You can change this in `config/protractor.conf.js`

The tests use [protractor](https://github.com/angular/protractor) which uses Selenium.
All of these dependencies are installed when you run `npm install`.

Protractor is run like this:

    cd veganaut; ./node_modules/.bin/protractor config/protractor.conf.js

### Backend Tests
Backend integration (end-to-end) tests:

    cd veganaut-backend; NODE_ENV=test ./node_modules/.bin/jasmine JASMINE_CONFIG_PATH=test/jasmine.json test/e2e/**

Backend unit tests:

    cd veganaut-backend; NODE_ENV=test ./node_modules/.bin/jasmine JASMINE_CONFIG_PATH=test/jasmine.json test/models/**

### Frontend Tests
The frontend unit tests use [Karma](https://github.com/karma-runner/karma) which is automatically
started by the `./scripts/run-all.sh` script. Run the tests by accessing
[http://localhost:9876/](http://localhost:9876/) with a browser.
Karma will automatically rerun all your tests if you change the code.
