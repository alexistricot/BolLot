module.exports = currentMatchToString;

const data = require('./data.json');
const config = require('./config.json');
const fs = require('fs');
const Discord = require('discord.js');
const getChampionEmoji = require('./champion-emoji');

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

async function sendString(channel, title, content, summonerName) {
    const embed = new Discord.MessageEmbed();
    embed.setTitle(title);
    const tracker = JSON.parse(fs.readFileSync('./tracker.json'));
    for (let i = 0; i < content.length; i++) {
        const isTracked = Object.keys(tracker.players).includes(summonerName[i].toLowerCase());
        const summNameOut = isTracked ? `**${summonerName[i]}**` : summonerName[i];
        embed.addField(summNameOut, content[i]);
    }
    console.log(embed);
    await channel.send({ embeds: [embed] });
}

function getChannel(discordClient) {
    return discordClient.channels.cache.find((chan) => chan.id == config['channel']);
}

function handlePromises(discordClient, summonerName, team, gameType) {
    return async (championLeague) => {
        const champion = championLeague.slice(0, championLeague.length / 2);
        const league = championLeague.slice(championLeague.length / 2);
        const title = `${gameTypeToString(gameType)}`;
        const list_output = [];
        // list emojis so we can delete them later
        const emojis = [];
        for (let i = 0; i < summonerName.length; i++) {
            let output = '';
            const championEmoji = await getChampionEmoji(discordClient, champion[i]);
            emojis.push(championEmoji);
            output += `${team[i]} ${championEmoji.toString()} *${champion[i]['name']}*`;
            output += ' | ';
            output += leagueToString(league[i]);
            list_output.push(output);
        }
        const channel = getChannel(discordClient);
        await sendString(channel, title, list_output, summonerName);
        // delete emojis to make room
        for (const e of emojis) {
            e.delete();
        }
    };
}

function gameTypeToString(gameType) {
    return String(gameType);
}

function leagueToString(leagues) {
    let output = '';
    for (let i = 0; i < leagues.length; i++) {
        if (Object.keys(data['rankedQueueType']).includes(leagues[i]['queueType'])) {
            output += bold(data['rankedQueueType'][leagues[i]['queueType']]);
            output += ` ${leagues[i]['tier']} ${leagues[i]['rank']}`;
            output += ` *(${leagues[i]['wins']}-${leagues[i]['losses']})*`;
            output += ' | ';
        }
    }
    output += '\n';
    return output;
}

function bold(str) {
    return '**' + str + '**';
}
