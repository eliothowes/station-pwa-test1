import nativeRpc from '../../../../NativeRpc';
import Adapter from '../../../../Adapter';

export default class TD8255 extends Adapter {
  // Required by Device class
  static id = 'taidoc-td8255-ble';
  static vendor = 'TAIDOC';
  static model = 'TD-8255';
  static connectionType = 'ble';
  static connectionProperties = {
    deviceAddress: 'C0:26:DA:12:C0:62',
    deviceName: 'TAIDOC TD8255',
    services: {}
  };

  constructor () {
    super();
    this._data = [];
    this._isIterating = true;
  }

  async open () {
    super.open();

    this._log('waiting for device connection');
    this._isIterating = true;


    return nativeRpc.getDeviceAndStreamMeasurements(TD8255.id)
    .then(() => {
      this._log('connection opened');
      this._changeStatus('connected');
    })
    .then(async () => {
      for await (const data of nativeRpc.getReadings()) {
        console.log("DATA: ", data);
        this._processDataArray(data);
      }
    })
    .catch((error) => {
      console.error('Error opening device', error);
      this._emitError(error);
      this.close();
    })
  }

  close (targetRevision = this.revision) {
    super.close(targetRevision);

    // Change the revision will cause any outstanding requests to fail/end
    this.revision += 1;

    return nativeRpc.closeDevice(TD8255.id)
    .then(() => {
      this._changeStatus('disconnected');
      this._log('closed');
    })
    .catch(error => {
      console.error('Error closing device', error);
      this._emitError(error)
      // await this.close(); // SHOULD WE TRY AGAIN IF IT FAILS TO CLOSE
    });
  }
}