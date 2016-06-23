/**
 * @module api
 * @service deletePass
 * @desc frontend bridge to getFullDataSet call
 * @example GetFullDataSet.fetch()
 */

angular.module('api')
.factory('GetFullDataSet', function($http, $q, $rootScope, AccountService) {
  var fullDataSet;
  var baseURL = LP.settings.apiRoot;
  var url = baseURL + "getFullDataSet";
  var HTTPconfig = {
    url: url,
    method: 'POST',
    data: {
      auth: {}
    }
  };

  // @private
  // Get locla data from local storage
  var getLocalData = function () {
    return AccountService.getCurrentAccountFullDataSet();
  };

  /**
   * @private
   * @desc fetching data from backend
   * @param onSuccess {function}
   * @param onError {function}
   * @return data {Object | Promise} all data from /getPasses endpoint
   */
  var fetch = function (deviceToken, onSuccess, options) {
    var dfd = $q.defer();
    options = options || {};
    HTTPconfig.data.auth.deviceToken = deviceToken;
    $http(HTTPconfig).then(function(resp) {
      console.log(resp);
      dfd.resolve(resp.data);

      if (!options.isSinglePass) {
        // Set incoming data to the AccountService
        AccountService.setFullDataSetToAccount(AccountService.getCurrentUserId(), resp.data);

        // Tell the app that they need to update collections etc.
        $rootScope.$emit('getFullDataSet.refetch');
      }

      if (onSuccess) {
        onSuccess(resp.data);
      }
    }, function(err) {

      if (options.onError) {
        options.onError();
      }

      if (!options.isSinglePass) {
        return;
      }
      if (err.data && err.data.action === 'delete_token_data') {
          AccountService.logoutCurrentAccount();
          return;
      }

      if (getLocalData()) {
        dfd.resolve(getLocalData());
      }
    });
    return dfd.promise;
  };

  return {
    fetch: fetch
  };

});
