import React from 'react';
import {
  Switch,
  Route,
  Link,
  useRouteMatch
} from "react-router-dom";
import {throttle} from 'lodash';
import PulseOxData from './PulseOxData'

const DATA_THROTTLE = 20;

const PretendConsultation = ({connectedUsbDevices, pulseOxAdapter}) => {
  const [device, setDevice] = React.useState(null);
  const [data, setData] = React.useState({});
  const {path, url} = useRouteMatch();


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

  return (
    <div>
        <ul style={{listStyle: 'none', textAlign: 'left'}}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/pulseoximeter">Back to Pulse Oximeter Setup</Link></li>
      </ul>
      <div style={{marginTop: '3em'}}>
        <h1>Pulse Oximeter Connect Page</h1>
        <p>Pulse Ox: {device && `${device.vendorId}`}</p>
      </div>
      <div style={{marginTop: '3em'}}>
      <Switch>
        <Route exact path={path}>
          <Link to={`${url}/data`}>Start giving me data</Link>
        </Route>
        <Route path={`${path}/data`}>
          <PulseOxData data={data} pulseOximeter={pulseOxAdapter} />
        </Route>
      </Switch>
      </div>
    </div>
  );
};

export default PretendConsultation;
