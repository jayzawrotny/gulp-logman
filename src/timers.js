import moment from 'moment';

const SECONDS = 1000,
      MINUTES = SECONDS * 60,
      HOURS = MINUTES * 60,
      DAYS = HOURS * 24,
      MONTHS = DAYS * 30,
      YEARS = DAYS * 365;

/**
 * Timers
 * A a class that tracks timers and uses moment to calculate the elapsed time
 * between.
 *
 * @class
 * @property {array} durations - Collection of durations
 * @property {object} index - Quick index to quickly refer to timers.
 */
class Timers {

  /**
   * Elapsed
   * Retrieve the elapsed time between starting and stopping a timer.
   *
   * @method
   * @public
   * @param {number} diff - Difference in MS to format
   * @returns {string} Elapsed time formatted as a string
   */
  static elapsed (diff) {
    let time = '',
        duration = '',
        concat = (...args) => time += ' ' + args.join(''),
        skipDays = false;

    /** Create a moment duration */
    duration = moment.duration(diff);

    /** If it took years to run you might want to consider some changes */
    if (diff > YEARS) concat(duration.years(), 'y');

    /** It took months so lets add that string */
    if (diff > MONTHS) {
      concat(duration.months(), 'm');
      /** Determine if it's an even # of months, if so don't worry about days */
      if (Math.floor(duration.asMonths()) === duration.asMonths()) {
        skipDays = true;
      }
    }

    /** If the difference is more than a day */
    if (diff >= DAYS && !skipDays && duration.get('days') > 0) {
      concat(duration.days(), 'd');
    }

    /** If the difference is more than an hour */
    if (diff >= HOURS && duration.get('hours') > 0) {
      concat(duration.hours(), 'h');
    }

    /** If the difference is more than minutes */
    if (diff >= MINUTES) concat(duration.minutes(), 'min');

    /** IF the difference is more than a second */
    if (diff >= SECONDS && duration.get('seconds') > 0) {
      concat(duration.seconds(), 's');
    }

    /** Finally show the # of ms if not 0 */
    if (duration.get('milliseconds') > 0) {
      concat(Number(duration.get('milliseconds')), 'ms');
    }

    /** A nice pretty string to use */
    return time.trim();
  }

  /**
   * Constructor
   * Initializes the timers class
   *
   * @constructor
   */
  constructor () {
    this.durations = [];
    this.index = {};
  }

  /**
   * Diff
   * Returns the difference between the start and end of a diff
   *
   * @method
   * @public
   * @param {object|string} data - Either duration object or timer name
   * @returns {int} Difference between start and end time in ms
   */
  diff (data) {
    /** We were given a name instead of a duration */
    if (typeof data === 'string') {
      data = this.get(data);
    }

    return data.end - data.start;
  }

  /**
   * Get
   * Retrieves the duration by name
   *
   * @method
   * @public
   * @param {string} name - Name of the timer to retrieve
   * @returns {object} The target duration object
   */
  get (name) {
    try {
      return this.durations[this.index[name]];
    }
    catch (e) {
      throw new Error(`Could not find timer by the name of ${name}`);
    }
  }

  /**
   * Start
   * Creates a new timer
   *
   * @method
   * @public
   * @param {string} name - Name of the timer starting
   * @returns {int} Start time in miliseconds since unix epoch
   */
  start (name) {
    let time = Date.now();

    if (!name) {
      name = this.durations.length;
    }

    /** Create our duration and update the index */
    this.durations.push({
      name,
      start: time,
      end: null,
    });

    this.index[name] = this.durations.length - 1;

    return time;
  }

  /**
   * Stop
   * Stops a timer well at least in the terms of the interface really we
   * just track when this was called to calculate the diff.
   *
   * @method
   * @public
   * @param {string} name - Name of the timer
   * @returns {string} Result of this.elapsed(name)
   */
  stop (name) {
    let duration;

    if (!name) name = this.durations.length - 1;

    /** Get the current duration for this name */
    duration = this.get(name);

    if (!duration) return null;

    /** Record the end time of this timer in ms */
    duration.end = Date.now();

    /** Returned the elapsed time in a cute stringj */
    return this.diff(duration);
  }
}

export default Timers;
