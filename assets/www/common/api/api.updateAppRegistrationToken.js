/**
 * @module api
 * @service registerDevice
 * @desc frontend bridge to registerDevice call
 * @desc registrationToken {string} AKA registrationId, coming from APN/GCM
 */

angular.module('api')
.factory('updateAppRegistrationToken', function($http, $q) {
  var baseURL = LP.settings.apiRoot;
  var url = baseURL + "updateAppRegistrationToken";

  var HTTPconfig = {
    url: url,
    method: 'POST',
    data: {
      auth: {
      }
    }
  };

  return function (deviceToken, registrationToken) {
    var dfd = $q.defer();
    HTTPconfig.data.auth.deviceToken = deviceToken;
    HTTPconfig.data.registrationToken = registrationToken;
    console.log(registrationToken)
    $http(HTTPconfig).then(function(resp) {
      dfd.resolve(resp.data);
      console.log(resp)
    }, function(err) {
      console.error('ERR', err);
    });
    return dfd.promise;
  };

});
