const config = require('./config.json');
const prefix = config['prefix'];

module.exports = function(leagueJs) {
    return function(message) {
        // get the command name and the arguments
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        // check if the command corresponds to one of the aliases
        const args = message.content.slice(prefix.length).trim().split(' ');
        const commandName = args.shift().toLowerCase();
        switch (commandName) {
        case 'last':
            lastGameBySummonerName(message, leagueJs, args[0]);
            break;
        default:
            break;
        }
    };
};

function lastGameBySummonerName(message, leagueJs, summonerName) {
    leagueJs.Summoner.gettingByName(summonerName).then((summ) => {
        leagueJs.Match.gettingListByAccount(summ.puuid, { beginIndex: 0, endIndex: 1 }).then(
            (data) => {
                // get the last game
                const last_match = data['matches'][0];
                console.log(last_match['metadata']);
                message.reply(matchToString(last_match));
            },
        );
    });
}

function matchDate(match) {
    return new Date(match['info']['gameCreation']);
}

function winningTeamID(match) {
    if (match['info']['teams'][0]['win']) return match['info']['teams'][0]['teamId'];
    else return match['info']['teams'][1]['teamId'];
}

function matchToString(match) {
    // initialize output
    let output = '';
    // match metadata
    const date = matchDate(match);
    const winID = winningTeamID(match);
    output += `Game from ${date}, `;
    output += `${String(config['teams'][winID])} won\n\n`;
    // participants KDA
    const participants = match['info']['participants'];
    for (const player of participants) {
        const team = config['teams'][String(player['teamId'])];
        output += `${team} **${player['summonerName']}** *${player['championName']}* `;
        output += `${player['kills']}/${player['deaths']}/${player['assists']}`;
        output += '\n';
    }
    return output;
}
