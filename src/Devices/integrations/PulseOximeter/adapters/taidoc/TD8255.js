import nativeRpc from '../../../../../Pages/NativeRpc';
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

  async open () {
    super.open();

    // Start receiving data
    this._receiveLoop(this.revision);

    this._log('waiting for device connection');

    /*
     * Wait to receive some data before we say we're connected
     */
    while (this.data.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    this._log('connection opened');
    this._changeStatus('connected');
  }

  _receiveLoop = async (revision) => {
    // If the revision get's bumped then exit
    if (revision !== this.revision) {
      console.log('This connection is no longer live');
      return;
    }

    try {
      nativeRpc.getDeviceAndMeasurement(TD8255.id)
      .then(response => this._processDataArray(response));
    }
    catch (err) {
      console.error('Caught error:', err);
      this.close();
    }

    // Exited above
    process.nextTick(() => {
      this._receiveLoop(revision);
    });
  }

  close (targetRevision = this.revision) {
    super.close(targetRevision);

    // Change the revision will cause any outstanding requests to fail/end
    this.revision += 1;

    this._changeStatus('disconnected');

    return nativeRpc.closeDevice()
    .then(() => {
      this._log('closed');
    });
  }
}