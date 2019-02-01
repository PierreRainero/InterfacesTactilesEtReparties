module.exports = class Player {
  constructor(id, state) {
    this.id = id;
    this.state = state;
    this.progress = 0;
    this.finish = false;
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

    isApproachingHurdle(map){
        let res = false;
        for (let hurdle in map.hurdles){
            if(this.progress > hurdle - 2 && this.progress < hurdle){
                res = true;
            }
        }
        return res;
    }

    addProgress(progress){
        if(this.progress < 110) {
            this.progress += progress;
            return this.progress;
        } else {
            this.finish = true;
        }
        return null;
    }

    /**
     * Update heartbeat to a player
     * @param {*} heartbeat
     */
    setHeartbeat(heartbeat) {
        this.heartbeat = heartbeat
    }
}