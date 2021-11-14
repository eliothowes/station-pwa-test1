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
  const [postMessage, setPostMessage] = useState();

  const handlePostMessage = (event) => {
    const eventDetails = {
      data: event.data,
      origin: event.origin
    }
    console.warn('Herrow', eventDetails)
    setPostMessage(eventDetails)
  }

  useEffect(() => {
    window.addEventListener("message", handlePostMessage);

    return () => window.removeEventListener("message", handlePostMessage)
  }, [])

  /**
   *
   * BLE Scan
   */
  const handleScanResult = (data) => {
    window.removeEventListener('scanResult', handleScanResult)

    console.log('Received data: ', data);

    setRpcResponse(JSON.stringify(data))

    setBleScanResult(data.detail);
  }

  const startScan = async () => {
    if (window.isMobileWebView) {
      window.addEventListener('scanResult', handleScanResult)

      ble.startScan();
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
    if (window.isMobileWebView) {
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
        {postMessage && (
          <div className="rpc-output mt">
            <h6>POST MESSAGE Response</h6>
            <pre>{JSON.stringify(postMessage, null, 2)}</pre>
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
