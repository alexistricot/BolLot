module.exports = currentMatchToString;

function currentMatchToString(match, leagueJs) {
    console.log(match);
    // initialize output
    let output = '';
    // match metadata
    const date = matchDate(match);
    output += `Game from ${date}, `;
    // participants KDA
    const participants = match['participants'];
    for (const player of participants) {
        const team = match['teams'][String(player['teamId'])];
        const champ = leagueJs.StaticData.gettingChampionById(player['championId']);
        output += `${team} **${player['summonerName']}** *${champ}* `;
        output += '\n';
    }
    return output;
}

function matchDate(match) {
    return new Date(match['info']['gameCreation']);
}
