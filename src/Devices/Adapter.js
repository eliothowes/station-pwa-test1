import {EventEmitter} from 'events';

/**
 * A generic adapter class that sets up the required properties and methods for a device adapter
 * Takes care of setting up the event emitter
 */


// Useful for debugging/logging to check we not dealing with multiple connections
let INSTANCE_UID = 0;

const validStatuses = [
  'disconnected',
  'connected',
  'connecting'
];

export default class Adapter extends EventEmitter {
  constructor () {
    super();

    // Public properties
    this.data = [];
    this.error = null;
    this.status = 'disconnected';
    this.numberOfPacketsReceived = 0;

    /**
     * There is a lot of async going on in this module, so when we close the
     * connection we just increase the 'revision'. All pending async operations
     * will return but will check their scoped 'revision' variable against the
     * one defined on the instance.
     */
    this.revision = 0;

    // Private properties
    this._instanceId = INSTANCE_UID++;
    this._dataBufferSize = 1000;
  }

  /**
   * PUBLIC METHODS
   */

  async open () {
    if (this.status !== 'disconnected') {
      throw new Error(`Trying to open when status: '${this.status}' should be 'disconnected'`);
    }

    this.revision+=1;
    this._log('[%s] open');

    this._changeStatus('connecting');
  }

  async close (targetRevision) {
    const validCloseStatuses = [
      'connected',
      'connecting',
    ];

    if (!validCloseStatuses.includes(this.status)) {
      throw new Error(`Trying to close when status: '${this.status}' should be ${JSON.stringify(validCloseStatuses)}`);
    }
    if (targetRevision !== this.revision) {
      this._log(`Trying to close incorrect version: ${targetRevision}`);
      return;
    }
  }

  /**
   *
   * PRIVATE METHODS
   */

  _log (message) {
    console.log(`[${this._instanceId}:${this.revision}] ${message}`);
  }

  _changeStatus (newStatus) {
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`attempting to transition to status ${newStatus}. This is not allowed`);
    }

    if (newStatus === this.status) {
      return;
    }
    else if (newStatus === 'disconnected') {
      // Reset some values
      this.error = null;
      this.data = [];
      this.numberOfPacketsReceived = 0;
      this.status = 'disconnected';

      this.emit('close');
      this.emit('change');
    }
    else if (newStatus === 'connecting') {
      console.log(`Status update from "${this.status}" => "connecting"`)
      this.status = 'connecting';
      this.emit('change');
    }
    else if (newStatus === 'connected') {
      console.log(`Status update from "${this.status}" => "connected"`)
      this.status = 'connected';
      this.error = null;
      this.emit('change');
    }
  }


  /**
   * Emitting 'error' will cause a top level 'crash' to occur. So check if we
   * have listeners first.
   */
  _emitError (error) {
    const listeners = this.listeners('error');
    if (listeners.length > 0) {
      this.emit('error', error);
    }
  }

  /**
   * Process incoming packet
   * @param {Object} dataObject Arbitrary data object
   */
  _processDataObject (dataObject) {
    this.numberOfPacketsReceived++;
    this.data.push(dataObject);
    this.data.slice(-this._dataBufferSize);
    this.emit('data', dataObject);
    this.emit('change');
  }

  /**
   * Process an array of data packets. This is useful if we want to batch process them
   * Each one should have an is
   * @param {Object[]} dataArray Array of arbitrary data objects
   */
  _processDataArray (dataArray) {
    this.data = this.data.concat(dataArray).slice(-this._dataBufferSize);
    dataArray.forEach(packet => this.emit('data', packet));
    this.numberOfPacketsReceived += dataArray.length;
    this.emit('change');
  }
}
