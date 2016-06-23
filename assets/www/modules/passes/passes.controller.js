/**
 * @module Passes
 * @module Passes controller
 */

angular.module('passes')
.controller('PassesController', function($scope, $rootScope, $state, $stateParams, PassesCollectionsService, RotationTrackerService, BlinkerService, parsePassIcons, $ionicViewSwitcher, $translate) {
  var passCollection = [];
  var currentPass = {};

  /**
   * @desc go to first pass in the collection
   */
  var goToFirstPass = function () {
    if (!passCollection || !_.isArray(passCollection.passes)) {
      return;
    }
    $state.go('app.pass', {id: passCollection.passes[0].passId});
  };

  /**
   * @desc Set data model form Passes service to controller variables;
   */
  var setDataModels = function () {
    passCollection = PassesCollectionsService.getFirstCollection() || [];
    if (!_.isEmpty(passCollection)) {
      currentPass = passCollection.getPassById($stateParams.id) || {};
    } else {
      currentPass = {};
    }
  };

  /**
   * @desc Event for everytime user enter the view
   */
  var onViewEnter = function () {
    setDataModels();
    if (_.isEmpty(currentPass)) {
      goToFirstPass();
      return;
    }

    RotationTrackerService.watch();
  };

  // Init function
  var init = function () {
    onViewEnter();
    $scope.$on('$ionicView.enter', onViewEnter);
  };

  // initilizing
  init();

  //helper function
  var lightaccessstr2colorarr = function(laseq) {
        var keyarr = [[255,0,0],[255,0,0],[255,0,0],[255,0,0]];
        var r=false;
        laseq.split('').forEach(function(c) {
            var bin = parseInt(c,16).toString(2); //convert from hex to dec, then to binary
            bin = ("0000" +  bin).slice(-4); //add left padding zeroes
            for(var i=0;i<bin.length;i=i+2) {
                keyarr.push([r?255:0,parseInt(bin[i])*255,parseInt(bin[i+1])*255]);
                r=!r;
            }
        });
        var result = [32];
        keyarr.forEach(function(c) {
            result.push("rgb("+c[0]+","+c[1]+","+c[2]+")")
        });
        return result;
    }

  // XXX: Why is this in the window scope? Good Question!
  // in order to make sure blinker performance will not suffer,
  // we are clearing the DOM from any other element but the `body`.
  // Blinker inside an controlling scope might get undefined in the process, and wiil not be available anymore.

  // TODO: Replace this with real data. (atm there's only fake data coming from the API)

  if (!currentPass || !currentPass.pass || !currentPass.pass.keys) {
    // this may be because it starts in the future
    window.blinker = new BlinkerService();
    window.blinkerEnabled = false;
    // console.log("INVALID BLINKER BECAUSE CANNOT FIND KEY! IT STARTS AT: ", currentPass.pass.passInfo.validity.nextPeriods[0].start);
  }

  // this variable is not actually used cause the tab will not be created
  window.showToUser = true;
  if (currentPass.pass && currentPass.pass.passInfo && currentPass.pass.passInfo.validity && currentPass.pass.passInfo.validity.total) {
    var now = moment();
    var end = moment(currentPass.pass.passInfo.validity.total.end);
    var start = moment(currentPass.pass.passInfo.validity.total.start);

    console.log("now: ", now.format(), " - start: ", start.format(), " - end: ", end.format());
    // check if total.end < now
    if (end.isBefore(now)) {
      // this pass shouldn't be shown to the user!
      window.showToUser = false;
      console.log("INVALID BLINKER BECAUSE ITS END IS BEFORE THAN NOW!");
      window.blinker = new BlinkerService();
      window.blinkerEnabled = false;
    } else if (start.isAfter(now)) {
      // it will be valid at currentPass.pass.passInfo.validity.nextPeriods[0].start
      var nextStart = moment(currentPass.pass.passInfo.validity.nextPeriods[0].start);

      if (nextStart.isBefore(now)) {
        window.blinker = new BlinkerService();
        console.log("WEIRD CASE!");
        // this pass shouldn't be shown to the user!
        window.showToUser = false;
        window.blinkerEnabled = false;
      } else {
        window.blinker = new BlinkerService();
        console.log("INVALID BLINKER BECAUSE IT STARTS IN THE FUTURE!");
        window.blinkerEnabled = false;
      }
    } else {
      // it is valid, so blinker should be active
      window.blinker = new BlinkerService(lightaccessstr2colorarr(currentPass.pass.keys[0].lightAccess));
      window.blinkerEnabled = true;
      console.log("VALID BLINKER!");
    }
  }


  // Template scope
  // -------------

  // data models to template scope
  $scope.passes = passCollection.passes; // All passes

  $scope.pass = currentPass.pass || {}; // current pass
  $scope.door = currentPass.door; // current pass door
  $scope.building = currentPass.building; // current pass building

  $scope.canIssue = currentPass.pass && currentPass.pass.passInfo && currentPass.pass.passInfo.canIssue;
  
  $scope.canAccessCamera = true;
  $scope.canViewDetails = true;
  $scope.activePass = $scope.pass.id; // current active pass id
  // Functions
  // ---------------
  /**
   * Passing moment and icon parser to template scope
   */
  $scope.moment = moment;
  $scope.parsePassIcons = parsePassIcons;

  /**
   * @desc Event callback whever user clicks on a pass tab
   * @desc disable default page transitions on the click
   */
  $scope.onPassClick = function () {
    $ionicViewSwitcher.nextTransition('none');
    $rootScope.searchActiveState = false;
    $rootScope.search.query = '';
  };

  $scope.showPassToUser = function (p) {
    var end = moment(p.pass.passInfo.validity.total.end);
    var now = moment();
    var start = p.pass.passInfo.validity.total.start;
    var next = p.pass.passInfo.validity.nextPeriods[0].start;

    if (end.isBefore(now)) {
      return false;
    }
    if (now.isBefore(end) && 
      moment(start).isAfter(now) && 
      moment(next).isBefore(now)) {
      return false;
    }
    return true;
  };
 
  $scope.getNextPeriodStartDate = function(pass, building) {
    var dateFromServer = pass.passInfo.validity.nextPeriods[0].start.concat(".000Z");
    return moment(dateFromServer).tz(building.location.timeZone).format('D MMM YYYY');
  }

  $scope.getNextPeriodStartTime = function(pass, building) {
    var dateFromServer = pass.passInfo.validity.nextPeriods[0].start.concat(".000Z");
    return moment(dateFromServer).tz(building.location.timeZone).format('H:mm:ss');
  }
  /**
   * @desc event function for button click
   * @desc will toggle the blinker
   */
  $scope.onToggleButtonClick = window.blinker.toggle;
  $scope.blinkerIsEnabled = window.blinkerEnabled;

  /**
   * @desc Change scope's active pass, will render the new pass
   */
  $scope.showPass = function () {
    $scope.activePass = $scope.pass.id;
  };


  // Watch search query from another view, and filter collection accordingly
  $rootScope.$watch('search.query', function () {
    if (!_.isEmpty(passCollection)) {
      $scope.passes = passCollection.filter($rootScope.search.query) || [];
    }
  });
});
