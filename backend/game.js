let state = "waiting_players";

module.exports = {

    start: function () {
        state = "running";
        console.log("game start");
    },

    getState: function (){
        return state;
    }

};
