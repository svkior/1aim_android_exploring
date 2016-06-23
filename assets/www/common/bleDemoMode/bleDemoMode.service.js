/**
 * @module bleDemoMode
 * @desc continously sends out door open command over BLE when turned on
 */

angular.module('bleDemo', [])
.factory("bleDemoService", function($rootScope) {
    //nrf uart service uuid
    var SERVICE_ID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
    //nrf uartTX characteristc uuid
    var TX_CHARACTERISTIC_ID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
    //polling interval
    var updateInterval = 250; //send message 4 times per second
    var scanTime = 1000;

    //state machine
    var activated = false;
    var connected = false;
    var scanning = false;
    var currentDeviceID = "";

    function bleLoop() {
        //show error message if user tries to use ble on a device without ble capabilites
        if(activated && !window["ble"]) {
            alert("This device does not support Bluetooth Low Energy.");
            stop();
            return;
        }
        //do nothing if bledemo is turned off or the currently selected device has no ble functionality
        if(!activated || !currentDeviceID) return;
        bleCheckEnabled(function() {
            //1. scan for device
            if(!connected && !scanning) {
                bleScanForDevice(function(){
                    //2. found device, lets connect!
		    ble.connect(currentDeviceID, 
			function(){connected=true;bleLoop()}, 
			function(){connected=false;bleLoop()});
                }, bleLoop);
                setTimeout(bleStopScan, scanTime);
            }
            //3. we're connected, now lets send the open command periodically, the door will open when we're near enough to it
            else if(connected) {
                bleSendOpenCommand();
                setTimeout(bleLoop, updateInterval);
            } else if(scanning) {
                //wait for scan to finish
            }
        });
    }
    function bleScanForDevice(fnsuccess, fnfail) {
        scanning = true;
        //we only search for devices that advertise the correct service id
        ble.startScan([SERVICE_ID], function(device){
            if(device.id == currentDeviceID) {
                //we found a ble device with the beacon id of currently selected pass!
                //stop the scan and call the next function
                ble.stopScan(fnsuccess, fnfail)
            }
        }, fnfail);
    }
    function bleStopScan() {
	if(scanning) {        
		scanning = false;
		ble.stopScan();
	}	
    }

    function bleConnect() {
        ble.connect(currentDeviceID, function(){connected=true;}, function(){connected=false;});
    }
    function bleDisconnect() {
        ble.disconnect(currentDeviceID);
        connected=false;
    }
    function bleSendOpenCommand() {
        var payload = new Uint8Array(1);
        payload[0] = 79; //'O'
        ble.writeWithoutResponse(currentDeviceID, SERVICE_ID, TX_CHARACTERISTIC_ID, payload.buffer); //we dont care if it was successful or not, as we are sending all the time anyways and getting notified when the connection drops
    }

    function bleCheckEnabled(fnsuccess, fnfail) {
        ble.isEnabled(fnsuccess, function() {
            if(!ionic.Platform.isAndroid()) {
                alert("You have to enable Bluetooth on your device to use this feature!");
                if(!ionic.Platform.isIOS()) {
                    //this will open the ble settings
                    ble.showBluetoothSettings();
                }
                ble.isEnabled(fnsuccess, function() {
                    stop();
                    if(fnfail)fnfail();
                });
            } else {
                //this will ask the user for permission to enable ble
                ble.enable(fnsuccess, function() {
                    alert("You have to enable Bluetooth on your device to use this feature!");
                    stop();
                    if(fnfail)fnfail();
                });
            }
        });
    }

    //exports
    function setDeviceId(did) {
        //disconnect from current device if a connection is still open and the id changed
        if(connected && did != currentDeviceID) bleDisconnect();
        currentDeviceID = did;
        bleLoop();
    }

    function changeState(state) {
        //disconnect from current device when turning ble off
        if(!state && connected) bleDisconnect();
        activated = state;
        $rootScope.bleDemoMode.activated = state;
        bleLoop();
    }

    function start() { changeState(true); };
    function stop() { changeState(false); };

    //events
    $rootScope.$on('bledemo.stateChanged', function(event, state) {
        console.log("ble state changed ", state);
        changeState(state);
    });
    $rootScope.$on('bledemo.deviceIdChanged', function(event, deviceid) {
        console.log("ble deviceid changed ", deviceid);
        setDeviceId(deviceid);
    });

    //final export
    return {
        setDeviceId: setDeviceId,
        changeState: changeState,
        start: start,
        stop: stop
    };
});
