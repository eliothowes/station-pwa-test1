import React from 'react';
import './App.css';
import PulseOximeter from './PulseOximeter'
import PretendConsultation from './PretendConsultation'
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";

const App = () => {
  const deferredPrompt = React.useRef(null);
  const [isInstalled, setIsInstalled] = React.useState(false);
  const [showInstall, setShowInstall] = React.useState(false);

  const [connectedUsbDevices, setConnectedUsbDevices] = React.useState([])

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

  function ConditionalRoute({ children, ...rest }) {
    return (
      <Route
        {...rest}
        render={() =>
          connectedUsbDevices.length > 0 ? (
            children
          ) : (
            <Redirect
              to={{pathname: "/",}}
            />
          )
        }
      />
    );
  }

  return (
    <div className="App">
    <Router>
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
      <Switch>
        <ConditionalRoute path="/consult">
          <PretendConsultation connectedUsbDevices={connectedUsbDevices} />
        </ConditionalRoute>
        <Route path="/">
          <PulseOximeter
            connectedUsbDevices={connectedUsbDevices}
            setConnectedUsbDevices={setConnectedUsbDevices}
          />
        </Route>
      </Switch>
    </Router>
    </div>
  );
}

export default App;
