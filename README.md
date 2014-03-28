monkey-face
===========

This is the frontend to monkey-tail. Together they're OperationMonkey, i.e. they're going to be a gamified platform (website and phonegap app) helping the international vegan/vegetarian movement to grow faster, be more effective and include a more diverse range of people.

Getting Started
---------------

To run monkey, you'll need to install [nodejs](http://nodejs.org/) and [mongodb](http://www.mongodb.org/).

After that checkout monkey-tail and monkey-face:

    git clone git@github.com:OperationMonkey/monkey-tail.git
    git clone git@github.com:OperationMonkey/monkey-face.git

Install the dependencies using npm:

    (cd monkey-tail; npm install)
    (cd monkey-face; npm install)

Start mongodb if it isn't already runing:

    mongodb --db testdb

Or, depending on your installation:

    mongod

Start the backend:

    cd monkey-tail; node app.js

Start the frontend:

    cd monkey-face; node scripts/web-server.js
    open http://localhost:8000/app/index.html
