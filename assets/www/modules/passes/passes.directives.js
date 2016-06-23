/**
 * @module passes
 * @desc Passes Directives
 * @desc All passes-realted directives to reuse DOM generation logic
 */

angular.module('passes')
/**
 * @desc check which string should be used, "expired" or "expired", based on given time from scope
 * @return DOM Element
 */
.directive('expiredOrExpires', function ($rootScope) {
  return {
    link : function (scope, elem, attrs) {
      scope.expirationFormatted = moment(attrs.expiration).tz(attrs.buildingTimezone).format('D MMM YYYY');
      if (moment(attrs.expiration) < moment()) {
        scope.wording = "PASSES.EXPIRED-AT";
      } else {
        scope.wording = "PASSES.EXPIRES-AT";
      }
    },
    template: function (elements, attrs) {
      return '<span translate translate-values="{date: expirationFormatted}"> {{wording}} </span>';
    }
  }
})
// linking input date format for the datepickers
.directive('inputDateFormat', function() {
  return {
    link: function (scope, elements, attrs) {
      scope.$watch(attrs.ngModel, function (val) {
        if (!val) {
          return;
        }
        elements[0].value = moment(val).format('ddd, DD MMM YYYY');
      });
    }
  };
});
