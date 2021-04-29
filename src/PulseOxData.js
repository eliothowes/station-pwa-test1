import React from 'react';

const PulseOxData = ({data, pulseOximeter}) => {
  const [patientMessage, setPatientMessage] = React.useState(null)

  const fingerIn = data.data?.fingerIn;
  const searching = data.data?.searching;
  const pulse = data.data?.pulse;
  const spO2 = data.data?.spO2

    const updatePatientMessage = () => {
    if (pulseOximeter.status === 'disconnected') {
      setPatientMessage('Device not connected')
    }
    else if (pulseOximeter.status === 'connecting') {
      if (pulseOximeter._vendor === 'Contec') {
        setPatientMessage('Please turn on the device')
      }
      else {
        setPatientMessage('Place you finger in the device')
      }
    }
    else if (pulseOximeter.status === 'connected') {
      if (!fingerIn) {
        setPatientMessage('Place you finger in the device')
      }
      else if (searching) {
        setPatientMessage('Searching....')
      }
      else {
        setPatientMessage('Reading....')
      }
    }
  }

  React.useEffect(() => {
    updatePatientMessage()

    return () => {
      setPatientMessage(null)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pulseOximeter.status, fingerIn, searching])
  return (
  <div>
    <h3>Patient side</h3>
    <p>{patientMessage}</p>
    <p>SP02: {spO2}</p>
    <p>Pulse: {pulse}</p>
  </div>
);
};

export default PulseOxData;
