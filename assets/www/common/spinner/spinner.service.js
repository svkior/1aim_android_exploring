/**
 * @module SpinnerService
 */

angular.module('spinner', [])
.factory('SpinnerService', function() {
  return {
    rootSpinnerActiveState: false,
    startRootSpinner: function () {
      document.getElementById('root-spinner').className = 'active';
      this.rootSpinnerActiveState = true;
    },
    stopRootSpinner: function () {
      document.getElementById('root-spinner').className = ''
      this.rootSpinnerActiveState = false;
    },
    toggleRootSpinner: function () {
      if (!this.rootSpinnerActiveState) {
        this.startRootSpinner();
      } else {
        this.stopRootSpinner();
      }
    }
  }
})
