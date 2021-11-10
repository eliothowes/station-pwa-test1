import React from 'react';

const NativePlayground = () => {
  const startScan = () => {
    window.postMessage('startScan')
  }
  return (
    <div>
      <button onClick={startScan}>
        Start scan
      </button>
    </div>
  );
};

export default NativePlayground;
