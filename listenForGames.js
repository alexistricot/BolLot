module.exports = listenForGames;

// const { ToadScheduler, SimpleIntervalJob, Task, AsyncTask } = require('toad-scheduler');
const config = require('./config.json');
const currentMatchToString = require('./currentMatchToString');
const fs = require('fs');

function listenForGames(leagueJs, discordClient) {
    setInterval(getCurrentGames(leagueJs, discordClient), 1000 * config['interval']);
}

function errorHandling(err) {
    if (err) {
        console.error(err);
        throw err;
    }
}

function getCurrentGames(leagueJs, discordClient) {
    return () => {
        const tracker = JSON.parse(fs.readFileSync('./tracker.json'));
        for (const player in tracker['players']) {
            const summonerId = tracker['players'][player];
            leagueJs.Spectator.gettingActiveGame(summonerId)
                .then((match) => {
                    if (!tracker['games'].includes(match.gameId)) {
                        console.log('\n\n');
                        console.log(match);
                        console.log('\n\n');
                        tracker['games'].push(match.gameId);
                        fs.writeFile('tracker.json', JSON.stringify(tracker), errorHandling);
                        currentMatchToString(match, leagueJs, discordClient);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    if (err & err.error & err?.error.includes('Data not found')) return;
                });
        }
    };
}
