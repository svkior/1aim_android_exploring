/**
 * @module Singlepass
 * @module Singlepass controller
 * @desc AKA temporary pass
 * @desc uses the same pass.html template as the PassesController
 * @desc Data is recived from the fake-call api.singlePassClass
 */

angular.module('singlepass', [])
.controller('SinglepassController', function($scope, parsePassIcons, BlinkerService, data) {
  if (data.isWrongToken) {
    $scope.isWrongToken = true;
    return;
  }
  // Scoping
  // --------
  $scope.canIssue = false;
  $scope.canViewDetails = false;
  $scope.canAccessCamera = false;
  $scope.isWrongToken = false;

  // Data scoping
  $scope.pass = data.passes && data.passes[0] ? data.passes[0] : null;
  $scope.door = data.doors && data.doors[0] ? data.doors[0] : null;
  $scope.building = data.buildings && data.buildings[0] ? data.buildings[0] : null;
  $scope.parsePassIcons = parsePassIcons;

  // Blinker
  // TODO: Refactor this to fit with Blinker data from the API
  window.blinker = new BlinkerService([32,"rgb(255,0,0)","rgb(255,0,0)","rgb(255,0,0)","rgb(255,0,0)","rgb(0,255,0)","rgb(255,255,0)","rgb(0,255,0)","rgb(255,255,0)","rgb(0,255,0)","rgb(255,255,255)","rgb(0,255,0)","rgb(255,255,255)","rgb(0,255,255)","rgb(255,0,0)","rgb(0,255,255)","rgb(255,0,0)","rgb(0,0,0)",
  "rgb(255,255,0)","rgb(0,0,0)","rgb(255,0,255)","rgb(0,0,0)","rgb(255,0,0)","rgb(0,0,0)","rgb(255,0,0)"]);

  /**
   * @desc event function for button click
   * @desc will toggle the blinker
   */
  $scope.onToggleButtonClick = window.blinker.toggle;
});
