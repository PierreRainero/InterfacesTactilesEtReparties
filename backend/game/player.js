module.exports = class Player {
  constructor(id, state) {
    this.id = id;
    this.state = state;
  }

  /**
   * Associates a captor (watch) to a player
   * @param {number} deviceId captor identifier
   * @param {boolean} dataSharing permission to display sensory data
   */
  setWatchCaptor(deviceId, dataSharing) {
    this.deviceId = deviceId;
    this.allowDataSharing = dataSharing;
  }

  /**
   * Update heartbeat to a player
   * @param {*} heartbeat 
   */
  setHeartbeat(heartbeat) {
    this.heartbeat = heartbeat
  }
}