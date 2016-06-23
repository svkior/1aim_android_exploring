/**
 * @module passes
 */

angular.module('passes')
.controller('PassCameraController', function($scope, $state, $stateParams, StreamerService, $ionicHistory, PassesCollectionsService, parsePassIcons) {
  var passCollection = PassesCollectionsService.getCollections()[0]; // At the momement we have only one provider. TODO: Make this provider dependet
  var currentPass = passCollection.getPassById($stateParams.id);
  console.log(currentPass)
  $scope.data = currentPass;
  $scope.parsePassIcons = parsePassIcons;
  $scope.$on('$ionicView.enter', function() {
    StreamerService.callDoor(currentPass.door.id);
  });
});
