import React, {useState} from 'react';
import nativeRpc from './NativeRpc';
import './NativePlayground.css'

const NativePlayground = () => {
  const [td1241Data, setTd1241Data] = useState();
  const [rpcResponse, setRpcResponse] = useState();

  /**
   *
   * BLE Scan
   */
  const getDeviceAndMeasurement = async (deviceIdentifier) => {
    if (window.isMobileWebView) {
      const deviceReading = await nativeRpc.getDeviceAndMeasurement(deviceIdentifier);

      console.log(deviceReading)
      setRpcResponse(deviceReading)
      setTd1241Data(deviceReading)
    }

    console.log(
      'Not running inside webview. The following was not sent: ',
      '\n',
      '<<<', 'startScan', '>>>'
    )
  }

  /**
   *
   * Close Device
   */
  const closeDevice = async (deviceIdentifier) => {
    if (window.isMobileWebView) {
      const deviceReading = await nativeRpc.closeDevice(deviceIdentifier);

      console.log(deviceReading)
      setRpcResponse(deviceReading)
      setTd1241Data(deviceReading)
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
        <button onClick={() => getDeviceAndMeasurement('taidoc-td1241-ble')}>
          Connect to TD-1241 and get reading
        </button>
        <button onClick={() => closeDevice('taidoc-td1241-ble')}>
          Close TD-1241
        </button>
      </div>
      <hr />
      <div>
        <h1>Output from webview</h1>
        {td1241Data && (
          <div className="rpc-output mt">
            <h4>Device Reading</h4>
            <pre>{JSON.stringify(td1241Data, null, 2)}</pre>
          </div>
        )}
        {rpcResponse && (
          <div className="rpc-output mt">
            <h6>RPC Response</h6>
            <pre>{JSON.stringify(rpcResponse, null, 2)}</pre>
          </div>
        )}
        {(!td1241Data || !rpcResponse) && (
          <pre>.....</pre>
        )}
      </div>
    </div>
  );
};

export default NativePlayground;
