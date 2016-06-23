/**
 * @module App
 * @desc The magic starts here
 */

var app = angular.module('lightpass', [
  'ionic',
  'pascalprecht.translate',
  'accounts',
  'userSettings',
  'ionic-datepicker',
  'login',
  'passes',
  'helpers',
  'profile',
  'api',
  'ring',
  'ringer',
  'blinker',
  'rotationTracker',
  'streamer',
  'bleDemo',
  'spinner',
  'singlepass'
]);

app.run(function($ionicPlatform, RingerService, $rootScope, RotationTrackerService, StreamerService, bleDemoService, UserSettingsService, AccountService) {
  $ionicPlatform.ready(function() {
    // Init ringer  service to lister to rings from server
    RingerService.init();

    // XXX: DEBUGGING!!
    window.AccountService = AccountService;

    // Cordova stuff
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      StatusBar.styleDefault();
    }

  });

  // Stuff that happends every route change
  $rootScope.$on('$stateChangeStart', function() {
    RotationTrackerService.unwatch();
    if (StreamerService.state.isCallActive) {
      StreamerService.hangUp();
    }
    if (window.StatusBar) {
      StatusBar.show();
    }
  });
});

// app config
app.config(function ($translateProvider, $translatePartialLoaderProvider) {
  // Config languages
  $translatePartialLoaderProvider.addPart('locales');
  $translateProvider.useLoader('$translatePartialLoader', {
    urlTemplate: 'common/translate/locales/{lang}.json'
  });
  $translateProvider.preferredLanguage('en');
});
