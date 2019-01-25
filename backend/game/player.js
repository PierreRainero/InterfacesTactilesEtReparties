module.exports = class Player {
  constructor(id, state) {
    this.id = id;
    this.state = state;
    this.progress = 0;
  }

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
}