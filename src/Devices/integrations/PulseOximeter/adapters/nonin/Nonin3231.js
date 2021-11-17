import AbstractUsb from '../../../../AbstractUsb';
import parseInputMessage from './parse_input_message';
import {appendBuffer} from '../../../../util';
import Adapter from '../../../../Adapter';


/**
 * We don't expect and error but we don't want to halt if we get one. So just
 * log instead and continue.
 */
async function logIfErr (fn) {
  try {
    await fn();
  }
  catch (err) {
    console.log('Unexpected error: ', err);
  }
}


function parseData (buffer) {

  const messages = [];

  while (buffer.length > 0) {
    const message = parseInputMessage(buffer);

    if (message.id === 'REQUIRES_MORE_DATA') {
      // no, wait for more data
      return {buffer, messages};
    }

    let data;
    if (message.parseData) {
      const messageBuffer = buffer.slice(0, message.size);
      data = message.parseData(messageBuffer);
    }

    if (message.id === 'DATA') {
      messages.push({
        id: message.id,
        data,
      });
    }
    else {
      messages.push({
        id: message.id,
      });
    }

    buffer = buffer.slice(message.getSize(buffer));
  }


  return {messages, buffer};
}


export default class Nonin3231 extends Adapter {
  // Required by the Device class
  static id = 'nonin-3231-usb';
  static vendor = 'Nonin';
  static model = '3231';
  static connectionType = 'usb';
  static connectionProperties = {
    vendorId: 7229
  };

  constructor () {
    super();
    this._buffer = new Uint8Array();
    this._vendor = 'Nonin';
  }

  /**
   * PUBLIC METHODS
   */
  /**
   * Open the USB device
   */
  async open () {
    super.open();

    let device;
    try {
      const devices = await AbstractUsb.getDevices();
      device = devices.find(device => device.vendorId === this.constructor.connectionProperties.vendorId);
    }
    catch (error) {
      this._changeStatus('disconnected');
      this._emitError(error);
      throw error;
    }

    if (!device) {
      throw new Error('No such devices connected');
    }

    this.device = device;
    this._usb = new AbstractUsb(device);
    const usb = this._usb;

    try {
      await usb.open();
      await usb.selectConfiguration(1);
      await usb.claimInterface(1);
    }
    catch (err) {
      window.alert(err)
    }

    const inEndpointNumber = device.configuration.interfaces[1].alternates[0].endpoints[1].endpointNumber;
    const outEndpointNumber = device.configuration.interfaces[1].alternates[0].endpoints[0].endpointNumber;

    this._inEndpointNumber = inEndpointNumber;
    this._outEndpointNumber = outEndpointNumber;
    this._log(`inEndpointNumber: ${inEndpointNumber}`);
    this._log(`outEndpointNumber: ${outEndpointNumber}`);

    // Start receiving data
    this._receiveLoop(this.revision);

    this._log('waiting for device to be turned on');

    /*
     * Wait to receive some data before we say we're connected
     */
    while (this.data.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    this._log('connection opened');
    this._changeStatus('connected');
  }


  async close (targetRevision = this.revision) {
    super.close(targetRevision);

    const usb = this._usb;

    // Change the revision will cause any outstanding requests to fail/end
    this.revision += 1;

    this._changeStatus('disconnected');

    if (usb) {
      await usb.close();
    }

    this._log('closed');
  }


  /**
   * PRIVATE METHODS
   */

  _receiveLoop = async (revision) => {
    // If the revision get's bumped then exit
    if (revision !== this.revision) {
      console.log('This connection is no longer live');
      return;
    }

    try {
      const usbResult = await this._fetchDataFromUsb();

      if (usbResult.status === 'ok') {
        await logIfErr(() => this._handleSuccess(usbResult));
      }
      else if (usbResult.status === 'timeout') {
        await logIfErr(() => this._handleTimeout(revision));
      }
      else if (usbResult.status === 'error') {
        await this._handleError(revision, usbResult);
        // Stop receive loop!
        return;
      }
      else {
        throw new Error(`Unknown status: ${usbResult.status}`);
      }
    }
    catch (err) {
      console.error('Caught error:', err);
    }

    // Exited above
    process.nextTick(() => {
      this._receiveLoop(revision);
    });
  }

  _fetchDataFromUsb () {
    const usb = this._usb;

    return new Promise(resolve => {
      let resolved = false;
      usb.transferIn(this._inEndpointNumber, 64).then((result) => {
        if (result.status !== 'ok') {
          console.warn('received unexpected status from usb', {result});
        }

        if (!resolved) {
          resolved = true;
          resolve(result);
        }
      })
      .catch((error) => {
        if (!resolved) {
          // HACK: Fixme
          if (error.message.match(/Timeout calling function:/)) {
            resolved = true;
            resolve({status: 'timeout', error});
          }
          else {
            resolved = true;
            resolve({status: 'error', error});
          }
        }
      });
    });
  }

  async _handleSuccess ({data}) {
    this._buffer = appendBuffer(this._buffer, data.buffer);

    const {buffer, messages} = parseData(this._buffer);
    this._buffer = buffer;

    if (messages) {
      const onlyDataMessages = messages.filter(message => {
        if (message.id === 'DATA') {
          return true;
        }
        else if (message.id === 'GARBLED_MESSAGE') {
          return false;
        }
        else {
          return false;
        }
      });

      this._processDataArray(onlyDataMessages);
    }
  }

  async _handleTimeout () {
    console.warn('timeout: connection interrupted...');
  }

  async _handleError (revision, {error}) {
    // This error is valid so we haven't just recycled/closed our connection.
    if (this.revision === revision) {
      console.log('_handleError', error);
      this._emitError(error);
      await this.close(revision);
    }
    else {
      // The revisions differ so we can safely ignore.
    }
  }
}