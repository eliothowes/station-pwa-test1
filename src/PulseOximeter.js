import React from 'react';
import {
  Link
} from "react-router-dom";

const EXPECTED_DEVICES = [
  {
    "vendorId": 7229,
    "productId": 5
  }
]

const PulseOximeter = ({connectedUsbDevices, setConnectedUsbDevices}) => {

  const [expectedDevicesAreConnected, setExpectedDevicesAreConnected] = React.useState(false)

  const getDevices = async () => {
    const devices = await navigator.usb.getDevices({filter: []});
    console.log('\x1b[31m\x1b[47m%s\x1b[0m', '<<< Start >>>', '\n');
    console.log('devices', devices);
    console.log('\x1b[0m%s\x1b[32m\x1b[47m%s\x1b[0m', '\n', '<<< Finish >>>', '\n');
    setConnectedUsbDevices(devices)
  }

  React.useEffect(() => {
    getDevices()
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    const areAllConnected = allExpectedDevicesConnected();
    setExpectedDevicesAreConnected(areAllConnected)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedUsbDevices])

  const requestAccessToUsbDevices = async () => {
    await navigator.usb.requestDevice({
      filters: [...EXPECTED_DEVICES]
    })
    getDevices()
  }

  const allExpectedDevicesConnected = () => {
    if (connectedUsbDevices.length < EXPECTED_DEVICES.length) {
      return EXPECTED_DEVICES.every(expectedDevice => {
        return connectedUsbDevices.find(device => device.vendorId === expectedDevice.vendorId && device.productId === expectedDevice.productId)
      })
    }
    else {
      return true;
    }
  }

  return (
    <div>
      <h1>Pulse Oximeter Setup Page</h1>
      {!expectedDevicesAreConnected && (
        <button onClick={requestAccessToUsbDevices}>Connect USB Devices</button>
      )}
      <p>Expected USB Devices: </p>
      <pre>{EXPECTED_DEVICES.map(expectedDevice => JSON.stringify(expectedDevice))}</pre>
      <p>Connected USB Devices: </p>
      <p>
        {connectedUsbDevices.map(connectedDevice => {
          return (
            <pre>{`${connectedDevice.vendorId} ${connectedDevice.productId}`}</pre>
          )
        })}
      </p>
      {expectedDevicesAreConnected && (
        <Link to="/consult">Consult</Link>
      )}
    </div>
  );
};

export default PulseOximeter;
