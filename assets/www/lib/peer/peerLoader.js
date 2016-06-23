/**
 * Decides which peer.js to load. IOS compatible or not.
 */

(function() {
  var script = document.createElement('script');
  var head = document.getElementsByTagName('head')[0];
  script.type = 'text/javascript';
  if (ionic.Platform.isIOS()) {
    script.src = 'lib/peer/peer-ios-modified.js';
  } else {
    script.src = 'lib/peer/peer.js';
  }
  head.appendChild(script);
})();
