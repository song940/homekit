const HomeKit        = require('../../');
const Accessory      = HomeKit.Accessory;
const Service        = HomeKit.Service;
const Characteristic = HomeKit.Characteristic;
const uuid           = HomeKit.uuid;

var FAKE_GARAGE = {
  opened: false,
  open: function() {
    console.log("Opening the Garage!");
    //add your code here which allows the garage to open
    FAKE_GARAGE.opened = true;
  },
  close: function() {
    console.log("Closing the Garage!");
    //add your code here which allows the garage to close
    FAKE_GARAGE.opened = false;
  },
  identify: function() {
    //add your code here which allows the garage to be identified
    console.log("%s Identify!", garage.displayName);
  },
  status: function(){
    //use this section to get sensor values. set the boolean FAKE_GARAGE.opened with a sensor value.
    FAKE_GARAGE.opened = !FAKE_GARAGE.opened;
  }
};

var garageUUID = uuid.generate('hap-nodejs:accessories:'+'GarageDoor');
var garage = new Accessory('Garage Door', garageUUID);

garage
.getService(Service.AccessoryInformation)
.setCharacteristic(Characteristic.Manufacturer, "Liftmaster")
.setCharacteristic(Characteristic.Model, "Rev-1")
.setCharacteristic(Characteristic.SerialNumber, "TW000165");

garage.on('identify', function(paired, callback) {
FAKE_GARAGE.identify();
callback();
});

garage
.addService(Service.GarageDoorOpener, "Garage Door")
.setCharacteristic(Characteristic.TargetDoorState, Characteristic.TargetDoorState.CLOSED) // force initial state to CLOSED
.getCharacteristic(Characteristic.TargetDoorState)
.on('set', function(value, callback) {

  if (value == Characteristic.TargetDoorState.CLOSED) {
    FAKE_GARAGE.close();
    callback();

    garage
    .getService(Service.GarageDoorOpener)
    .setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSED);
  } else if (value == Characteristic.TargetDoorState.OPEN) {
    FAKE_GARAGE.open();
    callback();
    garage
    .getService(Service.GarageDoorOpener)
    .setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.OPEN);
  }
});

garage
.getService(Service.GarageDoorOpener)
.getCharacteristic(Characteristic.CurrentDoorState)
.on('get', function(callback) {
  var err = null;
  FAKE_GARAGE.status();
  if (FAKE_GARAGE.opened) {
    callback(err, Characteristic.CurrentDoorState.OPEN);
  } else {
    callback(err, Characteristic.CurrentDoorState.CLOSED);
  }
});

module.exports = garage;