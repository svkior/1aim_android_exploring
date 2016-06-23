/**
 * @module AccountService
 * @desc A shared place to store and deal with account data
 */

angular.module('accounts', [])
.factory('AccountService', function($state, $rootScope, updateAppRegistrationToken) {
  // Constansts
  // ---------------
  var LOCALSTORAGE_KEY = "AccountService.data";

  // Variables
  // ---------------
  // @var data obejct where everthing is stored
  var data = {
    accounts: {},
    currentUserId: null
  };

  // Private functions
  // ---------------
  /**
   * @private
   * @desc set the data object to the local storage, should be call by any setter function
   */
  var setDataToLocalStorage = function () {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(data));
  };

  /**
   * @private
   * @desc Reads data from local storage and sets it to the localStorage, should be called when the app initilized
   */
  var setDataFromLocalStorage = function () {
    var localStorageData = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY));
    if (_.isObject(localStorageData)) {
      data = localStorageData;
    }
  };

  var init = function () {
    setDataFromLocalStorage();
  };

  // Exports
  // ----------------

  // Setters functions
  // XXX: if you add any, make sure you add the LS handler, aka setDataToLocalStorage()
  // ------------------

  /**
   * @desc add an account object into the accounts object.
   * @desc The key is always the userId comming from the registerDevice call
   * @param loginObject {object} resp.data from the registerDevice call
   */
  var addAccount = function (loginObject) {
    var userId = loginObject.userId;
    data.accounts[userId] = loginObject;
    setCurrentUserId(userId);

    setDataToLocalStorage();
  };

  /**
   * @desc remove account from the account obejct
   * @param userId {String}
   */
  var removeAccount = function (userId) {
    if (!data.accounts[userId]) {
      return;
    }
    delete data.accounts[userId];

    setDataToLocalStorage();
  };

  /**
   * @desc Set the current user id that the app is showing
   * @param userId {String}
   */
  var setCurrentUserId = function (userId) {
    if (!_.isString(userId) || !data.accounts[userId]) {
      return;
    }
    data.currentUserId = userId;

    setDataToLocalStorage();
  };


  /**
   * @desc Pretty stright forward. Setting the data from the fullDataSet Call to the account object
   * @param userId {String}
   * @param fullDataSet {Object} data.resp from getFullDataSet
   */
  var setFullDataSetToAccount = function (userId, fullDataSet) {
    if (!data.accounts[userId]) {
      return;
    }
    getAccountByUserId(userId).fullDataSet = fullDataSet;

    setDataToLocalStorage();
  };

  /**
   * @desc change account to another account
   * @param userId {string}
   */
  var changeAccount = function (userId) {
    setCurrentUserId(userId);
    $rootScope.$emit('getFullDataSet.refetch'); // tell pass collection to resent themselves
    $state.go('app.passes')
  };

  /**
   * @desc logout from current account.
   */
  var logoutCurrentAccount = function () {
    updateAppRegistrationToken(getCurrentDeviceToken(), null); // unregister app from notifications with an empty string
    removeAccount(getCurrentUserId()); // remove account
    $rootScope.$emit('getFullDataSet.refetch');
    // if there's any accounts, go to first account
    if (hasAccounts()) {
      changeAccount(_.map(getAccounts())[0].userId);
    } else {
      $state.go('app.login');
    }
  };

  /**
   * @desc update GCM/APM registration token (AKA registrationId)
   * @param registrationId {String} AKA registrationToken
   */
  var updateCurrentAccountRegistrationToken = function (registrationId) {
    getCurrentAccount().registrationToken = registrationId;
    updateAppRegistrationToken(getCurrentDeviceToken(), registrationId);
  }

  // Getters functions
  // -------------

  var getAccountByUserId = function (userId) {
    if (!data.accounts[userId]) {
      return;
    }
    return data.accounts[userId];
  };

  var getCurrentUserId = function () {
    return data.currentUserId;
  };

  var getCurrentAccount = function () {
    return data.accounts[getCurrentUserId()];
  };

  var getCurrentDeviceToken = function () {
    if (!data.accounts[getCurrentUserId()]) {
      return;
    }
    return data.accounts[getCurrentUserId()].deviceToken;
  };

  /**
   * @param userId {String}
   */
  var getFullDataSetByUserId = function (userId) {
    return getAccountByUserId(userId).fullDataSet;
  };

  var getCurrentAccountFullDataSet = function () {
    if (!getCurrentAccount()) {
      return;
    }
    return getCurrentAccount().fullDataSet;
  };

  /**
   * Get accounts object
   */
  var getAccounts = function () {
    return data.accounts;
  };

  /**
   * @desc Get a user associated user object by its id, for the current user
   * @param id {String} associated user id
   */
  var getAssociatedUserById = function (associatedUserId) {
    var fullDataSet = getCurrentAccountFullDataSet();
    if (!fullDataSet || !_.isEmpty(fullDataSet.associatedUsers)) {
      return;
    }

    return _.find(fullDataSet.associatedUsers, function (assoUser) {
      return assoUser.id === associatedUserId;
    })
  };

  // Checkers functions
  // --------------

  /**
   * @desc Check if user has accounts.
   * @desc Handy when it comes to check if the user must login before using other parts of the app
   */
  var hasAccounts = function () {
    return !_.isEmpty(data.accounts);
  };

  // execute init function
  init();

  return {
    addAccount: addAccount,
    getCurrentUserId: getCurrentUserId,
    getAccountByUserId: getAccountByUserId,
    getCurrentAccount: getCurrentAccount,
    getCurrentDeviceToken: getCurrentDeviceToken,
    setFullDataSetToAccount: setFullDataSetToAccount,
    getFullDataSetByUserId: getFullDataSetByUserId,
    getCurrentAccountFullDataSet: getCurrentAccountFullDataSet,
    getAssociatedUserById: getAssociatedUserById,
    hasAccounts: hasAccounts,
    getAccounts: getAccounts,
    updateCurrentAccountRegistrationToken: updateCurrentAccountRegistrationToken,
    changeAccount: changeAccount,
    logoutCurrentAccount: logoutCurrentAccount
  }
});
