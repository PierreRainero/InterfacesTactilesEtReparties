module.exports = class Player {
  constructor(id, state) {
    this.id = id;
    this.state = state;
    this.progress = 0;
    this.hurdlesAvoided = [];
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
    const nextHurdle = this.hurdlesAvoided.length;

    // hurdle approaching
    if (this.progress > map.hurdles[nextHurdle] - 2 && this.progress < map.hurdles[nextHurdle]){
      return true;
    }
    else return false;
  }


  checkCollision(map){
    let res = false;
    const nextHurdle = this.hurdlesAvoided.length;

    if(this.progress >= map.hurdles[nextHurdle]){
      if(!this.hasJumped) {
        this.hurdlesAvoided.push(false);
        res = true;
      }

      else {
        this.hurdlesAvoided.push(true);
      }
      this.hasJumped = false;
    }
    return res;
  }

  jump(map){
    if(this.isApproachingHurdle(map)){
      this.hasJumped = true;
    }
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