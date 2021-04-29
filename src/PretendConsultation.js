import React from 'react';
import {
  Link
} from "react-router-dom";


const PretendConsultation = ({connectedUsbDevices}) => {
  // const [patientMessage, setPatientMessage] = React.useState(null)
  // const [clinicianMessage, setClinicianMessage] = React.useState(null)
  // const [deviceData, setDeviceData] = React.useState([]);
  const [device, setDevice] = React.useState(null);

  React.useEffect(() => {
    const device = getDevice(7229)
    setDevice(device)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getDevice = (deviceIdentifier) => {
    return connectedUsbDevices.find(device => device.vendorId === deviceIdentifier)
  }

  const handleConnect = () => {

  }

  return (
    <div>
      <Link to="/">Go Home</Link>
      <div style={{marginTop: '3em'}}>
        <h1>Pulse Oximeter Connect Page</h1>
        <p>Pulse Ox: {device && `${device.vendorId}`}</p>
        <div style={{marginTop: '1em'}}>
        <button onClick={handleConnect}>Start giving me data</button>
        </div>
        <div>
          <h3>Clinician side</h3>
          {/* <p>{clinicianMessage}</p>
          <p>SP02: {spO2}</p>
          <p>Pulse: {pulse}</p> */}
        </div>
        <div>
          <h3>Patient side</h3>
          {/* <p>{patientMessage}</p>
          <p>SP02: {spO2}</p>
          <p>Pulse: {pulse}</p> */}
        </div>
        <h3>Testing stuff out here</h3>
        <h3>Testing stuff out here</h3>
        <h3>Testing stuff out here</h3>
        <h3>Test</h3>
      </div>
    </div>
  );
};

export default PretendConsultation;
