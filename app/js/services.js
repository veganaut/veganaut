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
        var dataRequested = false;

        this.$get = ['backend', function(backend) {
            return {
                getNodes: function(cb) {
                    if (dataRequested) {
                        cb(nodes, links);
                        return;
                    }
                    backend.getGraph()
                        .success(function(data) {
                            nodes = data.nodes;
                            links = data.links;
                            dataRequested = true;
                            cb(nodes, links);
                        })
                        .error(function(data, statusCode) {
                            console.log('Error requesting graph data', data, statusCode);
                            dataRequested = true;
                        })
                    ;

                },
                isStable: isStable
            };
        }];
    });

    /**
     * localProvider provides the translation strings
     */
    monkeyFaceServices.provider('localeProvider', function() {
        var translations = {
            'activityLink.form.choose': '-- choose an activity --',
            'activityLink.form.targetName': 'Whom do you do this with',
            'activityLink.form.location': 'Where do you do this',
            'activityLink.form.startTime': 'When do you do this',
            'activityLink.form.submit': 'Start Activity'
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
        var login = function(email, password) {
            return $http.post(backendUrl + '/session', {email: email, password: password});
        };

        var getGraph = function() {
            // TODO: make sure we are logged in first
            return $http.get(backendUrl + '/graph/me');
        };

        this.$get = ['$http', 'backendUrl', function(_$http_, _backendUrl_) {
            $http = _$http_;
            backendUrl = _backendUrl_;
            return {
                login: login,
                getGraph: getGraph
            };
        }];
    });
})();
