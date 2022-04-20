import { existsSync, writeFile, readFileSync } from "fs";

const trackerPath = './tracker.json';

function initTracker() {
    const tracker = { players: {}, games: [] };
    if (!existsSync(trackerPath)) {
        writeFile(trackerPath, JSON.stringify(tracker), console.error);
    }
};

initTracker();


function trackPlayer(interaction: CommandInteraction, leagueJs, summonerName) {
    const tracker = JSON.parse(readFileSync('./tracker.json').toString());
    leagueJs.Summoner.gettingByName(summonerName)
        .then((summoner) => {
            tracker['players'][summonerName.toLowerCase()] = summoner['id'];
            fs.writeFile('./tracker.json', JSON.stringify(tracker), console.error);
            const output =
                `Tracking player ${summonerName}.` +
                ` Tracked players : ${trackedPlayersToString(tracker)}`;
            reply(interaction, output);
        })
        .catch((error: Error) => {
            const output = `Did not find summoner ${summonerName}.`;
            reply(interaction, output);
            console.log(error);
        });
}

function untrackPlayer(interaction: CommandInteraction, leagueJs, summonerName) {
    const tracker = JSON.parse(fs.readFileSync('./tracker.json').toString());
    if (Object.keys(tracker.players).includes(summonerName.toLowerCase())) {
        delete tracker['players'][summonerName.toLowerCase()];
        fs.writeFile('./tracker.json', JSON.stringify(tracker), console.error);
        const output =
            `Untracked player ${summonerName}.` +
            ` Tracked players : ${trackedPlayersToString(tracker)}`;
        reply(interaction, output);
    }
    else {
        const output =
            `Player ${summonerName} is untracked.` +
            ` Tracked players : ${trackedPlayersToString(tracker)}`;
        reply(interaction, output);
    }
}

function trackedPlayersToString(tracker) {
    return Object.keys(tracker.players)
        .reduce((r, x) => r + ', ' + String(x))
        .toLowerCase();
}
