/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.12.0 - 2014-11-16
 * License: MIT
 */
 'use strict';

angular.module('vgbootstrap.accordion', [])

.constant('vgaccordionConfig', {
  closeOthers: true
})

.controller('vgAccordionController', ['$scope', '$attrs', 'vgaccordionConfig', function ($scope, $attrs, vgaccordionConfig) {

  // This array keeps track of the accordion groups
  this.groups = [];

  // Ensure that all the groups in this accordion are closed, unless close-others explicitly says not to
  this.closeOthers = function(openGroup) {
    var closeOthers = angular.isDefined($attrs.closeOthers) ? $scope.$eval($attrs.closeOthers) : vgaccordionConfig.closeOthers;
    if ( closeOthers ) {
      angular.forEach(this.groups, function (group) {
        if ( group !== openGroup ) {
          group.isOpen = false;
        }
      });
    }
  };

  // This is called from the accordion-group directive to add itself to the accordion
  this.addGroup = function(groupScope) {
    var that = this;
    this.groups.push(groupScope);

    groupScope.$on('$destroy', function () {
      that.removeGroup(groupScope);
    });
  };

  // This is called from the accordion-group directive when to remove itself
  this.removeGroup = function(group) {
    var index = this.groups.indexOf(group);
    if ( index !== -1 ) {
      this.groups.splice(index, 1);
    }
  };

}])

// The accordion directive simply sets up the directive controller
// and adds an accordion CSS class to itself element.
.directive('vgaccordion', function () {
  return {
    restrict:'EA',
    controller:'vgAccordionController',
    transclude: true,
    replace: false,
    templateUrl: 'template/accordion/accordion.html'
  };
})

// The accordion-group directive indicates a block of html that will expand and collapse in an accordion
.directive('vgaccordionGroup', function() {
  return {
    require:'^vgaccordion',         // We need this directive to be inside an accordion
    restrict:'EA',
    transclude:true,              // It transcludes the contents of the directive into the template
    replace: true,                // The element containing the directive will be replaced with the template
    templateUrl:'template/accordion/accordion-group.html',
    scope: {
      heading: '@',               // Interpolate the heading attribute onto this scope
      isOpen: '=?',
      isDisabled: '=?'
    },
    controller: function() {
      this.setHeading = function(element) {
        this.heading = element;
      };
    },
    link: function(scope, element, attrs, vgaccordionCtrl) {
      vgaccordionCtrl.addGroup(scope);

      scope.$watch('isOpen', function(value) {
        if ( value ) {
          vgaccordionCtrl.closeOthers(scope);
        }
      });

      scope.toggleOpen = function() {
        if ( !scope.isDisabled ) {
          scope.isOpen = !scope.isOpen;
        }
      };
    }
  };
})

// Use accordion-heading below an accordion-group to provide a heading containing HTML
// <accordion-group>
//   <accordion-heading>Heading containing HTML - <img src="..."></accordion-heading>
// </accordion-group>
.directive('vgaccordionHeading', function() {
  return {
    restrict: 'EA',
    transclude: true,   // Grab the contents to be used as the heading
    template: '',       // In effect remove this element!
    replace: true,
    require: '^vgaccordionGroup',
    link: function(scope, element, attr, vgaccordionGroupCtrl, transclude) {
      // Pass the heading to the accordion-group controller
      // so that it can be transcluded into the right place in the template
      // [The second parameter to transclude causes the elements to be cloned so that they work in ng-repeat]
      vgaccordionGroupCtrl.setHeading(transclude(scope, function() {}));
    }
  };
})

// Use in the accordion-group template to indicate where you want the heading to be transcluded
// You must provide the property on the accordion-group controller that will hold the transcluded element
// <div class="accordion-group">
//   <div class="accordion-heading" ><a ... accordion-transclude="heading">...</a></div>
//   ...
// </div>
.directive('vgaccordionTransclude', function() {
  return {
    require: '^vgaccordionGroup',
    link: function(scope, element, attr, controller) {
      scope.$watch(function() { return controller[attr.vgaccordionTransclude]; }, function(heading) {
        if ( heading ) {
          element.html('');
          element.append(heading);
        }
      });
    }
  };
});


angular.module('template/accordion/accordion-group.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/accordion/accordion-group.html',
    '<div class=\"panel panel-default\" ng-click=\"toggleOpen()\">\n' +
    '  <div class=\"panel-heading\" ng-hide=\"isOpen\">\n' +
    '    <h4 class=\"panel-title\">\n' +
    '      <a href class=\"vgaccordion-toggle\" ng-click=\"toggleOpen()\" vgaccordion-transclude=\"heading\"><span ng-class=\"{"text-muted": isDisabled}\">{{heading}}</span></a>\n' +
    '    </h4>\n' +
    '  </div>\n' +
    '  <div class=\"panel-collapse\" collapse=\"!isOpen\">\n' +
    '   <div class=\"panel-body\" ng-transclude></div>\n' +
    '  </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('template/accordion/accordion.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/accordion/accordion.html',
    '<div class=\"panel-group\" ng-transclude></div>');
}]);
