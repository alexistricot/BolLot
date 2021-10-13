module.exports = currentMatchToString;

const data = require('./data.json');
const config = require('./config.json');
const Discord = require('discord.js');

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
    let promises = championId.map((x) => leagueJs.StaticData.gettingChampionById(x));
    promises = promises.concat(
        summonerId.map((x) => leagueJs.League.gettingLeagueEntriesForSummonerId(x)),
    );
    Promise.all(promises).then(handlePromises(discordClient, summonerName, team, gameType));
}

function send_string(channel, title, content, summonerName) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(title);
    for (let i = 0; i < content.length; i++) {
        embed.addField(summonerName[i], content[i]);
    }
    console.log(embed);
    channel.send({ embeds: [embed] });
}

function getChannel(discordClient) {
    return discordClient.channels.cache.find((chan) => chan.id == config['channel']);
}

function handlePromises(discordClient, summonerName, team, gameType) {
    return (championLeague) => {
        const champion = championLeague.slice(0, championLeague.length / 2);
        const league = championLeague.slice(championLeague.length / 2);
        const title = `${gameTypeToString(gameType)}`;
        const list_output = [];
        for (let i = 0; i < summonerName.length; i++) {
            let output = '';
            output += `${team[i]} *${champion[i]['name']}*`;
            output += ' | ';
            output += leagueToString(league[i]);
            list_output.push(output);
        }
        const channel = getChannel(discordClient);
        send_string(channel, title, list_output, summonerName);
    };
}

function gameTypeToString(gameType) {
    return String(gameType);
}

function leagueToString(leagues) {
    let output = '';
    for (let i = 0; i < leagues.length; i++) {
        output += bold(data['rankedQueueType'][leagues[i]['queueType']]);
        output += ` ${leagues[i]['tier']} ${leagues[i]['rank']}`;
        output += ` *(${leagues[i]['wins']}-${leagues[i]['losses']})*`;
        output += ' | ';
    }
    output += '\n';
    return output;
}

function bold(str) {
    return '**' + str + '**';
}
