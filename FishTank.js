const fetch = require("node-fetch");

const FISH_TANK_TASMOTA_IP = process.env.FISH_TANK_TASMOTA_IP;

class FishTank {
  hasLights = true;
  areLightsOn;

  constructor() {
    this.syncLightsState();
  }

  getHasLights() {
    return this.hasLights;
  }

  getAreLightsOn() {
    return this.areLightsOn;
  }

  async turnLightsOff() {
    if (!!this.areLightsOn) {
      try {
        await fetch(`http://${FISH_TANK_TASMOTA_IP}/?m=1&o=1`);
      } catch (e) {
        console.error(e);
      }
    }
  }

  async turnLightsOn() {
    if (!this.areLightsOn) {
      try {
        await fetch(`http://${FISH_TANK_TASMOTA_IP}/?m=1&o=1`);
      } catch (e) {
        console.error(e);
      }
    }
  }

  async syncLightsState() {
    const responseInText = await fetch(`http://${FISH_TANK_TASMOTA_IP}/?m=1`);
    const response = await responseInText.text();
    const offRegex = /off/gi;

    this.areLightsOn = !response.match(offRegex);
  }
}

module.exports = {
  FishTank,
};
