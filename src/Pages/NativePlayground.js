import React, {useState} from 'react';
import './NativePlayground.css'

const NativePlayground = () => {
  const [bleScanResult, setBleScanResult] = useState();
  const [deviceConnection, setDeviceConnection] = useState();
  const [manufacturerInfo, setManufacturerInfo] = useState();
  const [deviceReading, setDeviceReading] = useState();
  const [closeDeviceResult, setCloseDeviceResult] = useState();

  /**
   *
   * BLE Scan
   */
  const handleScanResult = (data) => {
    window.removeEventListener('scanResult', handleScanResult)

    console.log('Received data: ', data);

    setBleScanResult(data.detail);
  }

  const startScan = async (deviceIdentifier) => {
    // Should be able to use window.isMobileWebView = true
    if ('flutter_inappwebview' in window) {
      window.addEventListener('scanResult', handleScanResult)

      return window.flutter_inappwebview.callHandler('startScan');
    }

    console.log(
      'Not running inside webview. The following was not sent: ',
      '\n',
      '<<<', 'startScan', '>>>'
    )
  }

  /**
   *
   * Connect Device
   */
  const handleConnectDevice = (data) => {
    window.removeEventListener('connectedDevice', handleConnectDevice)

    console.log('Received data: ', data);

    setDeviceConnection(data.detail);
  }

  const connectDevice = async (deviceIdentifier) => {
    if ('flutter_inappwebview' in window) {
      window.addEventListener('connectedDevice', handleConnectDevice)

      return window.flutter_inappwebview.callHandler('connectDevice', {device: deviceIdentifier});
    }

    console.log(
      'Not running inside webview. The following was not sent: ',
      '\n',
      '<<<', 'connectDevice', {deviceIdentifier}, '>>>'
    )
  }

  /**
   *
   * Get Manufacturer Info
   */
  const handleManufacturerInfo = (data) => {
    window.removeEventListener('manufacturerInfo', handleManufacturerInfo)

    console.log('Received data: ', data);

    setManufacturerInfo(data.detail);
  }

  const getManufacturerInfo = async (deviceIdentifier) => {
    if ('flutter_inappwebview' in window) {
      window.addEventListener('manufacturerInfo', handleManufacturerInfo)

      return window.flutter_inappwebview.callHandler('manufacturerInfo', {device: deviceIdentifier});
    }

    console.log(
      'Not running inside webview. The following was not sent: ',
      '\n',
      '<<<', 'manufacturerInfo', {deviceIdentifier}, '>>>'
    )
  }

  /**
   *
   * Get Device Reading
   */
   const handleDeviceReading = (data) => {
    window.removeEventListener('readMeasurement', handleDeviceReading)

    console.log('Received data: ', data);

    setDeviceReading(data.detail);
  }

  const getDeviceReading = async (deviceIdentifier) => {
    if ('flutter_inappwebview' in window) {
      window.addEventListener('readMeasurement', handleDeviceReading)

      return window.flutter_inappwebview.callHandler('readMeasurement', {device: deviceIdentifier});
    }

    console.log(
      'Not running inside webview. The following was not sent: ',
      '\n',
      '<<<', 'readMeasurement', {deviceIdentifier}, '>>>'
    )
  }

  /**
   *
   * Close Device
   */
   const handleCloseDevice = (data) => {
    window.removeEventListener('readMeasurement', handleCloseDevice)

    console.log('Received data: ', data);

    setCloseDeviceResult(data.detail);
  }

  const closeDevice = async (deviceIdentifier) => {
    if ('flutter_inappwebview' in window) {
      window.addEventListener('readMeasurement', handleCloseDevice)

      return window.flutter_inappwebview.callHandler('closeDevice', {device: deviceIdentifier});
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
        {bleScanResult && (
          <div className="rpc-output">
            <h4>BLE Scan Result</h4>
            <pre>{JSON.stringify(bleScanResult)}</pre>
          </div>
        )}
        {deviceConnection && (
          <div className="rpc-output mt">
            <h4>Device Connection Result</h4>
            <pre>{JSON.stringify(deviceConnection)}</pre>
          </div>
        )}
        {manufacturerInfo && (
          <div className="rpc-output mt">
            <h4>Manufacturer Info Result</h4>
            <pre>{JSON.stringify(manufacturerInfo)}</pre>
          </div>
        )}
        {deviceReading && (
          <div className="rpc-output mt">
            <h4>Device Reading</h4>
            <pre>{JSON.stringify(deviceReading)}</pre>
          </div>
        )}
        {closeDeviceResult && (
          <div className="rpc-output mt">
            <h4>Device Closed Result</h4>
            <pre>{JSON.stringify(closeDeviceResult)}</pre>
          </div>
        )}
        {!bleScanResult && !deviceConnection && !manufacturerInfo && !deviceReading && !closeDeviceResult }
        <pre>.....</pre>
      </div>
    </div>
  );
};

export default NativePlayground;
