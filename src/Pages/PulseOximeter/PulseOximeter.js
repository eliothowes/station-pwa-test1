import React from 'react';
import {
  Link
} from "react-router-dom";
import PulseOximeterLibrary from '../../Devices/integrations/PulseOximeter'

const EXPECTED_DEVICES = [
  {
    "vendorId": 7229,
    "productId": 5
  }
]

const PulseOximeter = ({connectedUsbDevices, setConnectedUsbDevices, setPulseOxAdapter}) => {
  const [expectedDevicesAreConnected, setExpectedDevicesAreConnected] = React.useState(false)

  const getDevices = async () => {
    const devices = await navigator.usb.getDevices({filter: []});

    const adapter = await PulseOximeterLibrary.requestAdapter('nonin-3231-usb'); ;

    setConnectedUsbDevices(devices)
    setPulseOxAdapter(adapter)
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
      <ul style={{listStyle: 'none', textAlign: 'left'}}>
        <li><Link to="/">Home</Link></li>
      </ul>
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
        <Link to="/pulseoximeter/consult">Consult</Link>
      )}
    </div>
  );
};

export default PulseOximeter;
