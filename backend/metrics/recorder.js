var fs = require('fs');
const folderForDatas = './metrics/datas/';

module.exports = {
    /**
     * Save performances into a record file to adapt game difficulty
     * @param {string} label Label of the session
     * @param {array} datas Array of players performances
     */
    addRecord(label, datas) {
        const fileName = Date.now() + (label ? '-' + label : '');
        const dataToStore = JSON.stringify(this.removeVirtualPlayer(datas));
        fs.writeFile(folderForDatas + fileName + '.json', dataToStore, { flag: 'w' }, (err) => {
            if (err) {
                console.log(err);
            }
            console.log('Successfully saved last race : ' + fileName);
        });
    },

    /**
     * Remove virtual player from data
     * @param {array} datas Array containing all players
     * @return {array} Array containing only real players
     */
    removeVirtualPlayer(datas){
        const res = [];
        for(let player of datas){
            if(player.playerId !== 0){
                res.push(player)
            }
        }

        return res;
    }
}