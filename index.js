import fs from "fs";

/** Types of log messages */
export const LOG_TYPES = {
  DEBUG: "DEBUG",
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
};

/** Severity levels */
export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

/**
 * Node.js that allows for monitoring of verbose debugging
 * information and recording of log data to a given file
 */
class Logger {
  /**
   *
   * @param {Object} [opts] - Configuration options
   * @param {boolean} [opts.logToFile] - Log to file flag
   * @param {boolean} [opts.logFilePath] - Log file path
   * @param {boolean} [opts.logToConsole] - Log to console flag
   * @param {LOG_LEVELS} [opts.level] - Log level
   * @param {boolean} [opts.clearFile] - Clear log file on initialization
   */
  constructor({
    logToFile = false,
    logToConsole = false,
    logFilePath,
    level,
    clearFile = false,
  }) {
    this.logToFile = logToFile || false;
    this.logToConsole = logToConsole || false;
    this.logFilePath = logFilePath || undefined;
    this.level = level === undefined ? LOG_LEVELS.INFO : level;
    this.clearFile = clearFile;
    this.cb = {};

    // Clear file if specified
    if (this.logToFile && this.logFilePath) {
      if (fs.existsSync(this.logFilePath)) {
        fs.unlinkSync(this.logFilePath);
      }
      if (this.clearFile) {
        fs.writeFileSync(this.logFilePath, "");
      }
    }
  }

  /**
   * DEBUG - intended for logging detailed information and for
   * debugging.
   */
  debug(...message) {
    if (this.cb[LOG_TYPES.DEBUG]) this.cb[LOG_TYPES.DEBUG](...message);
    const level = LOG_LEVELS.DEBUG;
    if (this.level > level) return;
    this.#log("DEBUG", ...message);
  }

  /** INFO - Provides information on normal operation. */
  info(...message) {
    if (this.cb[LOG_TYPES.INFO]) this.cb[LOG_TYPES.INFO](...message);
    const level = LOG_LEVELS.INFO;
    if (this.level > level) return;
    this.#log("INFO", ...message);
  }

  /** WARN - Notifies of potential issues that may lead to errors. */
  warn(...message) {
    if (this.cb[LOG_TYPES.WARN]) this.cb[LOG_TYPES.WARN](...message);
    const level = LOG_LEVELS.WARN;
    if (this.level > level) return;
    this.#log("WARN", ...message);
  }

  /** ERROR - Indicates an error that may cause the process to fail. */
  error(...message) {
    if (this.cb[LOG_TYPES.ERROR]) this.cb[LOG_TYPES.ERROR](...message);
    const level = LOG_LEVELS.ERROR;
    if (this.level > level) return;
    this.#log("ERROR", ...message);
  }

  /**
   * Given a log level, add a callback function to run when that log level is
   * called.
   *
   * @param {LOG_LEVELS} level - The log level to add the callback for
   * @param {Function} cb - The callback function to run when the log level is
   *  called. The callback will receive the same arguments as the log function.
   *  (...message)
   *
   * @returns {void}
   */
  on(level, cb) {
    if (!Object.values(LOG_TYPES).includes(level)) return;
    if (typeof cb !== "function") return;

    this.cb[level] = cb;
  }

  /** Log function */
  #log(level, ...message) {
    // Construct string
    const payloadString = this.#getFormattedMessage(...message);
    const date = this.#getFormattedDate();
    const logMessage = `${date} [${level}] ${payloadString}`;

    // Write
    this.#logToFile(logMessage);
    this.#logToConsole(logMessage);
  }

  /** Log message to file */
  #logToFile(message) {
    if (this.logToFile) {
      if (!this.logFilePath) {
        throw new Error("No log file path provided");
      }
      fs.appendFileSync(this.logFilePath, message);
    }
  }

  /** Log message to console */
  #logToConsole(message) {
    if (this.logToConsole) console.log(message);
  }

  /** Get timestamp for logging */
  #getFormattedDate() {
    const now = new Date();
    return now.toISOString();
  }

  /** Format log message to string */
  #getFormattedMessage(...message) {
    return (
      message
        .map((arg) => {
          return String(arg);
        })
        .join(" ") + "\n"
    );
  }
}

export default Logger;
