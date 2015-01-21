(function(module) {
    'use strict';

    /**
     * nodeService provides the nodes and links for the social graph
     */
    module.provider('nodeService', function() {
        var nodes = [];
        var links = [];
        var graphIsStable = false;

        this.$get = ['backendService', 'Node', function(backendService, Node) {
            return {
                updateData: function(cb) {
                    backendService.getGraph()
                        .success(function(data) {
                            graphIsStable = false;
                            nodes = [];
                            links = [];

                            var nodeIdToIndexMap = {};

                            // Backend gives an object indexed by node id
                            // We need an array
                            for (var nodeId in data.nodes) {
                                if (data.nodes.hasOwnProperty(nodeId)) {
                                    nodes.push(new Node(data.nodes[nodeId]));
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
                            // FIXME: This should not be part of the Node Model, but rather a SVG Button or similar
                            // Add a dummy
                            nodes.push(new Node({
                                nickname: 'Dummy',
                                type: 'dummy'
                            }));

                            // Or two
                            nodes.push(new Node({
                                nickname: 'Dummy',
                                type: 'dummy'
                            }));

                            cb();
                        })
                        .error(function(data, statusCode) {
                            console.log('Error requesting graph data', data, statusCode);
                            cb();
                        })
                    ;
                },
                getNodes: function() {
                    return nodes;
                },
                getLinks: function() {
                    return links;
                },
                isGraphStable: function() {
                    return graphIsStable;
                },
                setGraphStable: function(stable) {
                    graphIsStable = stable;
                }
            };
        }];
    });
})(window.veganaut.socialGraphModule);
