(function() {
    'use strict';

    /* Directives */
    var monkeyFaceDirectives = angular.module('monkeyFace.directives', []);

    monkeyFaceDirectives.directive('appVersion', ['version', function(version) {
        return function(scope, elem /*, attrs*/) {
            elem.text(version);
        };
    }]);


    // TODO: refactor this whole thing to make it more angularesque
    monkeyFaceDirectives.directive('socialGraph', ['d3', 'nodeProvider', function(d3, nodeProvider) {
        var isMe = function(node) {
            return node.type === 'me';
        };

        return {
            restrict: 'E',
            scope: {
                selectedNode: '=',
                selectedLink: '='
            },
            link: function(scope, element, attr) {
                // TODO: where should these helper functions go
                /**
                 * Returns the list of css classes that should be applied to
                 * the given node
                 * @param node
                 * @returns {string}
                 */
                var getNodeClasses = function(node) {
                    var klass = 'node ' + node.type;
                    if (node === scope.selectedNode) {
                        klass += ' selected';
                    }
                    return klass;
                };

                /**
                 * Returns the list of css classes that should be applied to
                 * the given link
                 * @param link
                 * @returns {string}
                 */
                var getLinkClasses = function(link) {
                    var klass = 'link';
                    if (isMe(link.target) || isMe(link.source)) {
                        klass += ' mine';
                    }
                    if (link.target === scope.selectedNode || link.source === scope.selectedNode) {
                        klass += ' selected';
                    }
                    return klass;
                };

                /**
                 * Returns the width with which the given link should be
                 * rendered
                 * @param link
                 * @returns {number}
                 */
                var getLinkWidth = function(link) {
                    if (link.target === scope.selectedNode || link.source === scope.selectedNode) {
                        return 8; // TODO: move constant somewhere
                    }
                    return Math.sqrt(link.numActivities);
                };

                /**
                 * Creates the d3 graph
                 */
                var setupGraph = function(nodes, links) {
                    var size = parseFloat(attr.size);

                    // Make a local copy
                    nodes = angular.copy(nodes);

                    // Scale coordinates to the proper size
                    for (var i = 0; i < nodes.length; i++) {
                        if (typeof nodes[i].coordX !== 'undefined') {
                            nodes[i].x = nodes[i].coordX * size;
                        }
                        if (typeof nodes[i].coordY !== 'undefined') {
                            nodes[i].y = nodes[i].coordY * size;
                        }

                        // The 'me' node should never move
                        if (nodes[i].type === 'me') {
                            nodes[i].fixed = true;
                        }
                    }

                    var force = d3.layout.force()
                        .charge(-1 * size)
                        .linkDistance(size/4)
                        .size([size, size]);

                    var zoom = d3.behavior.zoom()
                        .on('zoom', function() {
                            console.log('translate: ' + d3.event.translate + ' scale: ' + d3.event.scale);
                            zoom.translate(d3.event.translate);

                            svg.attr('transform',
                                'translate(' + d3.event.translate + ')' +
                                    ' scale(' + d3.event.scale + ')');

                        })
                        .scaleExtent([0.3, 10])
                        .on('zoomstart', function() {
                            d3.event.sourceEvent.stopPropagation();
                        });

                    var svg = d3.select(element[0]).append('svg')
                        .attr('width', size)
                        .attr('height', size)
                        .call(zoom)
                        .append('g');

                    var onNodeClick = function(node) {
                        if (d3.event.defaultPrevented) {
                            return;
                        }

                        scope.$apply(function() {
                            if (node === scope.selectedNode) {
                                scope.$root.$emit('alien.socialGraph.nodeAction', node);
                            }
                            else {
                                scope.selectedNode = node;
                            }
                        });


                        // Update the node and link styles
                        svg.selectAll('.node').attr('class', getNodeClasses);

                        svg.selectAll('.link')
                            .attr('class', getLinkClasses)
                            .style('stroke-width', getLinkWidth)
                        ;
                    };

                    var onLinkClick = function(link) {
                        scope.$apply(function() {
                            if (link === scope.selectedLink) {
                                scope.selectedLink = undefined;
                            }
                            else {
                                scope.selectedLink = link;
                            }
                        });
                    };

                    force
                        .nodes(nodes)
                        .links(links)
                        .start();

                    var link = svg.selectAll('.link')
                        .data(links)
                        .enter().append('line')
                        .attr('class', getLinkClasses)
                        .style('stroke-width', getLinkWidth)
                        .on('click', onLinkClick);

                    var node = svg.selectAll('.node')
                        .data(nodes)
                        .enter().append('circle')
                        .attr('class', getNodeClasses)
                        .attr('r', size/30)
                        .on('click', onNodeClick);

                    node.append('title').text(function(d) {
                        return d.fullName;
                    });


                    var breakTicks = 0;
                    var iterations = 50;
                    force.on('tick', function() {
                        // TODO; this is retarted, slow it down some better way
                        breakTicks = (breakTicks + 1) % 5;
                        if (breakTicks !== 0) {
                            return;
                        }

                        if (nodeProvider.isStable) {
                            // If the nodes are already arranged, don't continue
                            force.stop();
                        }

                        link.attr('x1', function(d) { return d.source.x; })
                            .attr('y1', function(d) { return d.source.y; })
                            .attr('x2', function(d) { return d.target.x; })
                            .attr('y2', function(d) { return d.target.y; });

                        node.attr('cx', function(d) { return d.x; })
                            .attr('cy', function(d) { return d.y; });

                        iterations -= 1;
                        if (iterations <= 0) {
                            // Stop the force movement after some iterations
                            nodeProvider.isStable = true;
                        }
                    });
                };


                // Get the nodes
                nodeProvider.getNodes(setupGraph);
            }
        };
    }]);
})();
