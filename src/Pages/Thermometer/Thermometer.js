import React from 'react';
import {
  Link
} from "react-router-dom";

const EXPECTED_DEVICES = [
  {
    deviceName: 'TAIDOC TD1107',
    uuid: '00001523-1212-efde-1523-785feabcd123'
  }
]

const Thermometer = ({connectedThermometer, setConnectedThermometer, thermometerAdapter}) => {
  const [expectedDevicesAreConnected, setExpectedDevicesAreConnected] = React.useState(false);


  React.useEffect(() => {
    const areAllConnected = allExpectedDevicesConnected();
    setExpectedDevicesAreConnected(areAllConnected)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedThermometer])

  const requestAccessToUsbDevices = () => {
    if (thermometerAdapter) {
      return thermometerAdapter.pairDevice()
      .then(device => {
        return setConnectedThermometer(device)
      })
    }
    else {
      window.alert('No adapter');
    }
  }

  const handleClick = () => {
    return requestAccessToUsbDevices();
  }

  const allExpectedDevicesConnected = () => {
    return connectedThermometer ? true : false;
  }

  return (
    <div>
      <ul style={{listStyle: 'none', textAlign: 'left'}}>
        <li><Link to="/">Home</Link></li>
      </ul>
      <h1>Thermometer Setup Page</h1>
      {!expectedDevicesAreConnected && (
        <button onClick={handleClick}>Connect Bluetooth Devices</button>
      )}
      <p>Expected Paired Bluetooth Devices: </p>
      <strong>{EXPECTED_DEVICES.map(expectedDevice => JSON.stringify(expectedDevice))}</strong>
      <p>Paired USB Devices: </p>
      <p>
        {connectedThermometer && (
          <div>
            <strong>{`id: ${connectedThermometer.id}`}</strong><br/>
            <strong>{`name: ${connectedThermometer.name}`}</strong><br/>
            <strong>{`Connected: ${connectedThermometer.gatt.connected ? 'Yes' : 'No'}`}</strong>
          </div>
        )}
      </p>
      {expectedDevicesAreConnected && (
        <Link to="/thermometer/consult">Consult</Link>
      )}
    </div>
  );
};

export default Thermometer;
