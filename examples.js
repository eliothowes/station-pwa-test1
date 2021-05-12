// Get Services
navigator.bluetooth.requestDevice({
  filters: [
    {
      services: [
        '0000180a-0000-1000-8000-00805f9b34fb',
        '00001809-0000-1000-8000-00805f9b34fb'
      ]
    }
  ]
})
.then(async tdoc => {
  await tdoc.gatt.connect()
  const server = await tdoc.gatt.connect()
  return server
})
.then(async server => server.getPrimaryServices())
.then(services => {
  services.forEach(service => {
    console.log('\x1b[31m\x1b[47m%s\x1b[0m', '<<< Start >>>', '\n');
    console.log('Service', service);
    console.log('\x1b[0m%s\x1b[32m\x1b[47m%s\x1b[0m', '\n', '<<< Finish >>>', '\n');
  })
})


navigator.bluetooth.requestDevice({
  filters: [
    {
      services: [
        '0000180a-0000-1000-8000-00805f9b34fb',
        '00001809-0000-1000-8000-00805f9b34fb'
      ]
    }
  ]
})
  .then(device => {
    console.log('Connecting to GATT Server...');
    return device.gatt.connect();
  })
  .then(server => {
    console.log('Getting Service...');
    return server.getPrimaryService('00001809-0000-1000-8000-00805f9b34fb');
  })
  .then(service => {
    console.log('Getting Characteristic...');
    return service.getCharacteristic('00002a1c-0000-1000-8000-00805f9b34fb');
  })
  .then(characteristic => {
    let myCharacteristic = characteristic;
    return myCharacteristic.startNotifications().then(_ => {
      console.log('> Notifications started');
      myCharacteristic.addEventListener('characteristicvaluechanged', event => console.log(event));
    });
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });


