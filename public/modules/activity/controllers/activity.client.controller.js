'use strict';

// angular.module(ApplicationConfiguration.applicationModuleName).config(function (LightboxProvider) {
//   LightboxProvider.getImageUrl = function (image) {
//     return '/base/dir/' + image.getName();
//   };
// });


angular.module('activity').controller('ActivityController', ['$scope', '$location', '$http', 'Authentication', 'Users', 'Activity', 'Lightbox',
  function($scope, $location, $http, Authentication, Users, Activity, Lightbox) {

    $scope.authentication = Authentication;

    $scope.shareCollapsed = true;

    $scope.list = function() {

      $scope.activities = Activity.query();
      // console.log($scope.activities);
    };

    $scope.activityTemplate = function(key) {
      var template = '/modules/activity/partials/';
      switch(key) {
        case 'sendLetter':
          template += 'complaint-letter.client.view.html';
          break;
        default:
          template += 'default-activity.client.view.html';
          break;
      };
      return template;
    };

    $scope.compareDates = function(start, created) {
      var startDate = new Date(start).setHours(0,0,0,0);
      var createdDate = new Date(created).setHours(0,0,0,0);
      return startDate !== createdDate;
    }

    $scope.openLightboxModal = function (photos, index) {
      Lightbox.openModal(photos, index);
    };

	}
]);
