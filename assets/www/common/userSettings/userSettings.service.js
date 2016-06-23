/**
 * @module UserData
 * @desc A shared place to store and access some user data
 */

angular.module('userSettings', [])
.factory('UserSettingsService', function($translate) {
  // @public
  var settings = {};

  // @private
  // Default settings, if there no setting stored in localStorage, service will use this object
  var defaultSettings = {
    isSilentMode: false,
    language: 'en'
  };

  // @private
  var init = function () {
    getSettingsFromLocalStorage();
    changeLanguage(settings.language);
  };

  // @private
  var setSettingsToLocalStorage = function () {
    localStorage.setItem('UserSettings', JSON.stringify(settings || defaultSettings));
  };

  // @private
  var getSettingsFromLocalStorage = function () {
    settings = JSON.parse(localStorage.getItem('UserSettings')) || defaultSettings;
  };

  // Public functions
  // --------------------
  /**
   * @desc change app language
   * @param langkey (string) "de" or "en" (Could scale to more languages)
   */
  var changeLanguage = function (langKey) {
    settings.language = langKey;
    $translate.use(langKey);
    setSettingsToLocalStorage();
  };

  // Different on different platforms, this will return the right perfix for file path
  var getFilePath = function () {
    if (ionic.Platform.isIOS()) {
      return '/';
    } else if(ionic.Platform.isAndroid()) {
      return 'file:///android_asset/www/';
    }
  };

  var getDeviceName = function () {
    if (!ionic.Platform.device().model) {
      return 'web-' + ionic.Platform.platform();
    }
    return ionic.Platform.device().model;
  };

  var getDeviceOS = function () {
    if (!ionic.Platform.device().platform) {
      return 'web';
    }
    return ionic.Platform.device().platform.toLowerCase();
  };

  init();

  return {
    settings: settings,
    changeLanguage: changeLanguage,
    getDeviceOS: getDeviceOS,
    getFilePath: getFilePath,
    getDeviceName: getDeviceName

  }
});
