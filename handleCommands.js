const matchToString = require('./matchToString');
const fs = require('fs');

module.exports = function(leagueJs) {
    return function(interaction) {
        // get the command name and the arguments
        if (interaction.user.bot) return;
        if (!interaction.isCommand()) return;
        // check if the command corresponds to one of the aliases
        console.log(interaction.options.data);
        const summoner = summonerInteraction(interaction);
        console.log(summoner);
        switch (interaction.commandName) {
        case 'last':
            interaction.reply('Working...');
            lastGameBySummonerName(interaction, leagueJs, summoner);
            break;
        case 'track':
            interaction.reply('Working...');
            trackPlayer(interaction, leagueJs, summoner);
            break;
        case 'untrack':
            interaction.reply('Working...');
            untrackPlayer(interaction, leagueJs, summoner);
            break;
        default:
            break;
        }
    };
};

function lastGameBySummonerName(interaction, leagueJs, summonerName) {
    leagueJs.Summoner.gettingByName(summonerName).then((summ) => {
        leagueJs.Match.gettingListByAccount(summ.puuid, { beginIndex: 0, endIndex: 1 }).then(
            (data) => {
                // get the last game
                const last_match = data['matches'][0];
                console.log(last_match['metadata']);
                interaction.editReply(matchToString(last_match));
            },
        );
    });
}

function trackPlayer(interaction, leagueJs, summonerName) {
    const tracker = JSON.parse(fs.readFileSync('./tracker.json'));
    leagueJs.Summoner.gettingByName(summonerName)
        .then((summoner) => {
            tracker['players'][summonerName.toLowerCase()] = summoner['puuid'];
            fs.writeFile('./tracker.json', JSON.stringify(tracker), console.error);
            interaction.editReply(
                `Tracking player ${summonerName}. Tracked players : ${trackedPlayersToString(
                    tracker,
                )}`,
            );
        })
        .catch((error) => {
            interaction.editReply(`Did not find summoner ${summonerName}.`);
            console.log(error);
        });
}

function untrackPlayer(interaction, leagueJs, summonerName) {
    const tracker = JSON.parse(fs.readFileSync('./tracker.json'));
    if (Object.keys(tracker.players).includes(summonerName.toLowerCase())) {
        delete tracker['players'][summonerName.toLowerCase()];
        fs.writeFile('./tracker.json', JSON.stringify(tracker), console.error);
        interaction.editReply(
            `Untracked player ${summonerName}.` +
                ` Tracked players : ${trackedPlayersToString(tracker)}`,
        );
    }
    else {
        interaction.editReply(
            `Player ${summonerName} is untracked.` +
                ` Tracked players : ${trackedPlayersToString(tracker)}`,
        );
    }
}

function trackedPlayersToString(tracker) {
    return Object.keys(tracker.players)
        .reduce((r, x) => r + ', ' + String(x))
        .toLowerCase();
}

function summonerInteraction(interaction) {
    return interaction.options.data[0].value;
}
