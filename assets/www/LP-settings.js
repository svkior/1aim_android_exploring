/**
 * Global Settings.
 * Ideally this should be on gitnore and contain passwords and other Global variables
 *
 */

window.LP = {
  settings: {
    apiRoot: "https://api.1aim.com/proto/v1/",
    GCMSenderId: '438637649912',
    stremaerServerOptions: {
      host: 'api.1aim.com',
    	port: 443,
    	path: '/proto/v1/streamer',
    	secure: true
    }
  },
  enviroment: "debug",
  enviroments: {
    debug: {
      // forcing mobile session (not web session) for debugging in the browser
      forceMobileSession: false
    }
  }
};