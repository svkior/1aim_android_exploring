/**
 * @module api
 * @service issuePass
 * @desc frontend bridge to issuePass call
 * @desc params {Object}
 * @desc onSuccess {Function}
 * @desc onError {Function}
 * @example issuePass(myNewissuedPass)
 */

angular.module('api')
.factory('issuePass', function($http, $q, GetFullDataSet, AccountService) {
  var baseURL = LP.settings.apiRoot;
  var url = baseURL + "issuePass";

  var HTTPconfig = {
    url: url,
    method: 'POST',
    data: {
      auth: {}
    }
  };

  return function (params, onSuccess, onError) {
    var dfd = $q.defer();
    _.extend(HTTPconfig.data, params);
    HTTPconfig.data.auth.deviceToken = AccountService.getCurrentDeviceToken();

    $http(HTTPconfig).then(function(resp) {
      dfd.resolve(resp.data);
      console.log(resp)

      // after issuing new pass, we need to update the data we have in the app
      GetFullDataSet.fetch(AccountService.getCurrentDeviceToken());

      if (onSuccess) {
        onSuccess();
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
