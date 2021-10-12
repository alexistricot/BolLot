module.exports = currentMatchToString;

const data = require('./data.json');
const config = require('./config.json');

function currentMatchToString(match, leagueJs, discordClient) {
    console.log(match);
    // participants
    const participants = match['participants'];
    const summonerName = [];
    const summonerId = [];
    const championId = [];
    const team = [];
    const gameType = match['gameType'];
    for (const player of participants) {
        team.push(data['teams'][String(player['teamId'])]);
        championId.push(String(player['championId']));
        summonerName.push(String(player['summonerName']));
        summonerId.push(String(player['summonerId']));
    }
    const promises = championId.map((x) => leagueJs.StaticData.gettingChampionById(x));
    promises.concat(summonerName.map((x) => leagueJs.League.gettingLeagueEntriesForSummonerId(x)));
    Promise.all(promises).then(handlePromises(discordClient, summonerName, team, gameType));
}

function send_string(channel, output_str) {
    console.log(`output_str: ${output_str}\n`);
    channel.send(output_str);
}

function getChannel(discordClient) {
    return discordClient.channels.cache.find((chan) => chan.id == config['channel']);
}

function handlePromises(discordClient, summonerName, team, gameType) {
    return (championLeague) => {
        const champion = championLeague.slice(0, championLeague.length / 2);
        const league = championLeague.slice(championLeague.length / 2);
        let output = `${gameTypeToString(gameType)} game started`;
        for (let i = 0; i < summonerName.length; i++) {
            output += `${team[i]} **${summonerName[i]}** *${champion[i]['name']}*`;
            output += ' | ';
            output += leagueToString(league[i]);
            output += '\n';
        }
        const channel = getChannel(discordClient);
        send_string(channel, output);
    };
}

function gameTypeToString(gameType) {
    return String(gameType);
}

function leagueToString(leagues) {
    let output = '';
    for (let i = 0; i < leagues.length; i++) {
        output += data['rankedQueueType'][leagues[i]['queueType']];
        output += ` ${leagues[i]['tier']} ${leagues[i]['tier']}`;
        output += ` (${leagues[i]['wins']}-${leagues[i]['losses']})`;
    }
    output += '\n';
    return output;
}
