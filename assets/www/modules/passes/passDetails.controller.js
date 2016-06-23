/**
 * @module passes
 * @desc Pass details controller
 * @desc controlling data passed to passdetails scope
 */

angular.module('passes', [])
.controller('PassDetailsController', function ($scope, $state, $stateParams, $rootScope, PassesCollectionsService, parsePassIcons) {
  var passCollection = PassesCollectionsService.getCollections()[0];
  var currentPass = passCollection.getPassById($stateParams.id);
  $scope.data = currentPass;
  $scope.parsePassIcons = parsePassIcons;
  $scope.moment = moment;
});
