(function(module) {
    'use strict';

    // TODO: refactor this whole thing, it's a big mess
    // TODO: move all the constants somewhere together
    // TODO: should zoom in and out for different screen sizes
    // TODO: redo the way the graph is re-created when the data changes
    // TODO: find a better way to slow down the force animation
    module.directive('socialGraph', ['d3', 'nodeService', function(d3, nodeService) {

        /**
         * Makes an arced link between two points.
         * Taken from http://bl.ocks.org/mbostock/1153292
         * @param d
         * @returns {string}
         */
        var linkArc = function(d) {
            var dx = d.target.x - d.source.x;
            var dy = d.target.y - d.source.y;
            var dr = Math.sqrt(dx * dx + dy * dy);
            return 'M' + d.source.x + ',' + d.source.y + 'A' + dr + ',' + dr +
                ' 0 0,1 ' + d.target.x + ',' + d.target.y;
        };

        return {
            restrict: 'E',
            scope: {
                selectedNode: '=',
                selectedLink: '='
            },
            link: function(scope, element) {
                /**
                 * Returns the list of css classes that should be applied to
                 * the given node
                 * @param node
                 * @returns {string}
                 */
                var getNodeClasses = function(node) {
                    var klass = 'node ';
                    if (typeof node.relation !== 'undefined') {
                        klass += ' relation-' + node.relation;
                    }

                    if (typeof node.type !== 'undefined') {
                        klass += ' type-' + node.type;
                    }

                    if (typeof node.team !== 'undefined') {
                        klass += ' team-' + node.team;
                    }

                    if (node.isCaptured === true) {
                        klass += ' captured';
                    }
                    else {
                        klass += ' notcaptured';
                    }

                    var balanceMapping = node.getBalanceMapping();
                    if (typeof balanceMapping !== 'undefined') {
                        klass += ' balance-' + balanceMapping;
                    }

                    if (node === scope.selectedNode) {
                        klass += ' selected';
                    }

                    return klass;
                };

                /**
                 * Returns the radius of the node
                 * @param node
                 * @returns {number}
                 */
                var getNodeRadius = function(node) {
                    if (node.isSmallNode()) {
                        return 10;
                    }
                    else {
                        return 15;
                    }
                };

                /**
                 * Returns the list of css classes that should be applied to
                 * the given link
                 * @param link
                 * @returns {string}
                 */
                var getLinkClasses = function(link) {
                    var klass = 'link';
                    var sourceTeam = link.source.team;
                    if (typeof sourceTeam !== 'undefined') {
                        klass += ' team-' + sourceTeam;
                    }

                    if (link.completedActivities > 0) {
                        klass += ' hasCompletedActivities';
                    }
                    if (link.openActivities > 0) {
                        klass += ' hasOpenActivities';
                    }

                    // Set class based on total number of activities
                    var totalActivities = (link.completedActivities || 0) + (link.openActivities || 0);
                    if (totalActivities < 2) {
                        klass += ' numActivitiesSmall';
                    }
                    else if (totalActivities < 3) {
                        klass += ' numActivitiesMedium';
                    }
                    else {
                        klass += ' numActivitiesLarge';
                    }

                    if (link.target === scope.selectedNode || link.source === scope.selectedNode) {
                        klass += ' highlighted';
                    }
                    return klass;
                };

                /**
                 * Returns the style of the marker end for the given link
                 * @param link
                 * @returns {string}
                 */
                var getMarkerEnd = function(link) {
                    var node = link.target;
                    if (node.isSmallNode()) {
                        return 'url(#pointerToSmall)';
                    }
                    else {
                        return 'url(#pointerToBig)';
                    }
                };


                // Get the available width and set it as size of the square
                var size = element[0].clientWidth;

                var svgContainer = d3.select(element[0]);
                var svg;

                /**
                 * Creates the d3 graph
                 */
                var setupGraph = function() {
                    var nodes = nodeService.getNodes();
                    var links = nodeService.getLinks();

                    // Scale coordinates to the proper size
                    for (var i = 0; i < nodes.length; i++) {
                        var node = nodes[i];
                        if (angular.isNumber(node.coordX) && !angular.isNumber(node.x)) {
                            node.x = node.coordX * size;
                        }
                        if (angular.isNumber(node.coordY) && !angular.isNumber(node.y)) {
                            node.y = node.coordY * size;
                        }

                        // The 'me' node should never move
                        if (node.isMe()) {
                            node.fixed = true;
                        }
                    }

                    var force = d3.layout.force()
                        .charge(-800)
                        .linkDistance(100)
                        .size([size, size]);

                    var zoom = d3.behavior.zoom()
                        .on('zoom', function() {
                            zoom.translate(d3.event.translate);

                            svg.attr('transform',
                                'translate(' + d3.event.translate + ')' +
                                    ' scale(' + d3.event.scale + ')'
                            );
                        })
                        .scaleExtent([0.3, 10])
                        .on('zoomstart', function() {
                            d3.event.sourceEvent.stopPropagation();
                        });

                    if (typeof svg === 'undefined') {
                        // Setup the svg for the first time
                        svg = svgContainer.append('svg')
                            .attr('width', size)
                            .attr('height', size)
                            .attr('class', 'graphSvg')
                            .call(zoom)
                            .append('g');

                        // Add some end-marker style
                        svg.append('defs').selectAll('marker')
                            .data(['pointerToSmall', 'pointerToBig'])
                            .enter().append('marker')
                            .attr('id', function(d) { return d; })
                            .attr('viewBox', '0 -5 10 10')
                            .attr('refX', function(d) {
                                return (d === 'pointerToSmall') ? 25 : 35;
                            })
                            .attr('refY', function(d) {
                                return (d === 'pointerToSmall') ? -1 : -3.5;
                            })
                            .attr('markerWidth', 6)
                            .attr('markerHeight', 6)
                            .attr('markerUnits', 'userSpaceOnUse')
                            .attr('orient', 'auto')
                            .append('path')
                            .attr('d', 'M0,-5L10,0L0,5');
                    }
                    else {
                        // If we already created this once, remove the nodes and links
                        svg.selectAll('.node').remove();
                        svg.selectAll('.link').remove();
                    }

                    var onNodeClick = function(node) {
                        if (d3.event.defaultPrevented) {
                            return;
                        }

                        scope.$apply(function() {
                            if (node === scope.selectedNode) {
                                scope.selectedNode = undefined;
                            }
                            else {
                                scope.selectedNode = node;
                            }
                        });


                        // Update the node and link styles
                        svg.selectAll('.node').attr('class', getNodeClasses);

                        svg.selectAll('.link')
                            .attr('class', getLinkClasses)
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

                    var svgLinks = svg.selectAll('.link')
                        .data(links)
                        .enter().append('path')
                        .attr('class', getLinkClasses)
                        .attr('marker-end', getMarkerEnd)
                        .on('click', onLinkClick);

                    var svgNodes = svg.selectAll('.node')
                        .data(nodes)
                        .enter().append('circle')
                        .attr('class', getNodeClasses)
                        .attr('r', getNodeRadius)
                        .on('click', onNodeClick);

                    var meNode = svg.select('.node.relation-me');

                    // Add an extra circle to mark the me node
                    svg.append('circle')
                        .attr('class', 'meMarker')
                        .attr('r', 4)
                        .attr('cx', size / 2) // The me node is always exactly in the middle
                        .attr('cy', size / 2)
                        .on('click', function() {
                            // Pass clicks through to the me node
                            onNodeClick(meNode.data()[0]);
                        })
                    ;

                    svgNodes.append('title').text(function(d) {
                        return d.fullName;
                    });

                    var breakTicks = 0;
                    var iterations = 50;
                    force.on('tick', function() {
                        breakTicks = (breakTicks + 1) % 5;
                        if (breakTicks !== 0) {
                            return;
                        }

                        if (nodeService.isGraphStable()) {
                            // If the nodes are already arranged, don't continue
                            force.stop();
                        }
                        else {
                            svgLinks.attr('d', linkArc);

                            svgNodes
                                .attr('cx', function(d) { return d.x; })
                                .attr('cy', function(d) { return d.y; })
                            ;

                            iterations -= 1;
                            if (iterations <= 0) {
                                // Stop the force movement after some iterations
                                nodeService.setGraphStable(true);
                            }
                        }
                    });
                };

                // Get the nodes
                nodeService.updateData(setupGraph);

                // Reload the data when it changes
                scope.$onRootScope('monkey.socialGraph.dataChanged', function() {
                    nodeService.updateData(setupGraph);
                });
            }
        };
    }]);
})(window.veganaut.socialGraphModule);
