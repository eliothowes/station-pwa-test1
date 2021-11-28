import USB_CONTROL from './usb-control-codes';


/**
 * AbstractUsb is the interface to WebUSB allowing us to easily fallback to
 * chrome.usb and mock for testing when required.
 */
export default class AbstractUsb {
  static addEventListener (name, handler) {
    return navigator.usb.addEventListener(name, handler);
  }

  static removeEventListener (name, handler) {
    return navigator.usb.removeEventListener(name, handler);
  }

  constructor (device) {
    this.device = device;
  }

  static async pairDevice (connectionProperties) {
    if (this.device) {
      return this.device;
    }
    else {
      const device = await navigator.usb.requestDevice({
        filters: [
          connectionProperties
        ]
      });

      return device;
    }
  }

  static async getDevice (connectionProperties) {
    if (this.device) {
      return this.device;
    }
    else {
      const devices = await navigator.usb.getDevices();

      const device = devices.find(device => {
        let deviceFound = false;

        if (connectionProperties.vendorId) {
          deviceFound = device.vendorId === connectionProperties.vendorId;
        }
        if (connectionProperties.productId) {
          deviceFound = device.productId === connectionProperties.productId;
        }

        return deviceFound;
      });

      if (!device) {
        return AbstractUsb.pairDevice(connectionProperties);
      }

      return device;
    }
  }

  open () {
    return this.device.open();
  }

  close () {
    return this.device.close();
  }

  selectConfiguration (num) {
    return this.device.selectConfiguration(num);
  }

  claimInterface (num) {
    return this.device.claimInterface(num);
  }

  async transferIn (endpointNumber, length) {
    return await this.device.transferIn(endpointNumber, length);
  }

  async controlTransferIn (request, recipient='interface') {
    return await this.device.controlTransferIn({
      requestType: 'vendor',
      recipient: 'interface',
      request: request,
      value: 0,
      index: 0,
    }, 64);
  }

  async controlTransferOut (request, value, data) {
    data = new Uint8Array(data).buffer;

    return await this.device.controlTransferOut({
      requestType: 'vendor',
      recipient: 'interface',
      request: request,
      value: value,
      index: 0,
    }, data);
  }

  async sendRaw (endpointNumber, data) {
    const out = await this.device.transferOut(
      endpointNumber,
      new Uint8Array(data).buffer,
    );
    return out;
  }

  async sendCommand (endpointNumber, cmd) {
    if (cmd === undefined) {
      return;
    }

    return this.sendRaw(endpointNumber, [
      0x7D, 0x81, cmd, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80,
    ]);
  }

  async setBaud (baudRate) {
    const message = new DataView(
      new ArrayBuffer(4)
    );
    message.setInt32(0, baudRate, true);
    return await this.controlTransferOut(USB_CONTROL.CP210x_SET_BAUDRATE, 0, message.buffer);
  }

}
