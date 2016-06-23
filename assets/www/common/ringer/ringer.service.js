/**
 * @module Ringer
 * @service RingerService
 * @desc Handles ringing from doors, using APN/GCM notification
 */

angular.module('ringer', [])
.factory('RingerService', function($state, AccountService) {
  // Contants
  // ------------
  var GCM_SENDERID = LP.settings.GCMSenderId;

  // Variables
  // ------------
  var push;
  var data = {
    doorInfo: {}
  };

  // Private Functions
  // ------------------

  /**
   * @private
   * @desc callback function, fires when notification recived from APM/GCM servers
   * @desc sets the door info into the service's data object
   * @param notification {Object} notificaion data
   */
  var onNotificationRecived = function (notification) {
    console.log('notification reviced');
    console.log(notification);

    // GCM and APM returns a different format.
    // So just in case we can a stringified JSON, we parse the data into object
    data.doorInfo = notification.additionalData.doorInfo;
    if (_.isString(data.doorInfo)) {
      data.doorInfo = JSON.parse(data.doorInfo);
    }

    // go to ring view
    $state.go('app.ring');
  };

  /**
   * @private
   * @desc success callback for GCM/APM registration
   * @desc sends the registration Id to 1aim server
   * @param regData {Object} notificaion data
   */
  var onRegistration = function (regData) {
    AccountService.updateCurrentAccountRegistrationToken(regData.registrationId);
  };


  /**
   * @private
   * @desc error callback for push notification
   * @param error {Object}
   */
  var onError = function (error) {
    console.log('error!');
    console.log(error);
  };

  /**
   * @private
   * @desc setting push notifications events
   */
  var setPushEvents = function () {
    push.on('registration', onRegistration);
    push.on('notification', onNotificationRecived);
    push.on('error', onError);
  };

  /**
   * @private
   * @desc Registering Device to APN/GCM
   */
  var register = function () {
    console.log('registering device!')
    push = PushNotification.init({
        android: {
            senderID: GCM_SENDERID
        },
        ios: {
            alert: "true",
            badge: "true",
            sound: "true"
        },
        windows: {}
    });
    setPushEvents();
  };

  // Exports
  // ----------
  return {
      data: data,
      init: function () {
        if (!AccountService.getCurrentDeviceToken()) {
          return;
        }
        document.addEventListener("deviceready", function() {
          register();
        });
      }
  };
});
