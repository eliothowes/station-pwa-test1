import React, {useEffect, useState} from 'react';
import * as ble from './utils/ble';
import './NativePlayground.css'

const NativePlayground = () => {
  const [bleScanResult, setBleScanResult] = useState();
  const [deviceConnection, setDeviceConnection] = useState();
  const [manufacturerInfo, setManufacturerInfo] = useState();
  const [deviceReading, setDeviceReading] = useState();
  const [closeDeviceResult, setCloseDeviceResult] = useState();

  const [rpcResponse, setRpcResponse] = useState();

  const handlePostMessage = (event) => {
    if (event.origin !== "https://dreamy-khorana-b8a419.netlify.app") {
      return;
    }

    const {messageType, value} = event.data;

    setRpcResponse(event.data)

    switch (messageType) {
      case "scanResult":
        setBleScanResult(value)
        break;
      case "connectedDevice":
        setDeviceConnection(value)
        break;
      default:
        setRpcResponse(event.data)
    }
  }

  useEffect(() => {
    window.addEventListener("message", handlePostMessage);

    return () => window.removeEventListener("message", handlePostMessage)
  }, [])

  /**
   *
   * BLE Scan
   */
  const startScan = async () => {
    if (window.isMobileWebView) {
      return ble.startScan();
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
  const connectDevice = async (deviceIdentifier) => {
    if (window.isMobileWebView) {
      return ble.connectDevice(deviceIdentifier);
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
    if (window.isMobileWebView) {
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
    if (window.isMobileWebView) {
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
    if (window.isMobileWebView) {
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
            <pre>{JSON.stringify(bleScanResult, null, 2)}</pre>
          </div>
        )}
        {deviceConnection && (
          <div className="rpc-output mt">
            <h4>Device Connection Result</h4>
            <pre>{JSON.stringify(deviceConnection, null, 2)}</pre>
          </div>
        )}
        {manufacturerInfo && (
          <div className="rpc-output mt">
            <h4>Manufacturer Info Result</h4>
            <pre>{JSON.stringify(manufacturerInfo, null, 2)}</pre>
          </div>
        )}
        {deviceReading && (
          <div className="rpc-output mt">
            <h4>Device Reading</h4>
            <pre>{JSON.stringify(deviceReading, null, 2)}</pre>
          </div>
        )}
        {closeDeviceResult && (
          <div className="rpc-output mt">
            <h4>Device Closed Result</h4>
            <pre>{JSON.stringify(closeDeviceResult, null, 2)}</pre>
          </div>
        )}
        {rpcResponse && (
          <div className="rpc-output mt">
            <h6>RPC Response</h6>
            <pre>{JSON.stringify(rpcResponse, null, 2)}</pre>
          </div>
        )}
        {(!bleScanResult || !deviceConnection || !manufacturerInfo || !deviceReading || !closeDeviceResult) && (
          <pre>.....</pre>
        )}
      </div>
    </div>
  );
};

export default NativePlayground;
