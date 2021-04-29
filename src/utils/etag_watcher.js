const EventEmitter = require('events');

export default class ETagWatcher extends EventEmitter {
  constructor (url, opts = {}) {
    super();
    this._url = url;
    this._interval = opts.interval || process.env.NODE_ENV === 'production' ? 10 * 1000 : 60 * 1000;
    this._eTagOnPage = null;
    this.watch = this.watch.bind(this);
    this.unwatch = this.unwatch.bind(this);
  }

  async watch () {
    try {
      const response = await fetch(this._url);
      const eTagOnServer = response.headers.get('Etag');
      if (!this._eTagOnPage) {
        this._eTagOnPage = eTagOnServer;
      }
      else if (this._eTagOnPage !== eTagOnServer) {
        this.emit('change', {
          eTagOnPage: this._eTagOnPage,
          eTagOnServer
        });
      }
      else {
        // Resource is up to date...
      }
    }
    catch (err) {
      console.error(err);
    }
    finally {
      this._hdl = setTimeout(this.watch, this._interval);
    }
  }

  unwatch () {
    this.removeAllListeners();
    clearTimeout(this._hdl);
  }
}
