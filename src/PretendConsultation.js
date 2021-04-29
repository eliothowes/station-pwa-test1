import React from 'react';
import {
  Link
} from "react-router-dom";
import {throttle} from 'lodash';
import PulseOxData from './PulseOxData'

const DATA_THROTTLE = 20;

const PretendConsultation = ({connectedUsbDevices, pulseOxAdapter}) => {
  // const [patientMessage, setPatientMessage] = React.useState(null)
  // const [clinicianMessage, setClinicianMessage] = React.useState(null)
  // const [deviceData, setDeviceData] = React.useState([]);
  const [device, setDevice] = React.useState(null);
  const [data, setData] = React.useState({});


  const manageData = throttle((event) => {
    setData({
      status: pulseOxAdapter.status,
      data: event.data
    });
  }, DATA_THROTTLE);

  React.useEffect(() => {
    const device = getDevice(7229)
    setDevice(device)

    pulseOxAdapter.on('data', manageData)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getDevice = (deviceIdentifier) => {
    return connectedUsbDevices.find(device => device.vendorId === deviceIdentifier)
  }

  const handleConnect = () => {
    pulseOxAdapter.open();
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
      </div>
      <div style={{marginTop: '3em'}}>
        <PulseOxData data={data} pulseOximeter={pulseOxAdapter} />
      </div>
    </div>
  );
};

export default PretendConsultation;
