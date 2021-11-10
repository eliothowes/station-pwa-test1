import React from 'react';
import "./NativePlayground.css"

const NativePlayground = () => {
  const startScan = async () => {
    if ('flutter_inappwebview' in window) {
      return window.flutter_inappwebview.callHandler('startScan');
    }

    console.log(
      'Not running inside webview. The following was not sent: ',
      '\n',
      '<<<', 'startScan', '>>>'
    )
  }

  const connectDevice = async (deviceIdentifier) => {
    if ('flutter_inappwebview' in window) {
      return window.flutter_inappwebview.callHandler('connectDevice', {deviceIdentifier});
    }

    console.log(
      'Not running inside webview. The following was not sent: ',
      '\n',
      '<<<', 'connectDevice', {deviceIdentifier}, '>>>'
    )
  }

  const getManufacturerInfo = async (deviceIdentifier) => {
    if ('flutter_inappwebview' in window) {
      return window.flutter_inappwebview.callHandler('manufacturerInfo', {deviceIdentifier});
    }

    console.log(
      'Not running inside webview. The following was not sent: ',
      '\n',
      '<<<', 'manufacturerInfo', {deviceIdentifier}, '>>>'
    )
  }

  const getDeviceReading = async (deviceIdentifier) => {
    if ('flutter_inappwebview' in window) {
      return window.flutter_inappwebview.callHandler('readMeasurement', {deviceIdentifier});
    }

    console.log(
      'Not running inside webview. The following was not sent: ',
      '\n',
      '<<<', 'readMeasurement', {deviceIdentifier}, '>>>'
    )
  }

  const closeDevice = async (deviceIdentifier) => {
    if ('flutter_inappwebview' in window) {
      return window.flutter_inappwebview.callHandler('closeDevice', {deviceIdentifier});
    }

    console.log(
      'Not running inside webview. The following was not sent: ',
      '\n',
      '<<<', 'closeDevice', {deviceIdentifier}, '>>>'
    )
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
