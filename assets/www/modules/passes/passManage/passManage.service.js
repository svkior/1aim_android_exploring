/**
 * @module Passes
 * @module IssuedPasses Services
 */

angular.module('passes')
.factory('IssuedPassModel', function(AccountService) {

  return function (pass, issuedPass) {
    this.issuedPass = issuedPass;
    this.passData = pass;
    this.issuerInfo = AccountService.getAssociatedUserById(issuedPass.issuerId);
    this.recipientInfo = AccountService.getAssociatedUserById(issuedPass.recipientId);
  };
})

.factory('IssuedPassCollection', function (IssuedPassModel) {
  return function (pass) {
    this.issuedPasses = _.map(pass.pass.issuedPasses, function (issuedPass) {
      return new IssuedPassModel(pass, issuedPass)
    });

    this.geIssuedPassById = function (id) {
      return _.find(this.issuedPasses, function (issuedPass) {
        return issuedPass.issuedPass.id === id;
      });
    };

    return this;
  };
})

/**
 * @module Passes
 * @name Issued Pass Collections Service
 * @desc Shared place issued passes collections are stored
 */
.factory('IssuedPassCollectionsService', function (IssuedPassCollection, $rootScope) {
  var collections = {};

  $rootScope.$on('getFullDataSet.refetch', function () {
    collections = {};
  });

  var getCollectionByPass = function (pass) {
    if (!collections[pass.passId]) {
      collections[pass.passId] = new IssuedPassCollection(pass);
    }

    return collections[pass.passId];
  };

  return {
    getCollectionByPass: getCollectionByPass
  }
});
