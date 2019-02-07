hurdles = [13.72, 22.86, 32, 41.14, 50.28, 59.42, 68.56, 77.7, 86.84, 95.98];

module.exports = {
    getHurdles: function (){
        return hurdles;
    },

    getHurdle: function (index){
        return hurdles[index];
    },
}