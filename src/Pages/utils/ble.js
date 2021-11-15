export function startScan () {
  if ('flutter_inappwebview' in window) {
    return window.flutter_inappwebview.callHandler('startScan');
  }

  if ('ReactNativeWebView' in window) {
    return window.ReactNativeWebView.postMessage('startScan')
  }
}

export function connectDevice (deviceIdentifier) {
  if ('flutter_inappwebview' in window) {
    return window
    .flutter_inappwebview
    .callHandler('connectDevice',{
      device: deviceIdentifier
    });
  }

  if ('ReactNativeWebView' in window) {
    return window.ReactNativeWebView.postMessage({
      messageType: "connectDevice",
      value: {
        device: deviceIdentifier
      }
    })
  }
}