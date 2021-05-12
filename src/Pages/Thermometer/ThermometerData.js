import React from 'react';
import {
  useHistory
} from "react-router-dom";

const ThermometerData = ({data, thermometerAdapter}) => {
  const history = useHistory();

  React.useEffect(() => {
    const open = () => {
      return thermometerAdapter.open()
    }
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
  </div>
);
};

export default ThermometerData;