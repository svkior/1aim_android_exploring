/**
 * @module Bliker
 * @desc handles blinking function for door opening
 * @example var blinker = new BlinkerService(confArray);
 * @example blinker.draw();
 * @example blinker.stop();
 */

angular.module('blinker', [])
.factory('BlinkerService', function($rootScope) {
  return function (conf) {

    var blinkerState = false;
    var conf = conf;
    var count = 0;
    var enabled;
    if (conf && conf.length > 0) {
      enabled = true;
      var polyanimframe = new AnimationFrame({useNative: false, frameRate: Math.round(1000/conf[0])});      
    } else {
      enabled = false;
    }

    var lastFrame= +new Date;
  	var sum = 0;

    var viewElement = document.getElementsByClassName("view-container")[0];
    var bodyOriginalClass = document.body.className;

    var addDocumentEvent = function () {
      document.addEventListener('click', onDocumentClick);
    };

    var removeDocumentEvent = function () {
      document.removeEventListener('click', onDocumentClick);
    };

    var clearView = function () {
      document.body.className = bodyOriginalClass + ' blinker-active';
      _.delay(function () {
        document.body.innerHTML = '';
      }, 240)
    };

    var restoreView = function () {
      _.delay(function () {
        document.body.className = bodyOriginalClass;
        document.body.removeAttribute('style');
      }, 10);
      document.body.appendChild(viewElement);
    };

    var onDocumentClick = function () {
      if (!blinkerState) {
        return;
      }
      stop();
    };

    var loop = function(time) {
      if (!blinkerState) {
        return;
      }
  		polyanimframe.request(loop);
  		var delta = time - lastFrame;
  		sum += delta;
  		if (sum >= conf[0]) {
  			if (++count >= conf.length) {
  				count=1;
        }
  			if (conf.length > 1) {
  				document.body.style.background = conf[count];
  			}
  			sum = 0;
  		}
  		lastFrame = time;
  	};

    var emitBlinkerStateChange = function () {
      $rootScope.$emit('blinker.statedChanged', blinkerState);
    };

    var stop = function () {
      blinkerState = false;
      emitBlinkerStateChange();
      restoreView();
      removeDocumentEvent();
    };

    var draw = function () {
      blinkerState = true;
      emitBlinkerStateChange();
      loop(lastFrame);
      clearView();
      _.delay(function () {
        addDocumentEvent();
      }, 250)
    };

    var toggle = function () {
      if (enabled) {
        if (blinkerState) {
          stop();
          return;
        }
        draw();
      }
    };

    return {
      draw: draw,
      stop: stop,
      toggle: toggle,
      blinkerState: blinkerState
    }
  };
});
