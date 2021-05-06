import React from 'react';
import {
  Link
} from "react-router-dom";

const DeviceSelector = () => {
  return (
    <div>
      <h1>Select a device</h1>
      <ul style={{listStyle: 'none'}}>
        <li><Link to="pulseoximeter" >Pulse Oximeter</Link></li>
        <li><Link to="thermometer">Thermometer</Link></li>
      </ul>
    </div>
  );
};

export default DeviceSelector;
