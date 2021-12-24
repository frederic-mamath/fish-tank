const FS = require("fs");
const DateTime = require("luxon").DateTime;
const Dotenv = require("dotenv");

Dotenv.config();

const { FishTank } = require("./FishTank");
const { sleep } = require("./utils");

const START_OF_DAY = process.env.START_OF_DAY || 8;
const END_OF_DAY = process.env.END_OF_DAY || 19;
const POLLING_DURATION = process.env.POLLING_DURATION || 10000;

const createRowInLogs = (isoDatetime, apiRoute, { hour, areLightsOn }) => {
  const FILE_PATH = "./logs.txt";

  const handleError = (error) => {
    if (error) throw error;
  };

  FS.appendFile(
    FILE_PATH,
    `[${isoDatetime}]: ${apiRoute} ${hour} ${START_OF_DAY} ${END_OF_DAY} ${areLightsOn} \n`,
    handleError
  );
};

const main = async () => {
  console.log("Fish Tank is listening...");
  const fishTank = new FishTank();

  while (true) {
    await fishTank.syncLightsState();

    const now = DateTime.now();

    const isoDatetime = now.toISO();
    const hour = now.c.hour;
    const areLightsOn = fishTank.getAreLightsOn();

    if (hour >= START_OF_DAY && hour < END_OF_DAY) {
      if (!areLightsOn) {
        createRowInLogs(isoDatetime, "/on", {
          hour,
          areLightsOn,
        });
        await fishTank.turnLightsOn();
      }
    } else {
      if (areLightsOn) {
        createRowInLogs(isoDatetime, "/off", {
          hour,
          areLightsOn,
        });
        await fishTank.turnLightsOff();
      }
    }
    await sleep(POLLING_DURATION);
  }
};

main();
