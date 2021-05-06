import AbstractBle from '../../../AbstractBle';
import Adapter from '../../../Adapter';


// Web bluetooth standard: https://webbluetoothcg.github.io/web-bluetooth/

export default class TD1107 extends Adapter {
  // Required by Device class
  static id = 'taidoc-1107';
  static vendor = 'TAIDOC';
  static model = 'TD-1107';
  static connectionType = 'ble';
  static connectionProperties = {
    deviceAddress: 'C0-26-DA-10-C0-26',
    deviceName: 'TAIDOC TD1107',
    services: {
      uuid: '00001523-1212-efde-1523-785feabcd123',
      temperature: {
        uuid: 0x1809,
        // uuid: '00001809-0000-1000-8000-00805f9b34fb',
        characteristics: {
          temperatureMeasurement: {
            uuid: '00002a1c-0000-1000-8000-00805f9b34fb'
          },
        },
        deviceInformation: {
          uuid: '0000180a-0000-1000-8000-00805f9b34fb',
          characteristics: {
            modelNumberString: {
              uuid: '00002a24-0000-1000-8000-00805f9b34fb'
            }
          }
        }
      }
    }
  };

  constructor () {
    super();
    this._bufferSize = 1000;
    this._characteristicListeners = [];
    this._deviceListeners = [];
    this._bloodPressureService = null;
    this._customService = null;
  }

  /**
   * Public methods
   */


  open = async () => {
    super.open();
    this._ble = new AbstractBle(this.constructor.connectionProperties);

    try {
      await this._ble.connectDevice();
    }
    catch (error) {
      this._log(error);
      return;
    }

    // Add event listener for gattserverdisconnected
    this._ble.addEventListener('gattserverdisconnected', this._onDeviceDisconnected);

    let paired = this._ble._device.gatt.connected;
    while (!paired) {
      try {
        await this._ble.connectGattServer();

        const isPaired = this._ble.isPaired();
        if (isPaired) {
          paired = true;
        }
      }
      catch (err) {
        console.log(err);
        this._onDeviceDisconnected();
        return;
      }
    }

    // await this._ble.writeCharacteristicValue('bloodPressure', 'dateTime', get7ByteDateTime());

    // Set the custom characteristic value to [2, 1, 3] to disconnect the device - tells the monitor we are ready for readings
    // await this._ble.writeCharacteristicValue('custom', 'custom', new Uint8Array([2, 1, 3]));

    const deviceModel = await this._ble.getCharacteristicForService('temperature', 'temperatureMeasurement')

    console.log('\x1b[31m\x1b[47m%s\x1b[0m', '<<< Start >>>', '\n');
    console.log('deviceModelService', deviceModel);
    console.log('\x1b[0m%s\x1b[32m\x1b[47m%s\x1b[0m', '\n', '<<< Finish >>>', '\n');

    this._log('connection opened');
    this._changeStatus('connected');
  }

  async close (targetRevision = this.revision) {
    super.close(targetRevision);

    // Change the revision will cause any outstanding requests to fail/end
    this.revision += 1;

    this._log('connection closed');

    this._changeStatus('disconnected');
  }

  _onDeviceDisconnected = async () => {
    this._log('Bluetooth Device disconnected, reconnecting');
    try {
      await this._ble.connectGattServer();
      console.log('<<< Trying to reconnect >>>')
      // await this._ble.onCharacteristicValueChanged('bloodPressure', 'bloodPressureMeasurement', this._handleBloodPressureCharacteristicChange);
      // await this._ble.startCharacteristicNotifications('bloodPressure', 'bloodPressureMeasurement');
    }
    catch (err) {
      this._log('failed to reconnect');
      await this.close();
    }

  }

  _handleBloodPressureCharacteristicChange = (event) => {
    // const data = parseBloodPressureMeasurement(event.target.value);
    // this._processDataObject(data);
  }
}