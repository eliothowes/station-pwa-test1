import {EventEmitter} from 'events';
import AbstractUsb from './AbstractUsb';
// import AbstractBle from 'lib/abstract-ble';


export default class Device {

  constructor (adapters) {
    this._emitter = new EventEmitter();

    this._adapters = [];

    Object.values(adapters).forEach(adapter => {
      if (this._adapters.find(a => a.id === adapter.id)) {
        throw new Error(`Cannot add adapter. Already an existing on with id ${adapter.id}`);
      }

      if (!adapter.id) {
        throw new Error('must specify an adapter id');
      }

      if (!adapter.vendor) {
        throw new Error('must specify an adapter vendor');
      }

      if (!adapter.model) {
        throw new Error('must specify an adapter model');
      }

      if (!adapter.connectionType) {
        throw new Error('must specify an adapter connectionType');
      }

      if (!adapter.connectionProperties) {
        throw new Error('must specify adapter connectionProperties');
      }

      if (adapter.connectionType === 'usb') {
        if (!adapter.connectionProperties.vendorId) {
          throw new Error('usb adapters must specify connectionProperties.vendorId');
        }
      }

      this._adapters.push(adapter);
    });
  }

  /**
   * Obtain a list of available adapters and whether they are connected or not
   * NOTE: On web USB the first time you connect a device, it will not be present in th connectedUsbDevices list.
   * You MUST call adapter.open() first in order for it to appear in this list.
   */
  async listAdapters () {
    // TODO add BLE devices
    const connectedUsbDevices = await AbstractUsb.getDevices();

    return this._adapters.map(adapter => {
      const foundUsbDevice = connectedUsbDevices.find(d => d.vendorId === adapter.connectionProperties.vendorId);
      return {
        id: adapter.id,
        vendor: adapter.vendor,
        model: adapter.model,
        deviceType: this.name,
        connectionType: adapter.connectionType,
        connectionProperties: {...adapter.connectionProperties},
        connected: !!foundUsbDevice
      };
    });
  }

  _handleUsbConnectionEvent = (e) => {
    const {type} = e;
    const adapter = this._adapters.find(adapter => adapter.connectionProperties.vendorId === e.device.vendorId);

    if (adapter) {
      this._emitter.emit(type, {
        ...adapter,
        connected: (type === 'connect' ? true : false),
      });
    }
  }

  _handleBleConnectionEvent = (e) => {
    // TODO
  }

  on (eventName, fn) {
    if (!['connect', 'disconnect'].includes(eventName)) {
      throw new Error(`Invalid event name: ${eventName}`);
    }
    const listeners = this._emitter.listeners(eventName);
    if (listeners.length < 1) {
      AbstractUsb.addEventListener(eventName, this._handleUsbConnectionEvent);
      // AbstractBle.addEventListener(eventName, this._handleBleConnectionEvent);
    }
    this._emitter.on(eventName, fn);
  }

  off (eventName, fn) {
    if (!['connect', 'disconnect'].includes(eventName)) {
      throw new Error(`Invalid event name: ${eventName}`);
    }
    this._emitter.off(eventName, fn);
    const listeners = this._emitter.listeners(eventName);
    if (listeners.length < 1) {
      AbstractUsb.removeEventListener(eventName, this._handleUsbConnectionEvent);
      // AbstractBle.removeEventListener(eventName, this._handleBleConnectionEvent);
    }
  }

  /**
   * Request adapter
   * @param {string} adapterId unique id of the adapter required. This is a unique identifier in the context of the devices library.
   */
  requestAdapter (adapterId) {
    if (!adapterId) {
      throw new Error('adapterId is required');
    }

    const Adapter = this._adapters.find(adapter => {
      return adapter.id === adapterId;
    });

    if (!Adapter) {
      throw new Error(`adapter id ${adapterId} not found`);
    }

    return new Adapter();
  }
}

