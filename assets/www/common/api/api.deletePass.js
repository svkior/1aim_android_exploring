/**
 * @module api
 * @service deletePass
 * @desc frontend bridge to deletePass call
 * @param params {Object}
 * @example deletePass({passIds: [issuedPassId]});
 */

angular.module('api', [])
.factory('deletePass', function($http, $q, AccountService, GetFullDataSet) {
  var baseURL = LP.settings.apiRoot;
  var url = baseURL + "deletePass";

  var HTTPconfig = {
    url: url,
    method: 'POST',
    data: {
      auth: {}
    }
  };

  return function (params) {
    var dfd = $q.defer();
    _.extend(HTTPconfig.data, params);
    var deviceToken = AccountService.getCurrentDeviceToken()
    HTTPconfig.data.auth.deviceToken = deviceToken;
    $http(HTTPconfig).then(function(resp) {
      dfd.resolve(resp.data);
      console.log(resp)
      GetFullDataSet.fetch(deviceToken);
    }, function(err) {
      console.error('ERR', err);
    });
    return dfd.promise;
  };

});
