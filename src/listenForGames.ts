// const { ToadScheduler, SimpleIntervalJob, Task, AsyncTask } = require('toad-scheduler');
import * as config from './config/config.json';
import currentMatchToString from './currentMatchToString';
import * as fs from 'fs';
import {Client} from "discord.js";

function listenForGames(leagueJs, discordClient: Client) {
    setInterval(getCurrentGames(leagueJs, discordClient), 1000 * config['interval']);
}

function errorHandling(err) {
    if (err) {
        throw err;
    }
}

function getCurrentGames(leagueJs, discordClient: Client) {
    return () => {
        const tracker = JSON.parse(fs.readFileSync('./tracker.json').toString());
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
                .catch((err: Error) => {
                    if (err & err.error & err?.error.includes('Data not found')) {
                        console.log('No match found.');
                        return;
                    }
                });
        }
    };
}

export default listenForGames;