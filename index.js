const express = require('express');
const app = express();
const os = require('os');

const APP_PORT = 3000;
const DEFAULT_RESPONSE = {
  status: "success",
};
const APP_STARTUP_DELAY_IN_SECONDS = process.env.APP_STARTUP_DELAY_IN_SECONDS || 0;
const APP_TERMINATE_DELAY_IN_SECONDS = process.env.APP_TERMINATE_DELAY_IN_SECONDS || 0;

const X_CRASH = "X-Crash";
const X_WAIT = "X-Wait";
const X_STATUS_CODE = "X-Status-Code";
const X_RESPONSE_DATA = "X-Response-Data";

async function delay(timeInSeconds) {
  return new Promise((resolve) => {
      setTimeout(() => {
          resolve(true);
      }, timeInSeconds * 1000);
  });
}

function getHeader(req, key, defaultValue = undefined) {
  return req.headers[key.toLowerCase()] || defaultValue;
}

function generateLogs() {
  setInterval(() => {
    console.log(`${new Date().toISOString()} | ${os.hostname()} | APP_LOGS: generating dummy logs`);
  }, 2 * 1000)
}

async function startApp() {
  app.use('/', async function (req, res) {
    let response = DEFAULT_RESPONSE;
    const crash = getHeader(req, X_CRASH);
    const wait = getHeader(req, X_WAIT, 0);
    const responseStatusCode = getHeader(req, X_STATUS_CODE, 200);
    const responseData = getHeader(req, X_RESPONSE_DATA);

    if (crash) {
      console.log(`APP_TERMINATE: app will crash`);
      process.exit(1);
    }

    if (wait) {
      console.log(`APP_PAUSE: request is waiting for ${wait} seconds`);
      await delay(wait);
      console.log(`APP_RESUME: request is continued`);
    }

    if (responseData) {
      try {
        response = JSON.parse(responseData);
      } catch (e) {
        console.error(`APP_REQUEST_ERROR: error parsing ${X_RESPONSE_DATA} from headers`)
        console.error(e.message);
      }
    }

    res.status(responseStatusCode).json(response);
  });

  if (APP_TERMINATE_DELAY_IN_SECONDS) {
    console.log(`APP_TERMINATE: waiting for ${APP_TERMINATE_DELAY_IN_SECONDS} seconds to terminate the app`);
    setTimeout(() => process.exit(1), APP_TERMINATE_DELAY_IN_SECONDS * 1000);
  }

  if (APP_STARTUP_DELAY_IN_SECONDS) {
    console.log(`APP_PAUSE: waiting for ${APP_STARTUP_DELAY_IN_SECONDS} seconds to start the app`);
    await delay(APP_STARTUP_DELAY_IN_SECONDS);
  }

  app.listen(APP_PORT, async () => {
    console.log(`APP_READY: mock apis for kubernetes started on port ${APP_PORT}`);
    generateLogs()
  });
}

startApp();