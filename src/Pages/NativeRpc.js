class NativeRpc {
  constructor () {
    this._messageId = 0;
  }

  _rpcSuccessful (rpcMessage, messageType, currentMessageId) {
    const {type, messageId, data} = rpcMessage;

    return data.ok && type === messageType && messageId === currentMessageId
  }

  getDeviceAndMeasurement (deviceIdentifier) {
    const messageId = this._messageId++

    const message = {
      type: 'getDeviceAndMeasurement',
      messageId,
      data: {
        device: deviceIdentifier
      }
    }

    return new Promise((resolve, reject) => {
      // If the native app hasn't responded in 3 secs then timeout
      const rpcTimeout = setTimeout(() => {
        window.removeEventListener('message', returnHandler);
        reject(new Error(`Timeout calling function: ${message.type}`));
      }, 15 * 1000);

      const returnHandler = (event) => {
        const message = event.data;

        if (this._rpcSuccessful(message, 'deviceAndMeasurementResult', messageId)) {
          clearTimeout(rpcTimeout);
          window.removeEventListener('message', returnHandler);
          resolve(message.data.response);
        } else {
          clearTimeout(rpcTimeout);
          window.removeEventListener('message', returnHandler);
          reject(new Error(message.data.error));
        }
      };

      window.addEventListener('message', returnHandler);

      if ('flutter_inappwebview' in window) {
        window.flutter_inappwebview.callHandler('getDeviceAndMeasurement', message);
      } else if ('ReactNativeWebView' in window) {
        window.ReactNativeWebView.postMessage(message)
      }
    });
  }

  closeDevice (deviceIdentifier) {
    const messageId = this._messageId++

    const message = {
      type: 'closeDevice',
      messageId,
      data: {
        device: deviceIdentifier
      }
    }

    return new Promise((resolve, reject) => {
      // If the native app hasn't responded in 3 secs then timeout
      const rpcTimeout = setTimeout(() => {
        window.removeEventListener('message', returnHandler);
        reject(new Error(`Timeout calling function: ${message.type}`));
      }, 3 * 1000);

      const returnHandler = (event) => {
        const message = event.data;

        if (this._rpcSuccessful(message, 'deviceClosed', messageId)) {
          clearTimeout(rpcTimeout);
          window.removeEventListener('message', returnHandler);
          resolve(message.data.response);
        }

        clearTimeout(rpcTimeout);
        window.removeEventListener('message', returnHandler);
        reject(new Error(message.data.error));
      };

      window.addEventListener('message', returnHandler);

      if ('flutter_inappwebview' in window) {
        window.flutter_inappwebview.callHandler(message.type, message);
      } else if ('ReactNativeWebView' in window) {
        window.ReactNativeWebView.postMessage(message)
      }
    });
  }
}

export default new NativeRpc();