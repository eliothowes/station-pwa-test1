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
        reject(new Error(`Timeout calling function: ${requestMessage.type}`));
      }, 10 * 1000);

      const returnHandler = (event) => {
        const responseMessage = event.data;

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

        if (this._rpcSuccessful(responseMessage, 'deviceClosed', requestMessage.messageId)) {
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
}

export default new NativeRpc();