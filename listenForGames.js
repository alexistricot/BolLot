module.exports = listenForGames;

// const { ToadScheduler, SimpleIntervalJob, Task, AsyncTask } = require('toad-scheduler');
const config = require('./config.json');
const currentMatchToString = require('./currentMatchToString');
const fs = require('fs');

function listenForGames(leagueJs, discordClient) {
    // const scheduler = new ToadScheduler();
    // check if players have a current game
    // const getTask = new AsyncTask(
    //     'get current games',
    //     getCurrentGames(leagueJs, discordClient),
    //     errorHandling,
    // );
    // const getJob = new SimpleIntervalJob({ seconds: config['interval'] }, getTask);
    // scheduler.addSimpleIntervalJob(getJob);
    setInterval(getCurrentGames(leagueJs, discordClient), config['interval']);
}

function errorHandling(err) {
    if (err) {
        console.error(err);
        throw err;
    }
}

function getCurrentGames(leagueJs, discordClient) {
    return () => {
        const tracker = require('./tracker.json');
        for (const player in tracker['players']) {
            const summonerId = tracker['players'][player];
            leagueJs.Spectator.gettingActiveGame(summonerId)
                .then((match) => {
                    if (~tracker['games'].includes(match.gameId)) {
                        console.log('\n\n');
                        console.log(match);
                        console.log('\n\n');
                        const output_str = currentMatchToString(match, leagueJs);
                        console.log(`output_str: ${output_str}\n`);
                        discordClient
                            .fetch(config['channel'])
                            .then((channel) => channel.send(output_str))
                            .catch(errorHandling);
                        tracker['games'].push(match.id);
                        fs.writeFile('tracker.json', JSON.stringify(tracker), errorHandling);
                    }
                })
                .catch((err) => {
                    if (err['error'].includes('Data not found')) return;
                    console.log(err['error']);
                });
        }
    };
}
