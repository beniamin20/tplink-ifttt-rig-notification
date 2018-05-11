// npm install iftttmaker               - https://github.com/kolarcz/node-iftttmaker
// npm install --save tplink-cloud-api  - https://github.com/adumont/tplink-cloud-api

// IFTTT Data
const apiKey = '<IFTTTMaker apiKey>';
const event  =  '<IFTTTMaker event>';

// TPLink Data
const tpLinkAccount = '<TPLink account>';                    // Kasa account
const tpLinkAccountPassword = '<TPLink password>';           // Kasa password
const tpLinkDeviceId = '<UUID4 deviceId>';                   // A generated UUID4
const tpLinkPlugDeviceName = '<TPLink Device Name>';         // Smart plug name

// Miner Data
const timeInterval = 30000;     // time interval for power usage check in ms 
const powerValue = 600;         // minimum power consumption in W

// =====================================================================================

var TPLink = require('tplink-cloud-api')
var IFTTTMaker = require('iftttmaker')(apiKey);
var myVar;
var myTPLink;

async function start() {
  let response

  myTPLink = await TPLink.login(tpLinkAccount, tpLinkAccountPassword, tpLinkDeviceId);

  console.log( myTPLink.getToken() )
  var dl = await myTPLink.getDeviceList();
console.log('Device List ==================')
  console.log( dl );

  var myPlug = myTPLink.getHS100(tpLinkPlugDeviceName);

  console.log("Rig Plug deviceId = " + myPlug.getDeviceId())

  var rsp = await myPlug.powerOn();
  console.log("Rig Plug powerOn = " + rsp );

  rsp = await myPlug.getSysInfo();
  console.log("relay_state=" + rsp.relay_state );

  console.log('>>> Getting Smart Plug Energy Data');

  poolData();
}

async function poolData() {
    myVar = setInterval(checkConsumption, timeInterval);
}

async function checkConsumption() {
    var energyData = await myTPLink.getHS110(tpLinkPlugDeviceName).getPowerUsage();
    var consumption = energyData.power_mw / 1000
    console.log(consumption);

    if ( consumption < powerValue ) {
      sendNotification();
    } 
}

async function sendNotification() {
  IFTTTMaker.send(event).then(function () {
  console.log('> Request was sent');

}).catch(function (error) {
  console.log('> The request could not be sent:', error);

});
}

start();