export default class AbstractBle {

  constructor (connectionProperties) {
    this._connectionProperties = connectionProperties;
    this._device = null;
  }

  async connectDevice () {
    const connectedDevices = await navigator.bluetooth.getDevices();
    const device = connectedDevices.find(device => device.name === this._connectionProperties.deviceName)
    if (device) {
      this._device = device;
    }
    else {
      this._device = await navigator.bluetooth.requestDevice({
        filters: [
          {
            name: this._connectionProperties.deviceName
          },
          {
            services: [
              this._connectionProperties.services.temperature.uuid,
              this._connectionProperties.services.deviceInformation.uuid
            ]
          }
        ],
        optionalServices: [
          0x1809,
          '0000180a-0000-1000-8000-00805f9b34fb',
          '00001523-1212-efde-1523-785feabcd123'
        ]
      });
    }
    return this._device;
  }

  async connectGattServer () {
    if (!this._device) {
      throw new Error('No device');
    }

    return this._device.gatt.connect();
  }

  isPaired () {
    if (!this._device) {
      throw new Error('No device');
    }

    return this._device.gatt.connected;
  }

  /**
   * Add an event listener to the bluetooth device
   * @param {String} eventName event name
   * @param {Func} fn The callback function
   */
  addEventListener (eventName, fn) {
    this._device.addEventListener(eventName, fn);
  }

  /**
   * Remove an event listener from the bluetooth device
   * @param {String} eventName event name
   * @param {Func} fn The callback function
   */
  removeEventListener (eventName, fn) {
    this._device.removeEventListener(eventName, fn);
  }

  async onCharacteristicValueChanged (serviceName, characteristicName, callback) {
    const characteristic = await this.getCharacteristicForService(serviceName, characteristicName);
    characteristic.addEventListener('characteristicvaluechanged', callback);
  }

  async startCharacteristicNotifications (serviceName, characteristicName) {
    const characteristic = await this.getCharacteristicForService(serviceName, characteristicName);
    return characteristic.startNotifications();
  }

  /**
   * Get a GATT service
   * @param {String} serviceName The service that is specified in connectionProperties
   */
  async getService (serviceName) {
    console.log('\x1b[31m\x1b[47m%s\x1b[0m', '<<< Start >>>', '\n');
    console.log('Finding service');
    console.log('\x1b[0m%s\x1b[32m\x1b[47m%s\x1b[0m', '\n', '<<< Finish >>>', '\n');
    const service = await this._device.gatt.getPrimaryService(0x1809);
    console.log('\x1b[31m\x1b[47m%s\x1b[0m', '<<< Start >>>', '\n');
    console.log(service);
    console.log('\x1b[0m%s\x1b[32m\x1b[47m%s\x1b[0m', '\n', '<<< Finish >>>', '\n');
    return this._device.gatt.getPrimaryService(this._connectionProperties.services[serviceName].uuid);
  }

  /**
   * Get a GATT characteristic for a particular service
   * @param {String} serviceName The service that is specified in connectionProperties
   */
  async getCharacteristicForService (serviceName, characteristicName) {
    const service = await this.getService(serviceName);
    return service.getCharacteristic(this._connectionProperties.services[serviceName].characteristics[characteristicName].uuid);
  }

  writeCharacteristicValue = async (serviceName, characteristicName, value) => {
    const characteristic = await this.getCharacteristicForService(serviceName, characteristicName);
    return characteristic.writeValue(value);
  }
}