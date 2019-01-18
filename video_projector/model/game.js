var game = {
    players: [],
    startTime: null,
    getCurrentTime: function(){
        var current = new Date();
        var diff = current - this.startTime;
        diff = new Date(diff);
        var msec = diff.getMilliseconds()
        var sec = diff.getSeconds()
        var min = diff.getMinutes()
        var hr = diff.getHours()-1
        if (min < 10){
            min = "0" + min
        }
        if (sec < 10){
            sec = "0" + sec
        }
        if(msec < 10){
            msec = "00" +msec
        }
        else if(msec < 100){
            msec = "0" +msec
        }
        return `${hr}:${min}:${sec}:${msec}`;
    },
    startTimerOn: function (element) {
        this.startTime = new Date();
        setInterval(() => {
            element.innerHTML = this.getCurrentTime();
        }, 1);
    },
    getPlayerColor(id){
        switch(id){
            case "red":
                return {h: 0, s: 0.53, l: 0.58};
            case "blue":
                return {h: 0.58, s: 1, l: 0.56};
            default:
                return {h: 0, s: 0, l: 0};
        }
    },
    getPlayerBackgroundColor(id){
        switch(id){
            case "red":
                return "rgb(92, 205, 205)";
            case "blue":
                return "rgb(255, 141, 30)";
            default:
                return "rgb(0, 0, 0)";
        }
    }
}