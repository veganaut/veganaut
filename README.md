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
Supervisor will watch the files for you and restart the backend. Install supervisor globally:

    sudo npm install -g supervisor

Then start the server through supervisor:

    cd monkey-face; supervisor -w app.js,app,test app.js

Compile less and start the frontend:

    cd monkey-face
    ./node_modules/.bin/lessc app/less/master.less > app/css/master.css
    node scripts/web-server.js
    open http://localhost:8000/app/index.html
