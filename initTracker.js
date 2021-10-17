const fs = require('fs');

const trackerPath = './tracker.json';

module.exports = function() {
    const tracker = { players: {}, games: [] };
    if (!fs.existsSync(trackerPath)) {
        fs.writeFile(trackerPath, JSON.stringify(tracker), console.error);
    }
};
