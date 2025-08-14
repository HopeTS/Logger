# Logger

A tiny and simple Node.js logger that allows you to automatically write all logs to a file, the option for console output, and log levels

This logger comes with bare runtime compatibility.

## Installation

npm install @hopets/logger

## Usage

```javascript
import Logger, { LOG_TYPES } from "@hopets/logger";

//
// Log only to console:
const logConsole = new Logger({ logToConsole: true });

logConsole.info("App started");
logConsole.debug("Debugging details…");

//
// Log to both file and console:
const logBoth = new Logger({
  logToFile: true,
  logFilePath: "./app.log",
  logToConsole: true,
});

logBoth.warn("This is a warning");
logBoth.error("Something went wrong!");

//
// Add a callback function to run whenever a log function is called
const logCallback = new Logger();

function cb(...message) {
  console.log("Callback!");
}

// Run cb whenever log.warn() is called
logCallback.on(LOG_TYPES.WARN, cb);
```
