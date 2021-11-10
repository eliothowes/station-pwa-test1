import React from 'react';
import "./NativePlayground.css"

const NativePlayground = () => {
  const startScan = async () => {
    if ('flutter_inappwebview' in window) {
      console.log('Sending to webview: ', '\n', 'startScan')

      const result = await window.flutter_inappwebview.callHandler('startScan');

      console.log('\x1b[31m\x1b[47m%s\x1b[0m', '<<< Start >>>', '\n');
      console.log(result);
      console.log('\x1b[0m%s\x1b[32m\x1b[47m%s\x1b[0m', '\n', '<<< Finish >>>', '\n');
    }
    else {
      console.log(
        'Not running inside webview. The following was not sent: ',
        '\n',
        '<<<', 'startScan', '>>>'
      )
    }
  }

  const connectDevice = async (deviceIdentifier) => {
    if ('flutter_inappwebview' in window) {
      console.log('Sending to webview: ', '\n', 'connectDevice', {deviceIdentifier})

      const result = await window.flutter_inappwebview.callHandler('connectDevice', {deviceIdentifier});

      console.log('Response from webview: ', '\n', result)
    }
    else {
      console.log(
        'Not running inside webview. The following was not sent: ',
        '\n',
        '<<<', 'connectDevice', {deviceIdentifier}, '>>>'
      )
    }
  }

  const getManufacturerInfo = async (deviceIdentifier) => {
    if ('flutter_inappwebview' in window) {
      console.log('Sending to webview: ', '\n', 'manufacturerInfo', {deviceIdentifier})

      const result = await window.flutter_inappwebview.callHandler('manufacturerInfo', {deviceIdentifier});

      console.log('Response from webview: ', '\n', result)
    }
    else {
      console.log(
        'Not running inside webview. The following was not sent: ',
        '\n',
        '<<<', 'manufacturerInfo', {deviceIdentifier}, '>>>'
      )
    }
  }

  const getDeviceReading = async (deviceIdentifier) => {
    if ('flutter_inappwebview' in window) {
      console.log('Sending to webview: ', '\n', 'readMeasurement', {deviceIdentifier})

      const result = await window.flutter_inappwebview.callHandler('readMeasurement', {deviceIdentifier});

      console.log('Response from webview: ', '\n', result)
    }
    else {
      console.log(
        'Not running inside webview. The following was not sent: ',
        '\n',
        '<<<', 'readMeasurement', {deviceIdentifier}, '>>>'
      )
    }
  }

  const closeDevice = async (deviceIdentifier) => {
    if ('flutter_inappwebview' in window) {
      console.log('Sending to webview: ', '\n', 'closeDevice', {deviceIdentifier})

      const result = await window.flutter_inappwebview.callHandler('closeDevice', {deviceIdentifier});

      console.log('Response from webview: ', '\n', result)
    }
    else {
      console.log(
        'Not running inside webview. The following was not sent: ',
        '\n',
        '<<<', 'closeDevice', {deviceIdentifier}, '>>>'
      )
    }
  }


  return (
    <div>
      <div className="buttons-container">
        <button onClick={startScan}>
          Start Scan
        </button>
        <button onClick={() => connectDevice('taidoc-td1241-ble')}>
          Connect TD-1241
        </button>
        <button onClick={() => getManufacturerInfo('taidoc-td1241-ble')}>
          Get Manufacturer Info about TD-1241
        </button>
        <button onClick={() => getDeviceReading('taidoc-td1241-ble')}>
          Get Reading From TD-1241
        </button>
        <button onClick={() => closeDevice('taidoc-td1241-ble')}>
          Close TD-1241
        </button>
      </div>
      <hr />
      <div>
        <h1>Output from webview</h1>
        <pre>.....</pre>
      </div>
    </div>
  );
};

export default NativePlayground;
