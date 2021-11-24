class NativeRpc {
  constructor () {
    this._messageId = 0;
    this._data = [];
    this._isIterating = false;
  }

  _rpcSuccessful (rpcMessage, messageType, currentMessageId) {
    const {type, messageId, data} = rpcMessage;

    return data.ok && type === messageType && messageId === currentMessageId
  }

  _dataHandler = (data) => {
    this._data.unshift(data);
  };

  async *iterateData() {
    while (this._isIterating) {
      if (this._data.length > 0) {
        // first in first out
        yield this._data.pop();
      }

      // reduce resource usage
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  setupDeviceAndDataHandlers (deviceIdentifier) {
    const messageId = this._messageId++

    const requestMessage = {
      type: 'getDeviceAndMeasurement',
      messageId,
      data: {
        device: deviceIdentifier
      }
    }

    return new Promise((resolve, reject) => {
      // If the native app hasn't responded in 10 secs then timeout
      const rpcTimeout = setTimeout(() => {
        window.removeEventListener('message', this.rpcDataHandler);
        reject(new Error(`Timeout calling ${requestMessage.type}`));
      }, 10 * 1000);

      this.rpcDataHandler = (event) => {
        const responseMessage = event.data;

        // Handle non responses
        if (responseMessage.messageId !== requestMessage.messageId) {
          return;
        }

        if (this._rpcSuccessful(responseMessage, 'deviceAndMeasurementResult', requestMessage.messageId)) {
          clearTimeout(rpcTimeout);
          this._dataHandler(responseMessage.data.response);
          this._isIterating = true;
          // May cause issues after first message event resolves
          resolve();
        } else {
          clearTimeout(rpcTimeout);
          window.removeEventListener('message', this.rpcDataHandler);
          const error = responseMessage.data.error;
          reject(new Error(error.message, error.details));
        }
      };

      window.addEventListener('message', this.rpcDataHandler);

      if ('flutter_inappwebview' in window) {
        window.flutter_inappwebview.callHandler(requestMessage.type, requestMessage);
      } else if ('ReactNativeWebView' in window) {
        window.ReactNativeWebView.postMessage(requestMessage)
      }
    });
  }

  closeDevice (deviceIdentifier) {
    const messageId = this._messageId++

    const requestMessage = {
      type: 'closeDevice',
      messageId,
      data: {
        device: deviceIdentifier
      }
    }

    if ('flutter_inappwebview' in window) {
      window.flutter_inappwebview.callHandler(requestMessage.type, requestMessage);
    } else if ('ReactNativeWebView' in window) {
      window.ReactNativeWebView.postMessage(requestMessage)
    }

    window.removeEventListener('message', this.rpcDataHandler);
    this._data = [];
    this._isIterating = false;
  }
}

export default new NativeRpc();