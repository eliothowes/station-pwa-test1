import AbstractBle from '../../../AbstractBle';
import Adapter from '../../../Adapter';

const monthMapping = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
}

// Web bluetooth standard: https://webbluetoothcg.github.io/web-bluetooth/

export default class TD1107 extends Adapter {
  // Required by Device class
  static id = 'taidoc-1107';
  static vendor = 'TAIDOC';
  static model = 'TD-1107';
  static connectionType = 'ble';
  static connectionProperties = {
    deviceAddress: '44:02:F7:C3:8A:B1',
    deviceName: 'TAIDOC TD1107',
    services: {
      uuid: '00001523-1212-efde-1523-785feabcd123',
      temperature: {
        uuid: '00001809-0000-1000-8000-00805f9b34fb',
        characteristics: {
          temperatureMeasurement: {
            uuid: '00002a1c-0000-1000-8000-00805f9b34fb',
            descriptors: {
              clientCharacteristicConfiguration: {
                uuid: '00002901-0000-1000-8000-00805f9b34fb'
              }
            }
          },
        }
      },
      deviceInformation: {
        uuid: '0000180a-0000-1000-8000-00805f9b34fb',
        characteristics: {
          readDeviceClock: {
            uuid: '00002a23-0000-1000-8000-00805f9b34fb'
          },
          modelNumberString: {
            uuid: '00002a24-0000-1000-8000-00805f9b34fb'
          }
        }
      }
    }
  };

  constructor () {
    super();
    this._reading = {}
  }

  /**
   * Public methods
   */

  pairDevice () {
    this._ble = new AbstractBle(this.constructor.connectionProperties);
    return this._ble.pairDevice()
  }


  async open () {
    super.open();

    if (!this._ble || !this._ble.device) {
      await this.pairDevice()
    }

    // Add event listener for gattserverdisconnected
    // this._ble.addEventListener('gattserverdisconnected', this._onDeviceDisconnected);

    try {
      await this._ble.connect('temperature', 'temperatureMeasurement', 'clientCharacteristicConfiguration')
    }
    catch (error) {
      console.log('Unable to connect to device')
      this._log(error);
      return;
    }

    await this._ble.startCharacteristicNotifications('temperature', 'temperatureMeasurement')
    await this._ble.onCharacteristicValueChanged('temperature', 'temperatureMeasurement', this.__handleTemperatureMeasurementChanged)
    const value = await this._ble.readCharacteristicValue('temperature', 'temperatureMeasurement')

    const clientCharacteristicConfigurationValue = await this._ble.readDescriptorValue('temperature', 'temperatureMeasurement', 'clientCharacteristicConfiguration')
    console.log('\x1b[31m\x1b[47m%s\x1b[0m', '<<< Start >>>', '\n');
    console.log(value, 'clientCharacteristicConfigurationValue', clientCharacteristicConfigurationValue);
    console.log('\x1b[0m%s\x1b[32m\x1b[47m%s\x1b[0m', '\n', '<<< Finish >>>', '\n');
    this._log('connection opened');
    this._changeStatus('connected');
  }

  close (targetRevision = this.revision) {
    super.close(targetRevision);

    // Change the revision will cause any outstanding requests to fail/end
    this.revision += 1;

    this._log('connection closed');

    this._changeStatus('disconnected');
  }

  _onDeviceDisconnected = async () => {
    // Try and reconnect
    // return this._ble.connect()
    // If unable then close the connection

    return this.close();
  }

  __handleTemperatureMeasurementChanged = (event) => {
    // https://stackoverflow.com/questions/54829004/how-to-extract-temperature-decimal-value-from-a-bluetooth-le-sig-hex-value
    const dataView = event.target.value;
    const bufferLength = dataView.byteLength;

    const temperatureData = {
      firstValue: '',
      secondValue: ''
    }
    const timestamp = {
      year: {
        firstValue: '',
        secondValue: ''
      },
      month: '',
      day: '',
      hours: '',
      minutes: '',
      seconds: ''
    }

    for (let i = 0; i < bufferLength; i++) {
      const value = dataView.getUint8(i)

      if (i === 1) {
        temperatureData.firstValue = value;
      }
      else if (i === 2) {
        temperatureData.secondValue = value;
      }
      else if (i === 5) {
        timestamp.year.firstValue = value;
      }
      else if (i === 6) {
        timestamp.year.secondValue = value;
      }
      else if (i === 7) {
        timestamp.month = monthMapping[value];
      }
      else if (i === 8) {
        timestamp.day = value;
      }
      else if (i === 9) {
        timestamp.hours = value;
      }
      else if (i === 10) {
        timestamp.minutes = value;
      }
      else if (i === 11) {
        timestamp.seconds = value;
      }
    }

    const temperatureValue = (((256 * temperatureData.secondValue) + temperatureData.firstValue) / 10).toString() + 'degrees celsius'
    const year = (timestamp.year.secondValue * 256 + timestamp.year.firstValue).toString();
    const dateTimeValue = `${timestamp.day}, ${timestamp.month} ${year} - ${timestamp.hours}:${timestamp.minutes}:${timestamp.seconds}`

    const dataObject = {
      temperature: temperatureValue,
      timeAndDate: dateTimeValue
    }
    this._processDataObject(dataObject);
    return dataObject
  }
}