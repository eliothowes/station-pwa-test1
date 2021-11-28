import React from 'react';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
} from "react-router-dom";
import WebPlayground from './Pages/WebPlayground';
import NativePlayground from './Pages/NativePlayground';

const App = () => {
  const deferredPrompt = React.useRef(null);
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [showInstall, setShowInstall] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault()
      deferredPrompt.current = e;

      setShowInstall(true);
      // Optionally, send analytics event that PWA install promo was shown.
      console.log(`'beforeinstallprompt' event was fired.`);
    })

    window.addEventListener('appinstalled', (event) => {
      console.log('👍', 'appinstalled', event);
      // Clear the deferredPrompt so it can be garbage collected
      window.deferredPrompt = null;
      setIsInstalled(true)
    });
  }, [])

  const installApp = async () => {
    console.log('👍', 'butInstall-clicked');
    const promptEvent = deferredPrompt.current;
    if (!deferredPrompt) {
      // The deferred prompt isn't available.
      return;
    }
    // Show the install prompt.
    promptEvent.prompt();
    // Log the result
    const result = await promptEvent.userChoice;
    console.log('👍', 'userChoice', result);
    // Reset the deferred prompt variable, since
    // prompt() can only be called once.
    deferredPrompt.current = null;
    // Hide the install button.
    setShowInstall(false)
  }

  return (
    <div style={{padding: '1em'}}>
      <div>
        {showInstall && (
          <div className="install-banner">
            <button onClick={installApp}>
              Install app
            </button>
          </div>
        )}
        {isInstalled && (
          <div className="install-banner">
            App is installed
          </div>
        )}
      </div>
      <Router>
        <Switch>
          <Route exact path="/">
            <h1>Pick runtime</h1>
            <Link to="/native">
              Native Playground
            </Link>
            <div style={{display: 'inline', marginLeft: '1em'}}>
              <Link to="/web">
                Web Playground
              </Link>
            </div>
          </Route>
          <Route path="/native">
            <NativePlayground />
          </Route>
          <Route path="/web">
            <WebPlayground />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
