module.exports = listenForGames;

// const { ToadScheduler, SimpleIntervalJob, Task, AsyncTask } = require('toad-scheduler');
const config = require('./config.json');
const currentMatchToString = require('./currentMatchToString');
const fs = require('fs');
const { removeEmojis } = require('./champion-emoji');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function listenForGames(leagueJs, discordClient) {
    setInterval(getCurrentGames(leagueJs, discordClient), 1000 * config['interval']);
    await delay(500 * config['interval']);
    guild = discordClient.guilds.cache.find((g) => g.id == config['guild']);
    setInterval(removeEmojis(guild), 1000 * config['interval']);
}

function errorHandling(err) {
    if (err) {
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
                    else {
                        // console.log(`Player ${player} in already handled game ${match.gameId}.`);
                    }
                })
                .catch((err) => {
                    const error = JSON.parse(err.error);
                    if (error.status.message && error.status.message.includes('Data not found')) {
                        // console.log(`No match found for ${player} with id ${summonerId}.`);
                        return;
                    }
                });
        }
    };
}
