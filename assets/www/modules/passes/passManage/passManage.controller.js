/**
 * @module Passes
 * @module Pass Assign Controller
 */

angular.module('passes')
.controller('PassManageController', function($scope, $state, $stateParams, $rootScope, PassesCollectionsService, IssuedPassCollectionsService) {
  var setScopeModels = function () {
    var passCollection = PassesCollectionsService.getCollections()[0];
    var currentPass = passCollection.getPassById($stateParams.id);
    var issuedPassCollection = IssuedPassCollectionsService.getCollectionByPass(currentPass);
    $scope.issuedPasses = issuedPassCollection.issuedPasses;
    $scope.timezone = currentPass.building.location.timeZone.replace("/", "-");
    $scope.currentPass = currentPass;
  };

  setScopeModels();
  $rootScope.$on('getFullDataSet.refetch', setScopeModels);

  $scope.goToIssuedPassDetails = function (issuedPass) {
    $state.go('app.issuedPass', {passId: issuedPass.passData.passId, issuedPassId: issuedPass.issuedPass.id});
  };

});
