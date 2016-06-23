/**
 * @module App
 * @name Rotues
 * @desc Define routes. Please not hardcore logic here.
 */

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $translateProvider) {
  $stateProvider.state('app', {
    url: '',
    templateUrl: './modules/app/app.menu.html',
    resolve: {
      data: function (GetFullDataSet, AccountService) {
        if (!AccountService.getCurrentDeviceToken()) {
          return;
        }
        return GetFullDataSet.fetch(AccountService.getCurrentDeviceToken());
      }
    },
    controller: 'AppController'
  });

  $stateProvider.state('singlepass', {
      url: '/singlepass/:id',
      templateUrl: './modules/passes/passes.html',
      controller: 'SinglepassController',
      resolve: {
        data: function (singlepassCall, $stateParams) {
          return singlepassCall($stateParams.id);
        }
      }
  });

  $stateProvider.state('app.profile', {
      url: '/profile',
      views: {
        'menuContent': {
          templateUrl: './modules/profile/profile.html',
          controller: 'ProfileController'
        }
      }
  });

  $stateProvider.state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: './modules/login/login.html',
          controller: 'LoginController'
        }
      }
  });

  $stateProvider.state('app.passes', {
      url: '/passes',
      views: {
        'menuContent': {
          controller: 'PassesController'
        }
      }
  });

  $stateProvider.state('app.pass', {
      url: '/passes/:id',
      views: {
        'menuContent': {
          templateUrl: './modules/passes/passes.html',
          controller: 'PassesController',
        }
      }
  });

  $stateProvider.state('app.passDetails', {
      url: '/passes/:id/details',
      views: {
        'menuContent': {
          templateUrl: './modules/passes/passDetails.html',
          controller: 'PassDetailsController',
        }
      }
  });

  $stateProvider.state('app.passCamera', {
      url: '/passCamera/:id',
      views: {
        'menuContent': {
          templateUrl: './modules/passes/passCamera/passCamera.html',
          controller: 'PassCameraController'
        }
      }
  });

  $stateProvider.state('app.passManage', {
      url: '/passManage/:id',
      views: {
        'menuContent': {
          templateUrl: './modules/passes/passManage/passManage.html',
          controller: 'PassManageController'
        }
      }
  });

  $stateProvider.state('app.issuedPass', {
      url: '/passManage/:passId/issuedPass/:issuedPassId',
      views: {
        'menuContent': {
          templateUrl: './modules/passes/passManage/issuedPass/issuedPassDetails.html',
          controller: 'IssuedPassDetailsController'
        }
      }
  });

  $stateProvider.state('app.issueNewPass', {
      url: '/passManage/:passId/issueNewPass/:timezone',
      views: {
        'menuContent': {
          templateUrl: './modules/passes/passManage/issueNewPass/issueNewPass.html',
          controller: 'IssueNewPassController'
        }
      }
  });

  $stateProvider.state('app.ring', {
      url: '/ring',
      views: {
        'menuContent': {
          templateUrl: './modules/ring/ring.html',
          controller: 'RingController'
        }
      }
  });

  $urlRouterProvider.otherwise('');

});
