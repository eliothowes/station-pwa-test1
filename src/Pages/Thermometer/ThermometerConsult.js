import React from 'react';
import {
  Switch,
  Route,
  Link,
  useRouteMatch
} from "react-router-dom";
import ThermometerData from './ThermometerData'

const ThermometerConsult = ({connectedBleDevices, thermometerAdapter}) => {
  const {path, url} = useRouteMatch();

  const [device, setDevice] = React.useState(null);
  // const [data, setData] = React.useState({});


  React.useEffect(() => {
    const device = getDevice('TAIDOC TD1107')
    setDevice(device)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getDevice = (deviceIdentifier) => {
    return connectedBleDevices.find(device => device.name === deviceIdentifier)
  }

  return (
    <div>
      <ul style={{listStyle: 'none', textAlign: 'left'}}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/thermometer">Back to Thermometer Setup</Link></li>
      </ul>
      <div style={{marginTop: '3em'}}>
        <h1>Thermometer Consult Page</h1>
        <p>Thermometer: {device && `${device.name}`}</p>
      </div>
      <div style={{marginTop: '3em'}}>
      <Switch>
        <Route exact path={path}>
          <Link to={`${url}/data`}>Start giving me data</Link>
        </Route>
        <Route path={`${path}/data`}>
          <ThermometerData data={data} thermometerAdapter={thermometerAdapter} />
        </Route>
      </Switch>
      </div>
    </div>
  );
};

export default ThermometerConsult;
