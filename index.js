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
   * @param {boolean} [logToFile] - Log to file flag
   * @param {boolean} [logFilePath] - Log file path
   * @param {boolean} [logToConsole] - Log to console flag
   * @param {LOG_LEVELS} [level] - Log level
   */
  constructor({ logToFile = false, logToConsole = false, logFilePath, level }) {
    this.logToFile = logToFile || false;
    this.logToConsole = logToConsole || false;
    this.logFilePath = logFilePath || undefined;
    this.level = level === undefined ? LOG_LEVELS.INFO : level;
  }

  /**
   * DEBUG - intended for logging detailed information and for
   * debugging.
   */
  debug(...message) {
    const level = LOG_LEVELS.DEBUG;
    if (this.level > level) return;
    this.#log("DEBUG", ...message);
  }

  /** INFO - Provides information on normal operation. */
  info(...message) {
    const level = LOG_LEVELS.INFO;
    if (this.level > level) return;
    this.#log("INFO", ...message);
  }

  /** WARN - Notifies of potential issues that may lead to errors. */
  warn(...message) {
    const level = LOG_LEVELS.WARN;
    if (this.level > level) return;
    this.#log("WARN", ...message);
  }

  /** ERROR - Indicates an error that may cause the process to fail. */
  error(...message) {
    const level = LOG_LEVELS.ERROR;
    if (this.level > level) return;
    this.#log("ERROR", ...message);
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
