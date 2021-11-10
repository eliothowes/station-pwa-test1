export default class AbstractBle {
  constructor (connectionProperties) {
    this.connectionProperties = connectionProperties;
    this.device = null;
    this.server = null;
    this._characteristics = new Map();
    this._descriptors = new Map();
  }

  pairDevice() {
    // return navigator.bluetooth.getDevices()
    // .then(devices => {
    //   const device = devices.find(device => device.name === this.connectionProperties.deviceName)

    //   if (device) {
    //     this.device = device;
    //     return device;
    //   }
    // })
    if (this.device) {
      return new Promise((resolve) => {
        resolve(this.device);
      });
    }
    else {
      return navigator.bluetooth.requestDevice({
        filters: [
          {
            name: this._connectionProperties.deviceName
          },
          {
            services: [
              '0000180a-0000-1000-8000-00805f9b34fb',
              '00001809-0000-1000-8000-00805f9b34fb'
            ]
          }
        ]
      })
      .then(device => {
        this.device = device;
        return device;
      })
    }
  }


  connect (serviceName, characteristicName, descriptorName) {
    const serviceDetails = this.connectionProperties.services[serviceName];

    return this.device.gatt.connect()
    .then(server => {
      this.server = server;
      return server.getPrimaryService(serviceDetails.uuid);
    })
    .then(service => {
      return this._cacheCharacteristic(service, serviceDetails.characteristics[characteristicName].uuid);
    })
    .then(characteristic => {
      const descriptorUuid = serviceDetails.characteristics[characteristicName].descriptors[descriptorName].uuid;
      return this._cacheDescriptor(characteristic, descriptorUuid)
    })
  }

  getCharacteristic (characteristicUuid) {
    return this._characteristics.get(characteristicUuid)
  }

  getDescriptor (descriptorUuid) {
    return this._descriptors.get(descriptorUuid)
  }

  _cacheCharacteristic(service, characteristicUuid) {
    return service.getCharacteristic(characteristicUuid)
    .then(characteristic => {
      this._characteristics.set(characteristicUuid, characteristic);
      return characteristic;
    });
  }

  _cacheDescriptor(characteristic, descriptorUuid) {
    return characteristic.getDescriptors()
    .then(descriptors => {
      descriptors.forEach(descriptor => {
        this._descriptors.set(descriptorUuid, descriptor);
      })
    })
  }

  /**
   * Get a GATT service
   * @param {String} server Current connected GATT server
   */
  _getPrimaryService (server, serviceUuid) {
    return server.getPrimaryService(serviceUuid);
  }

  /**
   * Add an event listener to the bluetooth device
   * @param {String} eventName event name
   * @param {Func} fn The callback function
   */
  addEventListener (eventName, fn) {
    this.device.addEventListener(eventName, fn);
  }

  /**
   * Remove an event listener from the bluetooth device
   * @param {String} eventName event name
   * @param {Func} fn The callback function
   */
  removeEventListener (eventName, fn) {
    this.device.removeEventListener(eventName, fn);
  }

  async readCharacteristicValue (serviceName, characteristicName) {
    const characteristicUuid = this.connectionProperties.services[serviceName].characteristics[characteristicName].uuid
    const characteristic = this.getCharacteristic(characteristicUuid);

    return characteristic.readValue()
  }

  async readDescriptorValue (serviceName, characteristicName, descriptorName) {
    const descriptorUuid = this.connectionProperties.services[serviceName].characteristics[characteristicName].descriptors[descriptorName].uuid;
    const descriptor = this.getDescriptor(descriptorUuid);

    return descriptor.readValue()
  }

  async onCharacteristicValueChanged (serviceName, characteristicName, callback) {
    const characteristicUuid = this.connectionProperties.services[serviceName].characteristics[characteristicName].uuid
    const characteristic = this.getCharacteristic(characteristicUuid);

    characteristic.addEventListener('characteristicvaluechanged', callback);
  }

  async startCharacteristicNotifications (serviceName, characteristicName) {
    const characteristicUuid = this.connectionProperties.services[serviceName].characteristics[characteristicName].uuid
    const characteristic = this.getCharacteristic(characteristicUuid);

    return characteristic.startNotifications();
  }

  writeCharacteristicValue = async (serviceName, characteristicName, value) => {
    const characteristic = await this.getCharacteristicForService(serviceName, characteristicName);
    return characteristic.writeValue(value);
  }
}