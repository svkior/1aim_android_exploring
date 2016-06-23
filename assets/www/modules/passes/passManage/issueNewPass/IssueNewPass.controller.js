/**
 * @module Passes
 * @module Issue new pass controller
 */

angular.module('passes')
.controller('IssueNewPassController', function ($scope, $stateParams, issuePass, $ionicHistory, $ionicPopup, $translate) {
  $scope.newPassModel = {
    "passId": $stateParams.passId,
    "alias": null,
    "name": null,
    "email": null,
    "phone": null,
    "validity": {
        "start": null,
        "end": null
    },
    "timeRestrictions": [],
    "accountNeeded": true,
    "canIssue": false,
    "isAdmin": false
  };

  var timezone = $stateParams.timezone.replace("-", "/");

  var dpOptions = {
    from: new Date(),
    setButtonType: 'button-positive',
    titleLabel: $translate.instant('DATEPICKER.TITLE'),
    todayLabel: $translate.instant('DATEPICKER.TODAY'),
    setLabel: $translate.instant('DATEPICKER.SET'),
    closeLabel: $translate.instant('DATEPICKER.CLOSE')
  };

  $scope.dpEnd = _.clone(dpOptions);
  $scope.dpStart = _.clone(dpOptions);

  $scope.dpStart.callback = function (date) {
    var newDate = moment(date).tz(timezone);
    newDate.hours(0);

    var localISOTime = newDate.toISOString();
    console.log("start after converting: ", localISOTime);
    $scope.newPassModel.validity['start'] = localISOTime;
    $scope.dpEnd.from = date;
  };

  $scope.dpEnd.callback = function (date) {
    var newDate = moment(date).tz(timezone);
    newDate.hours(23);
    newDate.minutes(59);
    newDate.seconds(59);
    var localISOTime = newDate.toISOString();
    console.log("end date after converting: ", localISOTime);
    $scope.newPassModel.validity['end'] = localISOTime;
  };

  $scope.canImportContact = !!navigator.contacts;

  $scope.applyContactData = function (contact) {
    if($scope.$$phase) {
      return;
    }
    $scope.newPassModel.name = contact.displayName || (contact.name.formatted);
    if (contact.emails && contact.emails[0]) {
      $scope.newPassModel.email = contact.emails[0].value;
    } else {
      $scope.newPassModel.email = "";
    }
    if (contact.phoneNumbers && contact.phoneNumbers[0]) {
      var mobile = _.find(contact.phoneNumbers, function (num) {
        return num.type === 'mobile';
      }) || {};
      $scope.newPassModel.phone = (mobile.value || contact.phoneNumbers[0].value || "").replace(" ", "").replace("+", '');
    }
    $scope.$apply()
  };

  $scope.importContact = function () {
    $scope.applyContactData('contact');
    navigator.contacts.pickContact(function(contact) {
      $scope.applyContactData(contact);
      window.sc = $scope;
    });
  };

  $scope.issuePass = function () {
    issuePass($scope.newPassModel, function () {
      localStorage.removeItem('newPassModel:' + $stateParams.passId);
      $ionicHistory.goBack();
    }, function (err) {
      console.log(err)
      $ionicPopup.alert({
        title: $translate.instant('ERRORS.PROBLEM-TITLE'),
        template: $translate.instant('ERRORS.NEW-PASS-ERROR')
      });
    });
  };
});
