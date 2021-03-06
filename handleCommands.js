const matchToString = require('./matchToString');
const fs = require('fs');

module.exports = function(leagueJs) {
    return async function(interaction) {
        // check the interaction
        if (interaction.user.bot) return;
        if (!interaction.isCommand()) return;
        // get the argument
        const summoner = summonerInteraction(interaction);
        // execute the command
        switch (interaction.commandName) {
        case 'last':
            await interaction.reply('`Working...`');
            lastGameBySummonerName(interaction, leagueJs, summoner);
            break;
        case 'track':
            await interaction.reply('`Working...`');
            trackPlayer(interaction, leagueJs, summoner);
            break;
        case 'untrack':
            await interaction.reply('`Working...`');
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
                const output = matchToString(last_match);
                reply(interaction, output);
            },
        );
    });
}

function trackPlayer(interaction, leagueJs, summonerName) {
    const tracker = JSON.parse(fs.readFileSync('./tracker.json'));
    leagueJs.Summoner.gettingByName(summonerName)
        .then((summoner) => {
            tracker['players'][summonerName.toLowerCase()] = summoner['id'];
            fs.writeFile('./tracker.json', JSON.stringify(tracker), console.error);
            const output =
                `Tracking player ${summonerName}.` +
                ` Tracked players : ${trackedPlayersToString(tracker)}`;
            reply(interaction, output);
        })
        .catch((error) => {
            const output = `Did not find summoner ${summonerName}.`;
            reply(interaction, output);
            console.log(error);
        });
}

function untrackPlayer(interaction, leagueJs, summonerName) {
    const tracker = JSON.parse(fs.readFileSync('./tracker.json'));
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

function summonerInteraction(interaction) {
    return interaction.options.data[0].value;
}

function reply(interaction, message) {
    if (interaction.replied) {
        interaction.editReply(message);
    }
    else {
        interaction.reply(message);
    }
    console.log(message);
}
