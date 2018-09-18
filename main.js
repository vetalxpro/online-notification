(() => {
  class OnlineService {
    constructor() {
      this.callbacks = {
        online: [],
        offline: []
      };
      this.lastStatus = null;
      this.checkUrl = 'https://jsonplaceholder.typicode.com/users';
      this.checkDelay = 30000;
      this.isRequestPending = false;
    }

    init() {
      this.initBrowserApi();
      this.initFallbackCheck();
      return this;
    }

    getOnlineStatus() {
      return window.navigator.onLine;
    }

    onOnline(func) {
      this.callbacks.online.push(func);
    }

    onOffline(func) {
      this.callbacks.offline.push(func);
    }

    initBrowserApi() {
      window.addEventListener('online', () => {
        this.emitOnline();
      });
      window.addEventListener('offline', () => {
        this.emitOffline();
      });
    }

    initFallbackCheck() {
      const handler = () => {
        if (this.isRequestPending) {
          return;
        }
        this.isRequestPending = true;
        this.sendRequest()
          .then(() => {
            this.emitOnline();
            this.isRequestPending = false;
          })
          .catch((err) => {
            this.emitOffline();
            this.isRequestPending = false;
          });
      };
      setInterval(() => {
        handler();
      }, this.checkDelay);
      handler();
    }

    sendRequest() {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', this.checkUrl);
        xhr.onload = function() {
          resolve();
        };
        xhr.onerror = function(err) {
          reject(err);
        };
        xhr.send();
      });
    }

    emitOnline() {
      if (this.lastStatus !== 'online') {
        this.lastStatus = 'online';
        this.callbacks.online.forEach((cb) => cb());
      }
    }

    emitOffline() {
      if (this.lastStatus !== 'offline') {
        this.lastStatus = 'offline';
        this.callbacks.offline.forEach((cb) => cb());
      }
    }
  }

  class SoundService {
    constructor() {
      this.onlineAudio = new Audio('assets/audio/online.ogg');
      this.offlineAudio = new Audio('assets/audio/offline.ogg');
    }

    playOnline() {
      this.stop(this.offlineAudio);
      this.onlineAudio.play();
    }

    playOffline() {
      this.stop(this.onlineAudio);
      this.offlineAudio.play();
    }

    stop(audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  class StatusComponent {
    constructor() {
      this.classes = {
        online: 'green',
        offline: 'red'
      };
      this.text = {
        online: 'online',
        offline: 'offline'
      };
      this.selector = '#status';
    }

    init() {
      this.statusEl = document.querySelector(this.selector);
      return this;
    }

    setOnline() {
      this.statusEl.textContent = this.text.online;
      this.statusEl.classList.remove(this.classes.offline);
      this.statusEl.classList.add(this.classes.online);
    }

    setOffline() {
      this.statusEl.textContent = this.text.offline;
      this.statusEl.classList.remove(this.classes.online);
      this.statusEl.classList.add(this.classes.offline);
    }
  }

  class App {
    constructor() {
      this.onlineService = new OnlineService().init();
      this.statusComponent = new StatusComponent().init();
      this.soundService = new SoundService();
    }

    start() {
      const onlineHandler = () => {
        this.statusComponent.setOnline();
        this.soundService.playOnline();
      };

      const offlineHandler = () => {
        this.statusComponent.setOffline();
        this.soundService.playOffline();
      };
      this.onlineService.onOnline(onlineHandler);
      this.onlineService.onOffline(offlineHandler);
      const isOnline = this.onlineService.getOnlineStatus;
      if (isOnline) {
        onlineHandler();
      } else {
        offlineHandler();
      }
    }
  }

  new App().start();
})();
