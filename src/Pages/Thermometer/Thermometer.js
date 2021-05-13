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

const Thermometer = ({connectedBleDevices, setConnectedBleDevices, thermometerAdapter}) => {
  const [expectedDevicesAreConnected, setExpectedDevicesAreConnected] = React.useState(false);


  React.useEffect(() => {
    const areAllConnected = allExpectedDevicesConnected();
    setExpectedDevicesAreConnected(areAllConnected)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedBleDevices])

  const requestAccessToUsbDevices = () => {
    if (thermometerAdapter) {
      return thermometerAdapter.pairDevice()
      .then(device => {
        return setConnectedBleDevices([...connectedBleDevices, device])
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
    if (connectedBleDevices.length < EXPECTED_DEVICES.length) {
      return EXPECTED_DEVICES.every(expectedDevice => {
        return connectedBleDevices.find(device => device.vendorId === expectedDevice.vendorId && device.productId === expectedDevice.productId)
      })
    }
    else {
      return true;
    }
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
        {connectedBleDevices.map((connectedDevice, idx) => {
          return (
            <>
            <strong>{`id: ${connectedDevice.id}`}</strong><br/>
            <strong>{`name: ${connectedDevice.name}`}</strong><br/>
            <strong>{`Connected: ${connectedDevice.gatt.connected ? 'Yes' : 'No'}`}</strong>
            </>
          )
        })}
      </p>
      {expectedDevicesAreConnected && (
        <Link to="/thermometer/consult">Consult</Link>
      )}
    </div>
  );
};

export default Thermometer;
