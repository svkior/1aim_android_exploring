/**
 * @module RotationTracker
 * @desc Tracking if the phone is facing door or facing the user
 * @example RotationTrackerService.watch(blinker);
 * @example RotationTrackerService.unwatch();
 */

angular.module('rotationTracker', [])
.factory('RotationTrackerService', function($rootScope) {
  // Changable vairables
  var gammaThreshold = 75; // Degrees when detection will fire
  var timegap = 1000; // The tracker will wait this amount of ms for the detection
  gyro.frequency = 50; // Tracker will check every this amount of ms for changes
  var trackingState;
  var oldGammas = [];
  var watchState;

  var hasGyroscope = function () {
    return !!gyro.getOrientation().rawGamma;
  }

  var getAbsGamma = function () {
    return Math.abs(gyro.getOrientation().rawGamma);
  };

  var getDeltaGamma = function () {
    return Math.abs(oldGammas[0] - getAbsGamma());
  };

  var trackWithGyroscope = function (callback) {
    var oldGammasArrayLength = Math.floor(timegap / gyro.frequency);
    oldGammas.push(getAbsGamma());

    if (oldGammas.length < oldGammasArrayLength) {
      return;
    }

    oldGammas.splice(0, 1);
    if (getDeltaGamma() > gammaThreshold) {
      stopAndClear();
      callback();
    }
  };

  var trackWithoutGyroscope = function () {
    // TODO
  };

  var stopAndClear = function () {
    oldGammas = [];
    gyro.stopTracking();
  };

  var track = function (onRotation) {
    stop();
    gyro.startTracking(function (o) {
      if (!hasGyroscope()) {
        trackWithoutGyroscope();
        return;
      }
      trackWithGyroscope(onRotation);
    });
  };

  var watchLoop = function () {
    if (!watchState) {
      stop();
      return;
    }

    track(function () {
      window.blinker.toggle();
      stop();
      watchLoop();
    });
  };

  var stop = function () {
    stopAndClear();
    trackingState = false;
  };

  var watch = function (blinker) {
    watchState = true;

    watchLoop();
  };

  var unwatch = function () {
    watchState = false;
    stop();
  };

  $rootScope.$on('blinker.triggeredManually', function () {
    unwatch();
  });

  $rootScope.$on('blinker.statedChanged', function (event, blinkerState) {
    if (!blinkerState && !watchState) {
      watch();
    }
  });

  return {
    watch: watch,
    unwatch: unwatch
  };

});
