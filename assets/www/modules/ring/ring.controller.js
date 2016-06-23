/**
 * @module Ring
 * @module Ring controller
 * @desc Actual ring view
 */

angular.module('ring', [])
.controller('RingController', function($scope, $rootScope, $state, $ionicHistory, StreamerService, parsePassIcons, UserSettingsService, RingerService) {
  if (window.StatusBar) {
    document.addEventListener('deviceready', function () {
      StatusBar.hide()
    });

    $scope.$on('$ionicView.enter', function() {
      StatusBar.hide()
    });
  }

  var ringSoundState = false;
  var soundLoop;
  var ringSoundPath = UserSettingsService.getFilePath() + 'ringtone.wav';
  var ringSound;

  var playSound = function () {
    if (UserSettingsService.settings && UserSettingsService.settings.isSlientMode) {
      return;
    }
    if (!window.Media) {
      return;
    }
    ringSoundState = true;
    ringSound = new Media(ringSoundPath, function () {
      console.log("playAudio():Audio Success");
    }, function(err) {
      console.log("playAudio():Audio Error: "+JSON.stringify(err));
  	}, function (status) {
  		if (status != Media.MEDIA_STOPPED || ringSoundState == false) {
        return;
      }
      ringSound.play();
    });

    ringSound.play();
  };

  var stopSound = function () {
    if (!ringSoundState || !window.Media) {
      return;
    }
    ringSoundState = false;
  };

  $scope.parsePassIcons = parsePassIcons;
  $scope.door = RingerService.data.doorInfo;

  $scope.openDoor = function () {
    console.log('open door!');
    StreamerService.openDoor($scope.door.id);
    $scope.doorIsOpen = true;
  };

  $scope.reject = function () {
    console.log('rejecting intercom call!');
    $scope.endCall();
  };

  $scope.answer = function () {
    console.log('answering intercom!');
    $scope.callState = true;
    StreamerService.callDoor($scope.door.id);
    stopSound();
  };

  $scope.endCall = function () {
    $scope.callState = false;
    StreamerService.hangUp();
    stopSound();
    $scope.door = {};

    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $scope.doorIsOpen = false;
    $state.go('app.passes');
  };

  $scope.$on('$ionicView.enter', function() {
    console.log('enter..')
    $scope.door = RingerService.data.doorInfo;
    if(!$scope.$$phase) {
      $scope.$apply();
    }
    playSound();
  });

});
