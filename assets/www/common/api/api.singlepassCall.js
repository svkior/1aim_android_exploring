/**
 * @module api
 * @service singlepassCall
 * @desc Register with temp token, then getting full dataset
 * @desc This is ideally would be done in the backend to save amount of call (1 instead of 2)
 * @param tempToken tempToken used for Singlepass auth
 */

angular.module('api')
.factory('singlepassCall', function($http, $q, UserSettingsService, AccountService, registerDevice, $translate, GetFullDataSet) {
  var LOCALSTORAGE_KEY = 'Singlepass.data';
  var localStorageData = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || {};

  /**
   * @private
   * @desc set the data object to the local storage, should be call by any setter function
   */
  var setDataToLocalStorage = function () {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(localStorageData));
  };


  return function (tempToken) {
    var dfd = $q.defer();

    var getData = function (deviceToken, onError) {
      GetFullDataSet.fetch(deviceToken, function (data) {
        dfd.resolve(data);
      }, {
        onError: onError
      });
    };

    var registerDeviceWithTempToken = function () {
      registerDevice({tempToken: tempToken}, function (loginData) {
        localStorageData[tempToken] = loginData.deviceToken;
        setDataToLocalStorage();
        getData(loginData.deviceToken);
      }, function (err) {
        console.log('ERR', err);
        delete localStorageData[tempToken];

        dfd.resolve({isWrongToken: true});
      });
    };

    var lsDeviceToken = localStorageData[tempToken];

    if (lsDeviceToken) {
      getData(lsDeviceToken, function () {
        delete localStorageData[tempToken];
        registerDeviceWithTempToken(tempToken);
      });
    } else {
      registerDeviceWithTempToken();
    }

    return dfd.promise;
  }

});
