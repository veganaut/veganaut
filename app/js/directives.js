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
                    if (d3.event.defaultPrevented) return;
                    scope.$apply(function() {
                        scope.selectedNode = node;
                    });
                    d3.behavior.zoom().event(node);
                };

                var force = d3.layout.force()
                    .charge(-1 * size)
                    .linkDistance(size/4)
                    .size([size, size]);

                var svg = d3.select(element[0]).append('svg')
                    .attr('width', size)
                    .attr('height', size);

                svg.call(d3.behavior.zoom().on('zoom', function()
                {
                    console.log("translate: " + d3.event.translate + " scale: " + d3.event.scale);
                    console.log("width: " + svg.attr('width') + " height: " + svg.attr('height'));

                    var h = parseInt(svg.attr('height')/2);
                    var w = parseInt(svg.attr('width')/2);
                    var tr_x = Math.max(Math.min(d3.event.translate[0], w/2), -w/2);
                    var tr_y= Math.max(Math.min(d3.event.translate[1], h/2), -h/2);

                    svg.attr('transform',
                        'translate(' + tr_x + ',' + tr_y + ')'
                            + ' scale(' + d3.event.scale + ')');

                }).on('zoomstart', function()
                {
                    console.log('foo');
                    d3.event.sourceEvent.stopPropagation();
                }));

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
                    .call(force.drag)
                    .on('click', onNodeClick);

                node.append('title').text(function(d) {
                    return d.name;
                });


                var breakTicks = 0;
                force.on('tick', function() {
                    // TODO; this is retarted, slow it down some better way
                    breakTicks = (breakTicks + 1) % 5;
                    if (breakTicks !== 0) {
                        return;
                    }
                    link.attr('x1', function(d) { return d.source.x; })
                        .attr('y1', function(d) { return d.source.y; })
                        .attr('x2', function(d) { return d.target.x; })
                        .attr('y2', function(d) { return d.target.y; });

                    node.attr('cx', function(d) { return d.x; })
                        .attr('cy', function(d) { return d.y; });
                });
            }
        };
    }]);
})();
