// npm install iftttmaker               - https://github.com/kolarcz/node-iftttmaker
// npm install --save tplink-cloud-api  - https://github.com/adumont/tplink-cloud-api

const apiKey = '<IFTTTMaker apiKey>';
const event = '<IFTTT event name>';
const timeInterval = 30000; // time interval for power usage check
const powerValue = 600; // minimum power consumption

var TPLink = require('tplink-cloud-api')
var IFTTTMaker = require('iftttmaker')(apiKey);
var myVar;
var myTPLink;

async function start() {
  let response

  myTPLink = await TPLink.login('<IFTTTMaker account>', '<IFTTTMaker password>', '<UUID4 deviceId>');

  console.log( myTPLink.getToken() )
  var dl = await myTPLink.getDeviceList();
console.log('Device List ==================')
  console.log( dl );

  var myPlug = myTPLink.getHS100("<TPLink Device Name>");

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
    var energyData = await myTPLink.getHS110("<TPLink Device Name>").getPowerUsage();
    var consumption = energyData.power_mw / 1000
    console.log(consumption);

    if ( consumption < powerValue ) {
      sendNotification();
    } 
}

async function sendNotification() {
  IFTTTMaker.send('rig_down').then(function () {
  console.log('> Request was sent');

}).catch(function (error) {
  console.log('> The request could not be sent:', error);

});
}

start();