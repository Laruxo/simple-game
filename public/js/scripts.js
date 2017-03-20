/**
 * Simple timer counting time from 00:00 to infinity and beyond
 */
class Timer {
  /**
   * @constructor
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
  }

  /**
   * Resets timer variables to zeroes.
   */
  resetVariables() {
    this.timer = null;
    this.min = 0;
    this.sec = 0;
    this.element.innerText = '00:00';
  }

  /**
   * Starts timer from 00:00
   */
  start() {
    if (!this.timer) {
      this.resetVariables();
      this.element.classList.remove('hidden');

      this.timer = setInterval(() => {
        this._addSecond();
        this.element.innerText = this._toString();
      }, 1000);
    }
  }

  /**
   * Stops, hides and resets timer
   */
  stop() {
    clearInterval(this.timer);
    this.element.classList.add('hidden');
    this.resetVariables();
  }

  /**
   * Adds one second to the timer
   * @private
   */
  _addSecond() {
    this.sec++;
    if (this.sec === 60) {
      this.sec = 0;
      this.min++;
    }
  }

  /**
   * Coverts timer to string
   * @return {string}
   * @private
   */
  _toString() {
    let time = '';
    if (this.min < 10) {
      time += '0';
    }
    time += this.min.toString(10);

    time += ':';

    if (this.sec < 10) {
      time += '0';
    }
    time += this.sec.toString(10);

    return time;
  }
}

/**
 * MatchFinder that finds you an opponent
 */
class MatchFinder {
  /**
   * @constructor
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
    this.button = element.querySelector('.match-finder__button');
    this.timer = new Timer(element.querySelector('.match-finder__timer'));
    this.averageWait = element.querySelector('.match-finder__average');
    this.inQueue = false;

    this.initializeEvents();
  }

  /**
   * Initializes events
   */
  initializeEvents() {
    this.button.addEventListener('click', this.find.bind(this));
  }

  /**
   * Finds match for current user
   */
  find() {
    if (!this.inQueue) {
      this.inQueue = true;
      this.timer.start();

      const ws = new WebSocket('ws://' + window.location.host + '/matchmaking');
      ws.addEventListener('message', this.handleMessage.bind(this));
      ws.addEventListener('open', () => ws.send('joinQueue'));
    }
  }

  /**
   * Handles message coming over web socket
   * @param {MessageEvent} event
   */
  handleMessage(event) {
    const data = JSON.parse(event.data);

    if (!data.type) {
      console.log('bad request');
      return;
    }

    if (data.type === 'matchFound' && data.url) {
      window.location = data.url;
    } else if (data.type === 'averageWait' && data.time) {
      this.averageWait.innerText = data.time;
    }
  }
}

const matchfinder = document.querySelector('.match-finder');
if (matchfinder) {
  new MatchFinder(matchfinder);
}

/**
 * Game managing class
 */
class Game {
  /**
   * @constructor
   * @param {Element} element
   */
  constructor(element) {
    this.element = element;
    this.button = element.querySelector('.game__button');

    this.createWebSocket();
  }

  /**
   * Creates web socket and attaches its handlers
   */
  createWebSocket() {
    this.ws = new WebSocket('ws://' + window.location.host + '/game');
    this.ws.addEventListener('message', this.handleMessage.bind(this));
    this.ws.addEventListener('open', () => this.ws.send('ready'));
    this.ws.addEventListener('close', () => window.location = '/');
  }

  /**
   * Handles message coming over web socket
   * @param {MessageEvent} event
   */
  handleMessage(event) {
    const data = JSON.parse(event.data);

    if (!data.type) {
      console.log('bad request');
      return;
    }

    if (data.type === 'gameStart') {
      this.startGame();
    } else if (data.type === 'gameEnded' && data.url) {
      window.location = data.url;
    }
  }

  /**
   * Starts game by showing "win" button
   */
  startGame() {
    this.button.classList.remove('hidden');
    this.button.addEventListener('click', () => this.ws.send('win'));
  }
}

const game = document.querySelector('.game');
if (game) {
  new Game(game);
}
