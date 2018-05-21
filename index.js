// IFTTT Data
const apiKey = '<IFTTTMaker Key>';
const event  =  '<IFTTTMaker Event>';

// TPLink Data
const tpLinkAccount = '<tpLinkAccount>';                    // Kasa account
const tpLinkAccountPassword = '<tpLinkAccountPassword>';           // Kasa password
const tpLinkDeviceId = '<UUID4>';                   // A generated UUID4
const tpLinkPlugDeviceName = "<tpLinkPlugDeviceName>";         // Smart plug name

// Miner Data
const timeInterval = 3000;     // time interval for power usage check in ms 
const powerValue = 1200;         // minimum power consumption in W

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
    var consumption = energyData.power
    var time = getDateTime();

    console.log( parseInt(consumption) , time);

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

function getDateTime() {
    var now     = new Date();
    var year    = now.getFullYear();
    var month   = now.getMonth()+1;
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds();
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }
    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }
    var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;
     return dateTime;
}

start();