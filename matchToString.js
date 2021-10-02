const config = require('./config.json');

module.exports = function matchToString(match) {
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
};

function matchDate(match) {
    return new Date(match['info']['gameCreation']);
}

function winningTeamID(match) {
    if (match['info']['teams'][0]['win']) return match['info']['teams'][0]['teamId'];
    else return match['info']['teams'][1]['teamId'];
}
