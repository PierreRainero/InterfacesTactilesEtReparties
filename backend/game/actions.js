let state = "waiting_players";
let actions = {};

module.exports = {

    start: function () {
        state = "running";
        console.log("actions start");
    },

    getState: function (){
        return state;
    }

};
