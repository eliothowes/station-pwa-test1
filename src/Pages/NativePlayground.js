import React, {useState} from 'react';
import ThermometerLibrary from '../Devices/integrations/Thermometer';
import PulseOximeterLibrary from '../Devices/integrations/PulseOximeter';
import BloodPressureLibrary from '../Devices/integrations/BloodPressure';
import './NativePlayground.css'

const NativePlayground = () => {
  const pulseOximeterAdapter = PulseOximeterLibrary.requestAdapter('taidoc-td8255-ble');
  const thermometerAdapter = ThermometerLibrary.requestAdapter('taidoc-td1241-ble');
  const bloodPressureAdapter = BloodPressureLibrary.requestAdapter('taidoc-td3128-ble');


  const [pulseOximeterReadings, setPulseOximeterReadings] = useState([]);
  const [pulseOximeterStatus, setPulseOximeterStatus] = useState(pulseOximeterAdapter.status);

  const [thermometerReadings, setThermometerReadings] = useState([]);
  const [thermometerStatus, setThermometerStatus] = useState(thermometerAdapter.status);

  const [bloodPressureReadings, setBloodPressureReadings] = useState([]);
  const [bloodPressureStatus, setBloodPressureStatus] = useState(bloodPressureAdapter.status);

  // /**
  //  *
  //  * BLE Scan
  //  */
  // const getDeviceAndMeasurement = async (deviceIdentifier, setData) => {
  //   if (window.isMobileWebView) {
  //     return nativeRpc.getDeviceAndMeasurement(deviceIdentifier)
  //     .then(result => {
  //       console.warn(`Here in result land: ${JSON.stringify(result)}`)
  //       console.log(result)
  //       setRpcResponse(result)
  //       setData(currentResults => [result, ...currentResults])
  //     })
  //   }

  //   console.log(
  //     'Not running inside webview. The following was not sent: ',
  //     '\n',
  //     '<<<', 'startScan', '>>>'
  //   )
  // }

  // /**
  //  *
  //  * Close Device
  //  */
  // const closeDevice = async (deviceIdentifier, setData) => {
  //   if (window.isMobileWebView) {
  //     return nativeRpc.closeDevice(deviceIdentifier)
  //     .then(result => {
  //       console.log(JSON.stringify(result))
  //       setRpcResponse()
  //       setData([])
  //     })
  //     .catch(error => {
  //       console.error(error)
  //       setRpcResponse(error)
  //       setData([error])
  //     })

  //   }

  //   console.log(
  //     'Not running inside webview. The following was not sent: ',
  //     '\n',
  //     '<<<', 'closeDevice', {deviceIdentifier}, '>>>'
  //   )
  // }

  /**
   * Pulse Oximeter
   */

  const handlePulseOximeterData = (data) => {
    setPulseOximeterReadings([data])
  }
  const handlePulseOximeterChangeEvent = () => {
    setPulseOximeterStatus(pulseOximeterAdapter.status)
  }
  const handlePulseOximeterError = (error) => {
    console.error('IN ERROR HANDLER: ', error)
    window.alert(error);
  }

  const handleOpenPulseOximeter = () => {
    pulseOximeterAdapter.on('data', handlePulseOximeterData)
    pulseOximeterAdapter.on('change', handlePulseOximeterChangeEvent);
    pulseOximeterAdapter.on('error', handlePulseOximeterError);

    return pulseOximeterAdapter.open()
  }

  const handleClosePulseOximeter = () => {
    setPulseOximeterReadings([])
    pulseOximeterAdapter.off('data', handlePulseOximeterData)
    pulseOximeterAdapter.off('change', handlePulseOximeterChangeEvent);
    pulseOximeterAdapter.off('error', handlePulseOximeterError);

    pulseOximeterAdapter.close()
    return handlePulseOximeterChangeEvent();
  }

  /**
   * Thermometer
   */

  const handleThermometerData = (data) => {
    setThermometerReadings([data]);
  }
  const handleThermometerChangeEvent = () => {
    setThermometerStatus(thermometerAdapter.status);
  }
  const handleThermometerError = (error) => {
    console.error('IN ERROR HANDLER: ', error)
    window.alert(error);
  }

  const handleOpenThermometer = () => {
    thermometerAdapter.on('data', handleThermometerData);
    thermometerAdapter.on('change', handleThermometerChangeEvent);
    thermometerAdapter.on('error', handleThermometerError);

    return thermometerAdapter.open();
  }

  const handleCloseThermometer = () => {
    setThermometerReadings([]);
    thermometerAdapter.off('data', handleThermometerData);
    thermometerAdapter.off('change', handleThermometerChangeEvent);
    thermometerAdapter.off('error', handleThermometerError);

    thermometerAdapter.close();
    return handleThermometerChangeEvent()
  }

  /**
   * Blood Pressure
   */

   const handleBloodPressureData = (data) => {
    setBloodPressureReadings([data]);
  }
  const handleBloodPressureChangeEvent = () => {
    setBloodPressureStatus(bloodPressureAdapter.status);
  }
  const handleBloodPressureError = (error) => {
    console.error('IN ERROR HANDLER: ', error)
    window.alert(error);
  }

  const handleOpenBloodPressure = () => {
    bloodPressureAdapter.on('data', handleBloodPressureData);
    bloodPressureAdapter.on('change', handleBloodPressureChangeEvent);
    bloodPressureAdapter.on('error', handleBloodPressureError);

    return bloodPressureAdapter.open();
  }

  const handleCloseBloodPressure = () => {
    setBloodPressureReadings([]);
    bloodPressureAdapter.off('data', handleBloodPressureData);
    bloodPressureAdapter.off('change', handleBloodPressureChangeEvent);
    bloodPressureAdapter.off('error', handleBloodPressureError);

    bloodPressureAdapter.close()
    return handleBloodPressureChangeEvent();
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
      <p>Status: {pulseOximeterStatus}</p>
      <div className="device-output">
        {pulseOximeterReadings.map(reading => {
          return (
            <div key={JSON.stringify(reading)}>
              <p>SpO2: {reading.spO2}</p>
              <p>Pulse: {reading.pulse}</p>
              <p>Finger in: {reading.fingerIn}</p>
              <p>Status: {String(reading.searching)}</p>
            </div>
          )
        })}
      </div>

      <hr />

      <h3>Thermometer Controls</h3>
      <div className="buttons-container">
        <button onClick={handleOpenThermometer}>
          Connect to TD-1241 and get reading
        </button>
        <button onClick={handleCloseThermometer}>
          Close TD-1241
        </button>
      </div>
      <h3>Thermometer Output</h3>
      <p>Status: {thermometerStatus}</p>
      <div className="device-output">
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

      <h3>Blood Pressure Controls</h3>
      <div className="buttons-container">
        <button onClick={handleOpenBloodPressure}>
          Connect to TD-3128 and get reading
        </button>
        <button onClick={handleCloseBloodPressure}>
          Close TD-3128
        </button>
      </div>
      <h3>Blood Pressure Output</h3>
      <p>Status: {bloodPressureStatus}</p>
      <div className="device-output">
        {bloodPressureReadings.map(reading => {
          return (
            <div key={JSON.stringify(reading)}>
              <p>{`${reading.systolic} / ${reading.diastolic} ${reading.units}`}</p>
              <p>{reading.pulse}</p>
              <p>{reading.timestamp}</p>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default NativePlayground;
