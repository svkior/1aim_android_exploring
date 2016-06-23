/**
 * @module Passes
 * @desc Remodelling the data from the API to make sense templating-wise
 * @desc Access through PassesCollectionsService, where all collections are stored
 *
 * @desc Data model is as follows:
 * @desc collections:Array -> collection:Object(passes:Array) -> pass:Object(passId:string, pass:Object, door:Object, building:Object)
 */

/**
 * @module Passes
 * @name Pass Model
 */
angular.module('passes')
.factory('PassModel', function(AccountService) {

  var lookupPass = function (data, passId) {
    return _.find(data.passes, function (pass) {
      return pass.id === passId;
    });
  };

  var lookupDoor = function (data, doorId) {
    return _.find(data.doors, function (door) {
      return door.id === doorId;
    });
  };

  var lookupBuilding = function (data, buildingId) {
    return _.find(data.buildings, function (building) {
      return building.id === buildingId;
    });
  };

  return function (data, id) {
    this.passId = id;
    this.pass = lookupPass(data, this.passId);
    this.door = lookupDoor(data, this.pass.passInfo.doorId);
    this.building = lookupBuilding(data, this.door.buildingId);
    this.issuerInfo = AccountService.getAssociatedUserById(this.pass.passInfo.issuerId);
  };
})

/**
 * @module Passes
 * @name Passes Collection
 */
.factory('PassesCollection', function(PassModel) {
  return function (data) {
    this.passes = _.sortBy(_.map(data.passes, function (pass) {
      return new PassModel(data, pass.id);
    }), function (p) {
      return p.door.doorType;
    });

    this.getPassById = function (id) {
      return _.find(this.passes, function (pass) {
        return pass.passId === id;
      });
    };

    /**
     * @param searchQuery {string}
     * @return passes {Array} Filtered passes collection by name 
     */
    this.filter = function (searchQuery) {
      if (!searchQuery) {
        return this.passes;
      }

      var query = searchQuery.toLocaleLowerCase();

      return _.filter(this.passes, function (pass) {
        if (!pass || !pass.door) {
          return;
        }
        var value = (pass.door.name).toLocaleLowerCase();
        return value.search(query) > -1;
      });
    };

    return this;
  };
})

/**
 * @module Passes
 * @name Passes Collections
 * @desc Shared place collection are stored
 */
.factory('PassesCollectionsService', function (PassesCollection, $rootScope, AccountService) {
  var collections = [];

  var init = function () {
    setCollections(AccountService.getCurrentAccountFullDataSet());
    $rootScope.$on('getFullDataSet.refetch', function () {
      setCollections(AccountService.getCurrentAccountFullDataSet());
    });
  }

  var setCollections = function (data) {
    if (!_.isObject(data)) {
      collections = [];
      return;
    }
    collections = _.map(data.providers, function (provider) {
      return new PassesCollection(data);
    });
  };

  var getCollections = function () {
    if (_.isEmpty(collections)) {
      setCollections(AccountService.getCurrentAccountFullDataSet());
    }

    return collections;
  };

  var getFirstCollection = function () {
    var c = getCollections();
    if (!c) {
      return;
    }
    return c[0];
  };

  init();

  return {
    getFirstCollection: getFirstCollection,
    getCollections: getCollections,
    collections: collections
  }
});
