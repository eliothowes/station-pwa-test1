import React from 'react';
import "./NativePlayground.css"

const NativePlayground = () => {
  const startScan = async () => {
    if ('flutter_inappwebview' in window) {
      const result = await window.flutter_inappwebview.callHandler('startScan');

      console.log('\x1b[31m\x1b[47m%s\x1b[0m', '<<< Start >>>', '\n');
      console.log(result);
      console.log('\x1b[0m%s\x1b[32m\x1b[47m%s\x1b[0m', '\n', '<<< Finish >>>', '\n');
    }
  }

  const connectDevice = async (deviceIdentifier) => {
    if ('flutter_inappwebview' in window) {
      const result = await window.flutter_inappwebview.callHandler('connectDevice', {deviceIdentifier});
      console.log('\x1b[31m\x1b[47m%s\x1b[0m', '<<< Start >>>', '\n');
      console.log(result);
      console.log('\x1b[0m%s\x1b[32m\x1b[47m%s\x1b[0m', '\n', '<<< Finish >>>', '\n');
    }
  }
  return (
    <div className="buttons-container">
      <button onClick={startScan}>
        Start scan
      </button>
      <button onClick={() => connectDevice('taidoc-td1241-ble')}>
        Connect TD-1241
      </button>
    </div>
  );
};

export default NativePlayground;
