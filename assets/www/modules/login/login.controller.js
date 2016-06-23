/**
 * @module Login
 * @module Login controller
 */

angular.module('login', [])
.controller('LoginController', function($scope, $state, AccountService, registerDevice, $ionicPopup, $translate, GetFullDataSet, SpinnerService, RingerService) {
  $scope.loginModel = {
    email: null,
    password: null
  };

  $scope.hasAccounts = AccountService.hasAccounts();
  $scope.login = function () {
    SpinnerService.startRootSpinner();
    registerDevice($scope.loginModel, function (data) {
      $scope.loginModel.email = null;
      $scope.loginModel.password = null;
      GetFullDataSet.fetch(AccountService.getCurrentDeviceToken(), function () {
        console.log('login sucess');
        SpinnerService.stopRootSpinner();
        RingerService.init();
        $state.go('app.passes');
      });
    }, function () {
      SpinnerService.stopRootSpinner();
      $ionicPopup.alert({
        title: $translate.instant('ERRORS.PROBLEM-TITLE'),
        template: $translate.instant('ERRORS.WRONG-LOGIN')
      })
    });
  };
});
