/**
 * @module Passes
 * @module Pass Assign Controller
 */

angular.module('passes')
.controller('IssuedPassDetailsController', function ($scope, $stateParams, PassesCollectionsService, IssuedPassCollectionsService, deletePass, $ionicHistory, $ionicPopup, parsePassIcons, $translate) {
    var passCollection = PassesCollectionsService.getCollections()[0];
    var issuedPassCollection = IssuedPassCollectionsService.getCollectionByPass(passCollection.getPassById($stateParams.passId));
    var issuedPass = issuedPassCollection.geIssuedPassById($stateParams.issuedPassId);

    $scope.issuedPass = issuedPass;
    $scope.moment = moment;
    $scope.parsePassIcons = parsePassIcons;
    
    $scope.removePass = function () {
      var confirmPopup = $ionicPopup.confirm({
        title:  $translate.instant('PASS-DETAIL.REMOVE-PASS-POPUP-TITLE'),
        template: $translate.instant('PASS-DETAIL.REMOVE-PASS-POPUP-BLURB')
      });

      confirmPopup.then(function(res) {
        if (res) {
          deletePass({passIds: [$stateParams.issuedPassId]});
          $ionicHistory.goBack();
        }
      });
    }
});
