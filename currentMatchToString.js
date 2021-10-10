module.exports = currentMatchToString;

const data = require('./data.json');

function currentMatchToString(match, leagueJs) {
    console.log(match);
    // initialize output
    let output = '';
    output += `Game started !, `;
    // participants KDA
    const participants = match['participants'];
    for (const player of participants) {
        const team = data['teams'][String(player['teamId'])];
        const champ = leagueJs.StaticData.gettingChampionById(player['championId']);
        output += `${team} **${player['summonerName']}** *${champ}* `;
        output += '\n';
    }
    return output;
}
