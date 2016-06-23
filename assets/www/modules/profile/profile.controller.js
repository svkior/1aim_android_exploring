/**
 * @module Profile
 * @module Profile controller
 * @desc User settings, language, etc
 */

angular.module('profile', [])
.controller('ProfileController', function($scope, $rootScope, UserSettingsService, AccountService) {
  $rootScope.bleDemoMode ={ activated: false };
  $scope.data = {};
  $scope.data.isSilentMode = UserSettingsService.settings.isSilentMode;
  $scope.data.language = UserSettingsService.settings.language;

  $scope.$on('$ionicView.enter', function () {
    $scope.currentAccount = AccountService.getCurrentAccountFullDataSet();
  });

  $scope.changeLanguage = function () {
    UserSettingsService.changeLanguage($scope.data.language);
  };

  $rootScope.toggleclicked = function (e) {
    $rootScope.$emit('bledemo.stateChanged', $rootScope.bleDemoMode.activated);
  };
});
