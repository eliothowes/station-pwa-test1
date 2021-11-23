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

  async *getReadings() {
    while (this._isIterating) {
      if (this._data.length > 0) {
        // first in first out
        yield this._data[0];
      }

      // reduce resource usage
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  getDeviceAndMeasurement (deviceIdentifier) {
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
        window.removeEventListener('message', returnHandler);
        reject(new Error(`Timeout calling ${requestMessage.type}`));
      }, 10 * 1000);

      const returnHandler = (event) => {
        const responseMessage = event.data;

        // Handle non responses
        if (requestMessage.type !== 'deviceAndMeasurementResult') {
          return;
        }

        if (this._rpcSuccessful(responseMessage, 'deviceAndMeasurementResult', requestMessage.messageId)) {
          clearTimeout(rpcTimeout);
          window.removeEventListener('message', returnHandler);
          resolve(responseMessage.data.response);
        } else {
          clearTimeout(rpcTimeout);
          window.removeEventListener('message', returnHandler);
          const error = responseMessage.data.error;
          reject(new Error(error.message, error.details));
        }
      };

      window.addEventListener('message', returnHandler);

      if ('flutter_inappwebview' in window) {
        window.flutter_inappwebview.callHandler(requestMessage.type, requestMessage);
      } else if ('ReactNativeWebView' in window) {
        window.ReactNativeWebView.postMessage(requestMessage)
      }
    });
  }

  getDeviceAndStreamMeasurements (deviceIdentifier) {
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
        window.removeEventListener('message', returnHandler);
        reject(new Error(`Timeout calling ${requestMessage.type}`));
      }, 10 * 1000);

      const returnHandler = (event) => {
        const responseMessage = event.data;

        // Handle non responses
        if (requestMessage.type !== 'deviceAndMeasurementResult') {
          return;
        }

        if (this._rpcSuccessful(responseMessage, 'deviceAndMeasurementResult', requestMessage.messageId)) {
          clearTimeout(rpcTimeout);
          this._isIterating = true;
          window.alert(`returnHandler success ${JSON.stringify(responseMessage.data.response)}`)
          this._dataHandler(responseMessage.data.response);
          resolve();
        } else {
          clearTimeout(rpcTimeout);
          window.removeEventListener('message', returnHandler);
          const error = responseMessage.data.error;
          reject(new Error(error.message, error.details));
        }
      };

      window.addEventListener('message', returnHandler);

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

    return new Promise((resolve, reject) => {
      // If the native app hasn't responded in 10 secs then timeout
      const rpcTimeout = setTimeout(() => {
        window.removeEventListener('message', returnHandler);
        reject(new Error(`Timeout calling ${requestMessage.type}`));
      }, 10 * 1000);

      const returnHandler = (event) => {
        const responseMessage = event.data;
        window.alert(`HIT closeDevice returnHandler ${responseMessage}`)
        if (this._rpcSuccessful(responseMessage, 'deviceClosed', requestMessage.messageId)) {
          clearTimeout(rpcTimeout);
          window.removeEventListener('message', returnHandler);
          this._data = [];
          this._isIterating = false;
          resolve(responseMessage.data.response);
        } else {
          clearTimeout(rpcTimeout);
          window.removeEventListener('message', returnHandler);
          const error = responseMessage.data.error;
          reject(new Error(error.message, error.details));
        }
      };

      window.addEventListener('message', returnHandler);

      if ('flutter_inappwebview' in window) {
        window.flutter_inappwebview.callHandler(requestMessage.type, requestMessage);
      } else if ('ReactNativeWebView' in window) {
        window.ReactNativeWebView.postMessage(requestMessage)
      }
    });
  }
}

export default new NativeRpc();