module.exports = class Player {
  constructor(id, state) {
    this.id = id;
    this.state = state;
  }

  setWatchCaptor(deviceId, dataSharing) {
    this.deviceId = deviceId;
    this.allowDataSharing = dataSharing;
  }
}