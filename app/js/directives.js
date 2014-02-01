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
                selectedNode: '='
            },
            link: function(scope, element, attr) {
                var size = parseFloat(attr.size);

                var onNodeClick = function(node) {
                    scope.$apply(function() {
                        scope.selectedNode = node;
                    });
                };

                var force = d3.layout.force()
                    .charge(-1 * size)
                    .linkDistance(size/4)
                    .size([size, size]);

                var svg = d3.select(element[0]).append('svg')
                    .attr('width', size)
                    .attr('height', size);

                force
                    .nodes(nodeProvider.nodes)
                    .links(nodeProvider.links)
                    .start();

                var link = svg.selectAll('.link')
                    .data(nodeProvider.links)
                    .enter().append('line')
                    .attr('class', function(d) {
                        var klass = 'link';
                        if (isMe(d.target) || isMe(d.source)) {
                            klass += ' mine';
                        }
                        return klass;
                    })
                    .style('stroke-width', function(d) {
                        return Math.sqrt(d.numActivities);
                    });

                var node = svg.selectAll('.node')
                    .data(nodeProvider.nodes)
                    .enter().append('circle')
                    .attr('class', function(d) {
                        return 'node ' + d.type;
                    })
                    .attr('r', size/30)
                    .on('click', onNodeClick);

                node.append('title').text(function(d) {
                    return d.name;
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
                        nodeProvider.isStable = true;
                    }
                });
            }
        };
    }]);
})();
