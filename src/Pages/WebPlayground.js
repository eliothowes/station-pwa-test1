import React from 'react';
import {
  Redirect,
  Route,
  Switch
} from 'react-router';
import DeviceSelector from './DeviceSelector'
import PulseOximeter from './PulseOximeter/PulseOximeter'
import PulseOxConsult from './PulseOximeter/PulseOxConsult'
import Thermometer from './Thermometer/Thermometer'
import ThermometerConsult from './Thermometer/ThermometerConsult'
import ThermometerLibrary from '../Devices/integrations/Thermometer';

const WebPlayground = () => {
  const [connectedUsbDevices, setConnectedUsbDevices] = React.useState([])
  const [pulseOxAdapter, setPulseOxAdapter] = React.useState({})

  const [connectedThermometer, setConnectedThermometer] = React.useState(null)
  const [thermometerAdapter] = React.useState(ThermometerLibrary.requestAdapter('taidoc-td1107-ble'))

  const ConditionalRoute = ({children, ...rest}) => {
    return (
      <Route
        {...rest}
        render={() =>
          connectedUsbDevices.length > 0 ? (
            children
          ) : (
            <Redirect
              to={{pathname: "/web",}}
            />
          )
        }
      />
    );
  }

  return (
    <Switch>
      <Route exact path="/web">
        <DeviceSelector />
      </Route>
      <ConditionalRoute exact={true} path="/web/pulseoximeter/consult">
        <PulseOxConsult
          connectedUsbDevices={connectedUsbDevices}
          pulseOxAdapter={pulseOxAdapter}
        />
      </ConditionalRoute>
      <Route exact path="/web/pulseoximeter">
        <PulseOximeter
          connectedUsbDevices={connectedUsbDevices}
          setConnectedUsbDevices={setConnectedUsbDevices}
          setPulseOxAdapter={setPulseOxAdapter}
        />
      </Route>
      <Route exact path="/web/thermometer/consult">
        <ThermometerConsult
          connectedThermometer={connectedThermometer}
          thermometerAdapter={thermometerAdapter}
        />
      </Route>
      <Route exact path="/web/thermometer">
        <Thermometer
          connectedThermometer={connectedThermometer}
          setConnectedThermometer={setConnectedThermometer}
          thermometerAdapter={thermometerAdapter}
        />
      </Route>
    </Switch>
  );
};

export default WebPlayground;
