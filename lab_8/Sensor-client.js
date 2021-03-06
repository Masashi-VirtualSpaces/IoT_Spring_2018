var awsIot = require('aws-iot-device-sdk');
var myThingName = 'Raspberrypi_Singh_Schafer';
var thingShadows = awsIot.thingShadow({
    keyPath: '../../Keys/7529fdeb09-private.pem.key', // path of private key
    certPath: '../../Keys/7529fdeb09-certificate.pem.crt', // path of certificate
    caPath: '../../Keys/CA.pem', // path of root file
    clientId: myThingName,
    region: 'us-west-2', // your region
    host: 'a36blmcb965lyg.iot.us-west-2.amazonaws.com'
});
mythingstate = {
    "state": {
        "reported": {
            "ip": "unknown"
        }
    }
}
var networkInterfaces = require('os').networkInterfaces();
mythingstate["state"]["reported"]["ip"] = networkInterfaces['wlan0'][0]['address'];
// PIR sensor connected to pin 7
// You can use any gpio pin
// install npm button library first
var Gpio = require('onoff').Gpio;
button = new Gpio(4, 'in', 'both');
// json data for dynamoDB
var msg = "{\"key\":\"value\"}";
console.log("Setup variables defined...");
thingShadows.on('connect', function () {
    console.log("Connected...");
    console.log("Registering...");
    thingShadows.register(myThingName);
    // An update right away causes a timeout error, so we wait
    //about 2 seconds
    setTimeout(function () {
        console.log("Updating my IP address...");
        clientTokenIP = thingShadows.update(myThingName, mythingstate);
        console.log("Update:" + clientTokenIP);
    }, 2500);
    // Code below just logs messages for info/debugging
    thingShadows.on('status',
        function (thingName, stat, clientToken, stateObject) {
            console.log('received ' + stat + ' on ' + thingName + ': ' +
                JSON.stringify(stateObject));
        });
    thingShadows.on('update',
        function (thingName, stateObject) {
            console.log('received update ' + ' on ' + thingName + ': ' +
                JSON.stringify(stateObject));
        });
    thingShadows.on('delta',
        function (thingName, stateObject) {
            console.log('received delta ' + ' on ' + thingName + ': ' +
                JSON.stringify(stateObject));
        });
    thingShadows.on('timeout',
        function (thingName, clientToken) {
            console.log('received timeout for ' + clientToken);
        });
    thingShadows
        .on('close', function () {
            console.log('close');
        });
    thingShadows
        .on('reconnect', function () {
            console.log('reconnect');
        });
    thingShadows
        .on('offline', function () {
            console.log('offline');
        });
    thingShadows
        .on('error', function (error) {
            console.log('error', error);
        });

    //Watch for motion detection. high for any movement
    button.watch(function (err, value) {
        console.log("Movement detected ");
        delete mythingstate['version']; //Cleanup to post to AWS
        mythingstate["state"]["reported"]["button"] = value;
        buttonStateResponse = thingShadows.update(myThingName,mythingstate);
        thingShadows.publish('topic/test', value.toString());
        //publish message
        console.log("Update:" + buttonStateResponse);
    });
});
