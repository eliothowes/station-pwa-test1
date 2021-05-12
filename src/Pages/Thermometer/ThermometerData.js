import React from 'react';
import {
  useHistory
} from "react-router-dom";

const ThermometerData = ({_, thermometerAdapter}) => {
  const history = useHistory();
  const [readings, setReadings] = React.useState([]);

  const handleData = (data) => {
    setReadings([...readings, data])
  }

  React.useEffect(() => {
    const open = () => {
      return thermometerAdapter.open()
    }
    thermometerAdapter.on('data', handleData)
    open()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const closeAdapter = () => {
    return thermometerAdapter.close()
  }

  const handleClick = () => {
    closeAdapter()
    history.push('/thermometer/consult')
  }

  return (
  <div>
    <div>
      <button onClick={handleClick}>Stop giving me data</button>
    </div>
    <h3>Data Output</h3>
    {readings.map(reading => {
      return (
        <div key={JSON.stringify(reading)}>
          <p>{reading.temperature}</p>
          <p>{reading.timeAndDate}</p>
        </div>
      )
    })}
  </div>
);
};

export default ThermometerData;