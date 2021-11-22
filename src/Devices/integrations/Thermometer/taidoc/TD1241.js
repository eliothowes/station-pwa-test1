import nativeRpc from '../../../../Pages/NativeRpc';
import Adapter from '../../../Adapter';

export default class TD1241 extends Adapter {
  // Required by Device class
  static id = 'taidoc-td1241-ble';
  static vendor = 'TAIDOC';
  static model = 'TD-1241';
  static connectionType = 'ble';
  static connectionProperties = {
    deviceAddress: 'C0:26:DA:10:B2:64',
    deviceName: 'TAIDOC TD1241',
    services: {}
  };

  async open () {
    super.open();

    this._log('waiting for device connection');

    try {
      const bleResponse = await nativeRpc.getDeviceAndMeasurement(TD1241.id);
      this._processDataObject(bleResponse);

      this._log('connection opened');
      this._changeStatus('connected');
    }
    catch (error) {
      console.error('Error opening device:', JSON.stringify(error));
      this._emitError(error)
      await this.close();
    }
  }

  async close (targetRevision = this.revision) {
    super.close(targetRevision);

    // Change the revision will cause any outstanding requests to fail/end
    this.revision += 1;

    try {
      await nativeRpc.closeDevice(TD1241.id);
      this._changeStatus('disconnected');
      this._log('closed');
    }
    catch (error) {
      console.error('Error closing device', JSON.stringify(error));
      this._emitError(error)
      // await this.close(); // SHOULD WE TRY AGAIN IF IT FAILS TO CLOSE
    }
  }
}