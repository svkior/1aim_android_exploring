/**
 * @module api
 * @service registerDevice
 * @desc frontend bridge to registerDevice call
 * @desc params {Object}
 * @desc onSuccess {Function}
 * @desc onError {Function}
 * @example registerDevice({email: myEmail, password: myPassword});
 */

angular.module('api')
.factory('registerDevice', function($http, $q, UserSettingsService, AccountService) {
  var baseURL = LP.settings.apiRoot;
  var url = baseURL + "registerDevice";

  return function (params, onSuccess, onError) {
    var HTTPconfig = {
      url: url,
      method: 'POST',
      data: {
        deviceName: UserSettingsService.getDeviceName(),
        deviceInfo: {
          os: UserSettingsService.getDeviceOS()
        },
        auth: {}
      }
    };
    var dfd = $q.defer();
    HTTPconfig.data.auth = params;
    $http(HTTPconfig).then(function(resp) {
      dfd.resolve(resp.data);
      console.log(resp)

      // Add accounts only to app passes, not to singlepasses
      if (!params.tempToken) {
        // Add new account to the Account Service
        AccountService.addAccount(resp.data);
      }

      if (onSuccess) {
        onSuccess(resp.data);
      }
    }, function(err) {
      console.error('ERR', err);
      if (onError) {
        onError(err)
      }
    });
    return dfd.promise;
  };

});
