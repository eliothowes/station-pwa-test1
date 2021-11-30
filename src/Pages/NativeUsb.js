import React, {useState} from 'react';
import {Link} from 'react-router-dom'
import PulseOximeterLibrary from '../Devices/integrations/PulseOximeter';
import './NativePlayground.css'

const NativeUsb = () => {
  const pulseOximeterAdapter = PulseOximeterLibrary.requestAdapter('nonin-3231-usb');

  const [pulseOximeterReadings, setPulseOximeterReadings] = useState([]);
  const [pulseOximeterStatus, setPulseOximeterStatus] = useState(pulseOximeterAdapter.status);

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
  return (
    <div>
      <Link to="/native">
        Back to device interface picker
      </Link>
      <h1>Native USB</h1>
      <h3>Pulse Oximeter Controls</h3>
      <div className="buttons-container">
        <button onClick={handleOpenPulseOximeter}>
          Connect to Nonin-3231 and get readings
        </button>
        <button onClick={handleClosePulseOximeter}>
          Close Nonin-3231
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
              <p>Finger in: {String(reading.fingerIn)}</p>
              <p>Searching: {String(reading.searching)}</p>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default NativeUsb;