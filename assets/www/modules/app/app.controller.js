/**
 * @module Passes
 * @module Pass Assign Controller
 */

angular.module('lightpass')
.controller('AppController', function(UserSettingsService, $rootScope, $state, $scope, data, StreamerService, AccountService) {
  console.log('app ctrlr')
  // if no accounts, forward to login page
  if (!AccountService.hasAccounts()) {
    $state.go('app.login');
  } else if ($state.$current.name === 'app') {
    $state.go('app.passes');
  }

  $scope.$on('$ionicView.enter', function () {
    updateScope();
  });

  $scope.toggleAccountsMenu = function () {
    if ($rootScope.isWebSession) {
      return;
    }
    $scope.isAccountsMenuActive = !$scope.isAccountsMenuActive;
  };

  $scope.toggleSearch = function () {
    $rootScope.searchActiveState = !$rootScope.searchActiveState;
    if ($rootScope.searchActiveState) {
      _.delay(function () {
        document.getElementById('search-input').focus();
      }, 400)
    } else {
      $rootScope.search.query = '';
    }
  };

  window.$rootScope = $rootScope;

  var updateScope = function () {
    $scope.isAccountsMenuActive = false;
    $scope.accounts = AccountService.getAccounts();
    $scope.changeAccount = AccountService.changeAccount;
    $scope.currentAccount = AccountService.getCurrentAccountFullDataSet();
    $rootScope.search = {};
    $rootScope.search.query;
    $scope.showSearch = $state.current.name === 'app.pass';

    // Handy for calling it from anywhere if we want to disable some features for web sessions
    $rootScope.isWebSession = UserSettingsService.getDeviceOS() === 'web' && LP.enviroment === "debug" && !LP.enviroments.debug.forceMobileSession;
    $scope.logout = function () {
      AccountService.logoutCurrentAccount();
    }
  };

  if (navigator.splashscreen) {
    navigator.splashscreen.hide();
  }

});
