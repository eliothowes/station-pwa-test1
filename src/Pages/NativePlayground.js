import React from 'react';
import {
  Link,
  Route,
  Switch,
} from "react-router-dom";
import NativeBle from './NativeBle';
import NativeUsb from './NativeUsb';

const NativePlayground = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/native">
          <div style={{display: 'block', marginBottom: '1em'}}>
          <Link to="/">
            Back to runtime picker
          </Link>
          <h1>Pick device interface</h1>
          </div>
            <Link to="/native/ble">
              Native BLE
            </Link>
          <div style={{display: 'inline', marginLeft: '1em'}}>
            <Link to="/native/usb">
              Native USB
            </Link>
          </div>
        </Route>
        <Route path="/native/ble">
          <NativeBle />
        </Route>
        <Route path="/native/usb">
          <NativeUsb />
        </Route>
      </Switch>
    </div>
  );
};

export default NativePlayground;
