import React from 'react';
import {
  Link
} from "react-router-dom";

const ThermometerData = ({data, thermometerAdapter}) => {
  // const [patientMessage, setPatientMessage] = React.useState(null)

  React.useEffect(() => {
    const open = () => {
      return thermometerAdapter.open()
    }
    open()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
  <div>
    <div>
      <Link to="/pulseoximeter/consult">Stop giving me data</Link>
    </div>
    <h3>Patient side</h3>
    {/* <p>{patientMessage}</p>
    <p>SP02: {spO2}</p>
    <p>Pulse: {pulse}</p> */}
  </div>
);
};

export default ThermometerData;