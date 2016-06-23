/**
 * @module helpers
 * Helpers Services
 */

angular.module('helpers', [])

/**
 * @module helpers
 * @service parsePassIcons
 * @desc Parsing doortype into door icon
 * @param doorType {String}
 */
.factory('parsePassIcons', function() {
  return function (doorType) {
    var defaultIcon = "apartment";

    if (!_.isString(doorType)) {
      return defaultIcon;
    }

    var check = function (str) {
      return doorType.indexOf(str) > -1
    };

    if (check('entrance_building')) {
      return 'building';
    }
    if (check('officeroom')) {
      return 'office';
    }
    if (check('entrance_apartment')) {
      return 'apartment';
    }
    if (check('garage')) {
      return 'garage';
    }


    return defaultIcon;
  }
});
