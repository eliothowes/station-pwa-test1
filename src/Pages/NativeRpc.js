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
        window.alert('timeout reached - destroying listener')
        window.removeEventListener('message', returnHandler);
        reject(new Error(`Timeout calling function: ${message.type}`));
      }, 10 * 1000);

      window.alert('timeout set')

      const returnHandler = (event) => {
        const message = event.data;

        window.alert(`RPC returned ${JSON.stringify(event.data)} Original message Id ${messageId}`)

        if (this._rpcSuccessful(message, 'deviceAndMeasurementResult', messageId)) {
          clearTimeout(rpcTimeout);
          window.removeEventListener('message', returnHandler);

          window.alert(`RPC Success ${JSON.stringify(message.response)}`)
          resolve(message.response);
        } else {

          window.alert(`RPC Failed ${JSON.stringify(event.data)}`)

          clearTimeout(rpcTimeout);
          window.removeEventListener('message', returnHandler);
          reject(new Error(message.error));
        }
      };

      window.addEventListener('message', (event) => {
        window.alert(`Got something back from postMessage ${JSON.stringify(event.data.response)} ${JSON.stringify(event.data.error)}`)
      });
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
        const {data: message} = event.data;

        if (this._rpcSuccessful(message, messageId, 'deviceClosed')) {
          resolve(message.response);
          clearTimeout(rpcTimeout);
          window.removeEventListener('message', returnHandler);
        }

        reject(new Error(message.error));
        clearTimeout(rpcTimeout);
        window.removeEventListener('message', returnHandler);
      };

      window.addEventListener('message', returnHandler);

      if ('flutter_inappwebview' in window) {
        return window.flutter_inappwebview.callHandler(message.type, message);
      }

      if ('ReactNativeWebView' in window) {
        return window.ReactNativeWebView.postMessage(message)
      }
    });
  }
}

export default new NativeRpc();