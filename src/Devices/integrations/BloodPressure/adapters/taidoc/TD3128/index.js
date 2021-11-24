import Adapter from '../../../../../Adapter';
import nativeRpc from '../../../../../NativeRpc';

export default class TD3128 extends Adapter {
  // Required by Device class
  static id = 'taidoc-td3128-ble';
  static vendor = 'TAIDOC';
  static model = 'TD-3128';
  static connectionType = 'ble';
  static connectionProperties = {
    deviceAddress: 'C0-26-DA-0D-0F-B4',
    deviceName: 'TAIDOC TD3128',
    services: {}
  };

  async open () {
    super.open();

    this._log('waiting for device connection');

    try {
      await nativeRpc.setupDeviceAndDataHandlers(TD3128.id);
      this._log('connection opened');
      this._changeStatus('connected');
    }
    catch (error) {
      console.error('Error opening device', error);
      this._emitError(error);
      return this.close();
    }

    for await (const data of nativeRpc.iterateData()) {
      console.log("DATA: ", JSON.stringify(data));
      this._processDataObject(data);
    }
  }

  close (targetRevision = this.revision) {
    super.close(targetRevision);

    // Change the revision will cause any outstanding requests to fail/end
    this.revision += 1;

    nativeRpc.closeDevice(TD3128.id)
    this._changeStatus('disconnected');
    this._log('closed');
  }
}
