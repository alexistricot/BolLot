module.exports = currentMatchToString;

const data = require('./data.json');
const config = require('./config.json');

function currentMatchToString(match, leagueJs, discordClient) {
    console.log(match);
    // initialize output
    let output = '';
    output += `Game started !\n`;
    // participants
    const participants = match['participants'];
    const summonerName = [];
    const championId = [];
    const team = [];
    for (const player of participants) {
        team.push(data['teams'][String(player['teamId'])]);
        championId.push(String(player['championId']));
        summonerName.push(String(player['summonerName']));
    }
    const promises = championId.map((x) => leagueJs.StaticData.gettingChampionById(x));
    Promise.all(promises).then((champion) => {
        console.log(champion);
        for (let i = 0; i < summonerName.length; i++) {
            output += `${team[i]} **${summonerName[i]}** *${champion[i]['name']}*\n`;
        }
        const channel = getChannel(discordClient);
        send_string(channel, output);
    });
}

function send_string(channel, output_str) {
    console.log(`output_str: ${output_str}\n`);
    channel.send(output_str);
}

function getChannel(discordClient) {
    return discordClient.channels.cache.find((chan) => chan.id == config['channel']);
}
