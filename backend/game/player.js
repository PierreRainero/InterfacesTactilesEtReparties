module.exports = class Player {
  constructor(id, state, bot) {
    this.id = id;
    this.state = state;
    this.progress = 0;
    this.hurdlesAvoided = [];
    this.finish = false;
    this.hasJumped = false;
    this.heartbeat = 0;
    this.speed = 0;
    this.bot = bot;
    this.heartbeatAverage = { value: 0, heartbeats: 0, max: 0, min: 0 };
    this.speedAverage = { value: 0, speeds: 0 };
  }

  /**
   * Associates a captor (watch) to a player
   * @param {number} deviceId captor identifier
   */
  setWatchCaptor(deviceId) {
    this.deviceId = deviceId;
  }

  isApproachingHurdle(map) {
    const nextHurdle = this.hurdlesAvoided.length;

    // hurdle approaching
    if (this.progress > (map.getHurdle(nextHurdle) - 2) && this.progress < map.getHurdle(nextHurdle)) {
      return true;
    }
    else {
      return false;
    }
  }

  checkCollision(map) {
    let collision = null;
    const nextHurdle = this.hurdlesAvoided.length;

    if (this.progress > (map.getHurdle(nextHurdle) - 0.5)) {
      if (!this.hasJumped) {
        this.hurdlesAvoided.push(false);
        collision = nextHurdle;
      }
      else {
        this.hurdlesAvoided.push(true);
      }
      this.hasJumped = false;
    }
    return collision;
  }

  needToJumpBot(map){
      const nextHurdle = this.hurdlesAvoided.length;

      if (this.progress < (map.getHurdle(nextHurdle) - 0.5) && this.progress > (map.getHurdle(nextHurdle) - 2)) {
          this.hurdlesAvoided.push(true);
          return true;
      }

      return false;
  }

  needToJump(map){
      const nextHurdle = this.hurdlesAvoided.length;

      if (this.progress < (map.getHurdle(nextHurdle) - 0.5) && this.progress > (map.getHurdle(nextHurdle) - 2))
          return true;

      return false;
  }

  jump(map) {
    if (this.isApproachingHurdle(map)) {
      this.hasJumped = true;
    }
  }

  addProgress(progress) {
    if (this.progress < 110) {
      this.progress += progress;
    } else {
      this.finish = true;
    }
  }

  /**
   * Update heartbeat to a player
   * @param {number} heartbeat current heartbeat
   */
  setHeartbeat(heartbeat) {
    this.heartbeat = heartbeat;
    this.heartbeatAverage.value += heartbeat;
    this.heartbeatAverage.heartbeats++;

    if(heartbeat > this.heartbeatAverage.max ){
      this.heartbeatAverage.max = heartbeat;
    }
    if(this.heartbeatAverage.min===0){
      this.heartbeatAverage.min = heartbeat;
    }else if(heartbeat < this.heartbeatAverage.min ){
      this.heartbeatAverage.min = heartbeat;
    }
  }

  /**
   * Update player speed
   * @param {number} speed current speed (m/s)
   */
  updateSpeed(speed){
    this.speed = speed;
    this.speedAverage.value += speed;
    this.speedAverage.speeds++;
  }

  /**
   * Remove arrays of data of player
   */
  toDTO() {
    return {
      id: this.id,
      state: this.state,
      progress: this.progress,
      hurdlesAvoided: this.hurdlesAvoided,
      finish: this.finish,
      hasJumped: this.hasJumped,
      heartbeat: this.heartbeat,
      speed: this.speed,
      bot: this.bot
    };
  }
}