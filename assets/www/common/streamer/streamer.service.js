/**
 * @module StreamerService
 * @desc Handle remote streaming
 */

angular.module('streamer', [])
.factory('StreamerService', function($ionicPopup, $ionicHistory, $state, AccountService, $translate) {
  // Contsants
  // ----------
  var REMOTE_VID_EL_ID = 'remote-video';

  // Variables
  // ----------
  var serverOptions = LP.settings.stremaerServerOptions;
  var peer;
  var peerId = AccountService.getCurrentDeviceToken();
  var localStream;
  var remoteStream;
  var currentCall;
  var state = {
    isCallActive: false
  };

  // Privates
  // ----------
  /**
   * @private
   * @desc Different borowsers have different naming for getUserMedia
   */
  var unifyGetUserMedia = function () {
    if(ionic.Platform.isIOS()) {
      return;
    }

    navigator.getUserMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);
  };

  //@private
  var init = function () {
    unifyGetUserMedia();
  };

  /**
   * @private
   * Get DOM video element
   */
  var getRemoteVideoElement = function () {
      return document.getElementById(REMOTE_VID_EL_ID);
  };

  /**
   * @private
   * @desc Open user stream and store it in `localStream`
   * @param callback {Function} Success callback
   */
  var streamUserMedia = function (callback) {
    console.log('streamUserMedia')
    navigator.getUserMedia({audio: true, video: true}, function(stream) {
        localStream = stream;
        if (callback) {
          callback();
        }
      }, function(e) {
        console.log('error');
        console.log(e);
      });
  }

  /**
   * @private
   * @desc close user stream
   */
  var unStreamUserMedia = function () {
    if (getRemoteVideoElement()) {
      getRemoteVideoElement().setAttribute('src', "");
    }
    localStream = undefined;
  };

  /**
   * @private
   * @desc set peer event listeners
   */
  var listenToEvents = function () {
    peer.on('open', onOpen);
    peer.on('error', onError);
  };

  // @private
  var onError = function (err) {
    console.log(err.message);

    var errAlert = $ionicPopup.alert({
      title: $translate.instant("ERRORS.PROBLEM-TITLE"),
      template: $translate.instant("ERRORS.CAMERA-ERROR")
    });

    errAlert.then(function() {
      if ($state.$current.name === 'app.ring') {
        return;
      }
      $ionicHistory.goBack();
    });
  };

  /**
   * @desc event callback when peer connection is open
   * @param id {string} id from stremaer server
   */
  var onOpen = function (id) {
    console.log('open, my id is ' + id)
  };

  /**
   * @desc event callback when door's stream arrives
   * @desc sets remotestream blob and renders it to the DOM
   * @param stream {blob} Media Blob coming from the door
   */
  var onCallStream = function (stream) {
    console.log('remote Stream!');
    remoteStream = stream;
    renderRemoteStream();
  };

  /**
   * @desc Renders remote media blob to the DOM
   */
  var renderRemoteStream = function () {
    getRemoteVideoElement().setAttribute('src', URL.createObjectURL(remoteStream));
  };

  /**
   * @desc closing current call
   */
  var closeCall = function () {
    if (!currentCall) {
      return;
    }
    currentCall.close();
  };

  /**
   * @desc initilizing a new peer instant and setting its events
   */
  var connectPeer = function () {
    peer = new Peer(peerId, serverOptions);
    listenToEvents();
  };

  /**
   * @desc handler to connect the streamer server
   */
  var connect = function (id) {
    if (!ionic.Platform.device().cordova) {
      connectPeer();
      return;
    }

    document.addEventListener('deviceready', function () {
      if (window.device.platform === 'iOS') {
        cordova.plugins.iosrtc.registerGlobals();
        cordova.plugins.iosrtc.selectAudioOutput('speaker');
        util.supports.data = true;
        util.supports.audioVideo = true;
      }
      connectPeer();
    });
  };

  // Public functions
  // ------------

  /**
   * @desc call door
   * @param doorId {string}
   */
  var callDoor = function (doorId) {
    connect();
    streamUserMedia(function () {
      console.log('calling remote!');
      currentCall = peer.call(doorId, localStream);
      currentCall.on('stream', onCallStream);
      state.isCallActive = true;
    });
  };

  /**
   * @desc finish a call with a door and disconnect from stremear server
   */
  var hangUp = function () {
    closeCall();
    unStreamUserMedia();
    if (peer) {
      peer.destroy();
    }
    state.isCallActive = false;
  };

  /**
   * @desc will send the door a metaData message with a command to open the door
   * @param {string} doorId
   *
   * TODO: Add this right passID/userID/DeviceToken/whateverAUTH message to make this more secure.
   */
  var openDoor = function (doorId) {
    connect();
    peer.connect(doorId, {metadata: {openDoor: true}});
    peer.disconnect(doorId);
  };

  init();

  // Exports
  // ---------
  return {
    openDoor: openDoor,
    state: state,
    hangUp: hangUp,
    callDoor: callDoor
  };

});
