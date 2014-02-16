(function() {
    'use strict';

    /* Services */

    // Demonstrate how to register services
    // In this case it is a simple value service.
    var monkeyFaceServices = angular.module('monkeyFace.services', []);

    monkeyFaceServices.value('version', '0.0.1');

    monkeyFaceServices.value('d3', window.d3);

    monkeyFaceServices.value('backendUrl', 'http://localhost:3000');

    /**
     * nodeProvider provides the nodes and links for the social graph
     */
    monkeyFaceServices.provider('nodeProvider', function() {
        var nodes = [];
        var links = [];
        var isStable = false;

        this.$get = ['backend', function(backend) {
            return {
                getNodes: function(cb) {
                    backend.getGraph()
                        .success(function(data) {
                            isStable = false;
                            nodes = [];
                            links = [];

                            var nodeIdToIndexMap = {};

                            // Backend gives an object indexed by node id
                            // We need an array
                            for (var nodeId in data.nodes) {
                                if (data.nodes.hasOwnProperty(nodeId)) {
                                    nodes.push(data.nodes[nodeId]);
                                    nodeIdToIndexMap[nodeId] = nodes.length - 1;
                                }
                            }

                            // Change referenced from node id to indices
                            for (var i = 0; i < data.links.length; i++) {
                                var link = data.links[i];
                                link.source = nodeIdToIndexMap[link.source];
                                link.target = nodeIdToIndexMap[link.target];
                                links.push(link);
                            }

                            // Add a dummy
                            nodes.push({
                                fullName: 'Mister Dummy',
                                type: 'dummy'
                            });

                            // Or two
                            nodes.push({
                                fullName: 'Miss Dummy',
                                type: 'dummy'
                            });

                            cb(nodes, links);
                        })
                        .error(function(data, statusCode) {
                            console.log('Error requesting graph data', data, statusCode);
                        })
                    ;

                },
                isStable: function() {
                    return isStable;
                },
                setStable: function(stable) {
                    isStable = stable;
                }
            };
        }];
    });

    /**
     * localProvider provides the translation strings
     */
    monkeyFaceServices.provider('localeProvider', function() {
        var translations = {
            'app.title': 'Irgendwas',
            'navigation.register': 'Registrieren',
            'navigation.login': 'Login',
            'navigation.logout': 'Logout',
            'navigation.avatar': 'Mein Graph',
            'form.referenceCode.placeholder': 'Referenz-Code eingeben',
            'form.referenceCode.submit': 'Code absenden',
            'register.title': 'Registrieren',
            'message.registered': 'Registrierung erfolgreich.',
            'register.form.email': 'email@beispiel.com',
            'register.form.fullName': 'Vorname und Nachname',
            'register.form.password': 'Passwort',
            'register.form.passwordRepeat': 'Nochmals Passwort',
            'register.form.submit': 'Registrieren',
            'login.title': 'Login',
            'login.form.email': 'email@beispiel.com',
            'login.form.password': 'Passwort',
            'action.forgotPassword': 'Passwort vergessen?',
            'action.register': 'Registrieren',
            'login.form.submit': 'Login',
            'activityLink.title': 'Neue Aktivität',
            'activityLink.form.targetName': 'Mit wem? / Für wen?',
            'activityLink.label.targetName': 'Mit wem? / Für wen?',
            'activityLink.form.choose': 'Was?',
            'activityLink.form.location': 'Wo?',
            'activityLink.form.startTime': 'Wann?',
            'activityLink.form.submit': 'Speichern und Weiter',
            'message.activityLinkCreated': 'Aktivität erstellt.',
            'socialGraph.title': 'Mein Netzwerk'
        };

        this.$get = function() {
            return {
                translations: translations
            };
        };
    });

    /**
     * TODO: shouldn't need a provider for this
     * But how else do hand around the node that was selected
     * from the graph to the form?
     * activityLinkTargetProvider
     */
    monkeyFaceServices.provider('activityLinkTargetProvider', function() {
        var target;

        this.$get = function() {
            return {
                get: function() {
                    return target;
                },
                set: function(newTarget) {
                    target = newTarget;
                }
            };
        };
    });


    /**
     * Interface with the backend
     */
    monkeyFaceServices.provider('backend', function() {
        var $http;
        var backendUrl;

        /**
         * The session id of the current user
         */
        var sessionId;

        /**
         * Person id is set if the user entered a reference code but is not
         * logged in
         */
        var personId;

        /**
         * Handles a login with the given session id
         * @param sid
         */
        var handleLogin = function(sid) {
            if (angular.isString(sid)) {
                sessionId = sid;
                sessionStorage.setItem('sid', sid);
                $http.defaults.headers.common.Authorization = 'MonkeyBearer ' + sid;
            }
        };

        /**
         * Logs the user out (removes the session)
         */
        var handleLogout = function() {
            sessionId = undefined;
            sessionStorage.removeItem('sid');
            $http.defaults.headers.common.Authorization = undefined;
        };

        /**
         * Returns whether the user is currently logged in
         * @returns {boolean}
         */
        var isLoggedIn = function() {
            return (angular.isString(sessionId));
        };

        /**
         * Returns whether there is a valid person id set
         * @returns {boolean}
         */
        var hasValidPersonId = function() {
            return (angular.isString(personId));
        };

        /**
         * Returns whether the user is allowed to view the graph
         * @returns {boolean}
         */
        var canViewGraph = function() {
            return isLoggedIn() || hasValidPersonId();
        };

        /**
         * Registers a new user. If the user has already entered a reference
         * code, the person from that activity's target will be used.
         * @param email
         * @param fullName
         * @param password
         * @returns {promise}
         */
        var register = function(email, fullName, password) {
            var postData = {
                email: email,
                fullName: fullName,
                password: password
            };

            // If we already have a person id, register as that person
            if (personId) {
                postData._id = personId;
            }

            return $http.post(backendUrl + '/person', postData);
        };

        /**
         * Sends the login request to the backend
         *
         * @param email
         * @param password
         * @returns {promise} promise returned from $http.post
         */
        var login = function(email, password) {
            return $http.post(backendUrl + '/session', {email: email, password: password})
                .success(function(data) {
                    handleLogin(data.sessionId);
                })
                .error(handleLogout);
        };

        /**
         * Sends the logout request to the backend
         * @returns {promise} promise returned from $http.delete
         */
        var logout = function() {
            // TODO: make sure we are logged in first
            return $http.delete(backendUrl + '/session')
                .success(handleLogout)
                .error(handleLogout);
        };

        /**
         * Sends the get activity list request to the backend
         * @returns {promise} promise returned from $http.get
         * TODO: cache this list for a while
         */
        var getActivities = function() {
            // TODO: make sure we are logged in first
            return $http.get(backendUrl + '/activity');
        };

        /**
         * Sends the get graph request to the backend
         * @returns {promise} promise returned from $http.get
         */
        var getGraph = function() {
            var person;
            if (isLoggedIn()) {
                person = 'me';
            }
            else if (hasValidPersonId()) {
                person = personId;
            }
//            else {
//                // TODO: return failed promise
//            }

            return $http.get(backendUrl + '/graph/' + person);
        };

        /**
         * Posts a new activity link with the given data to the backend
         * @param person Either a name of a person to create or a person object
         * @param location
         * @param startDate
         * @param activity
         * @returns {promise} promise returned from $http.post
         */
        var addActivityLink = function(person, location, startDate, activity) {
            // TODO: make sure we are logged in first
            var target = {};
            if (angular.isString(person)) {
                // Create a person object
                target.fullName = person;
            }
            else {
                target.id = person.id;
            }

            // Prepare the data to post
            var postData = {
                targets: [target],
                location: location,
                startDate: startDate
            };

            // Add activity if given
            if (activity) {
                postData.activity = {
                    id: activity.id
                };
            }
            return $http.post(backendUrl + '/activityLink', postData);
        };

        var submitReferenceCode = function(referenceCode) {
            var postData = {
                referenceCode: referenceCode
            };

            return $http.post(backendUrl + '/activityLink/reference', postData)
                .success(function(data) {
                    // TODO: validate id?
                    personId = data.targets[0];
                })
                ;
        };


        /**
         * Returns this service
         * @type {*[]}
         */
        this.$get = ['$http', 'backendUrl', function(_$http_, _backendUrl_) {
            $http = _$http_;
            backendUrl = _backendUrl_;

            // Try to get session sid from storage
            handleLogin(sessionStorage.getItem('sid'));

            return {
                isLoggedIn: isLoggedIn,
                canViewGraph: canViewGraph,
                register: register,
                login: login,
                logout: logout,
                getActivities: getActivities,
                getGraph: getGraph,
                addActivityLink: addActivityLink,
                submitReferenceCode: submitReferenceCode
            };
        }];
    });

    // TODO: docu & tests
    monkeyFaceServices.provider('alertProvider', function() {
        var alerts = [];

        this.$get = function() {
            return {
                alerts: alerts,
                addAlert: function(message, type) {
                    alerts.push({
                        message: message,
                        type: type || 'info'
                    });
                },
                removeAlert: function(alert) {
                    for (var i = 0; i < alerts.length; i++) {
                        if (alerts[i] === alert) {
                            alerts.splice(i, 1);
                            break;
                        }
                    }
                }
            };
        };
    });
})();
