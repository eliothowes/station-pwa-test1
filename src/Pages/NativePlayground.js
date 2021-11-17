import React, {useState} from 'react';
import nativeRpc from './NativeRpc';
import ThermometerLibrary from '../Devices/integrations/Thermometer';
import PulseOximeterLibrary from '../Devices/integrations/PulseOximeter';
import './NativePlayground.css'

const NativePlayground = () => {
  const [td1241Data, setTd1241Data] = useState();
  const [rpcResponse, setRpcResponse] = useState();

  const [thermometerReadings, setThermometerReadings] = useState([]);
  const [pulseOximeterReadings, setPulseOximeterReadings] = useState([]);

  const pulseOximeterAdapter = PulseOximeterLibrary.requestAdapter('taidoc-td8255-ble');
  const thermometerAdapter = ThermometerLibrary.requestAdapter('taidoc-td1241-ble')

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

  /**
   * PULSE OXIMETER
   */

  const handlePulseOximeterData = (data) => {
    setPulseOximeterReadings(currentReadings => [...currentReadings, data])
  }

  const handleOpenPulseOximeter = () => {
    pulseOximeterAdapter.on('data', handlePulseOximeterData)
    return pulseOximeterAdapter.open()
  }

  const handleClosePulseOximeter = () => {
    setPulseOximeterReadings([])
    return pulseOximeterAdapter.close()
  }

  /**
   * Thermometer
   */

  const handleThermometerData = (data) => {
    setThermometerReadings(currentReadings => [...currentReadings, data])
  }

  const handleOpenThermometer = () => {
    thermometerAdapter.on('data', handleThermometerData)
    return thermometerAdapter.open()
  }

  const handleCloseThermometer = () => {
    setThermometerReadings([])
    return thermometerAdapter.close()
  }


  return (
    <div>
      <h3>Pulse Oximeter Controls</h3>
      <div className="buttons-container">
        <button onClick={handleOpenPulseOximeter}>
          Connect to TD-8255 and get readings
        </button>
        <button onClick={handleClosePulseOximeter}>
          Close TD-8255
        </button>
      </div>
      <h3>Pulse Oximeter Output</h3>
      <div className="device-output">
        {pulseOximeterReadings.map(reading => {
          return (
            <div key={JSON.stringify(reading)}>
              <p>SpO2: {reading.spO2}</p>
              <p>Pulse: {reading.pulse}</p>
              <p>Finger in: {reading.fingerIn}</p>
              <p>Status: {reading.searching}</p>
            </div>
          )
        })}
      </div>

      <hr />

      <h3>Thermometer Controls</h3>
      <div className="buttons-container">
        <button onClick={() => getDeviceAndMeasurement('taidoc-td1241-ble')}>
          Connect to TD-1241 and get reading
        </button>
        <button onClick={() => closeDevice('taidoc-td1241-ble')}>
          Close TD-1241
        </button>
      </div>
      <h3>Thermometer Output</h3>
      <div className="device-output">
        {td1241Data && (
          <div className="rpc-output mt">
            <h4>Device Reading</h4>
            <pre>{JSON.stringify(td1241Data, null, 2)}</pre>
          </div>
        )}
        {thermometerReadings.map(reading => {
          return (
            <div key={JSON.stringify(reading)}>
              <p>{`${reading.temperature} ${reading.units}`}</p>
              <p>{reading.timestamp}</p>
            </div>
          )
        })}
      </div>

      <hr />


      <h5>Raw rpc output</h5>
      {rpcResponse && (
        <div className="rpc-output mt">
          <h6>RPC Response</h6>
          <pre>{JSON.stringify(rpcResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default NativePlayground;
