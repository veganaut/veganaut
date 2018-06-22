(function() {
    'use strict';

    /**
     * Overwrite the default template of the rating component from Angular UI Bootstrap.
     * The difference is that we use vg-icons instead of the Glyphicons from Bootstrap.
     */
    angular
        .module('veganaut.ui')
        .run(['$templateCache', function($templateCache) {
            $templateCache.put('template/rating/rating.html', ratingTemplate);
        }])
    ;

    var ratingTemplate = '<span ng-mouseleave="reset()" ng-keydown="onKeydown($event)" tabindex="0"' +
        '            role="slider" aria-valuemin="0" aria-valuemax="{{range.length}}" aria-valuenow="{{value}}">' +
        '        <span ng-repeat-start="r in range track by $index" class="sr-only">' +
        '            ({{ $index < value ? \'*\' : \' \' }})' +
        '        </span>' +
        '        <vg-icon ng-repeat-end' +
        '                ng-mouseenter="enter($index + 1)"' +
        '                ng-click="rate($index + 1)"' +
        '                vg-name="\'star\'"' +
        '                class="vg-rating__star"' +
        '                ng-class="$index < value && (r.stateOn || \'vg-rating__star--filled\') || (r.stateOff || \'\')"' +
        '                ng-attr-title="{{r.title}}"' +
        '                aria-valuetext="{{r.title}}">' +
        '        </vg-icon>\n' +
        '    </span>'
    ;
})();
