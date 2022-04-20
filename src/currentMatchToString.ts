export default currentMatchToString;

import {data, getTeamDisplay, getQueueDisplay } from './config/data';
import * as config from './config/config.json';
import fs = require('fs');
import { Client, MessageEmbed, TextChannel } from 'discord.js';
import getChampionEmoji from './champion-emoji';

// !!! data changed strucure

function currentMatchToString(match, leagueJs, discordClient: Client) {
    console.log(match);
    // participants
    const participants = match['participants'];
    const summonerName = [];
    const summonerId = [];
    const championId = [];
    const team = [];
    const gameType = match['gameType'];
    for (const player of participants) {
        team.push(getTeamDisplay(data, player['teamId']));
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

async function sendString(channel: TextChannel, title: string, content, summonerName: string[]) {
    const embed = new MessageEmbed();
    embed.setTitle(title);
    const tracker = JSON.parse(fs.readFileSync('./tracker.json').toString());
    for (let i = 0; i < content.length; i++) {
        const isTracked = Object.keys(tracker.players).includes(summonerName[i].toLowerCase());
        const summNameOut = isTracked ? `:smiling_imp: **${summonerName[i]}**` : summonerName[i];
        embed.addField(summNameOut, content[i]);
    }
    console.log(embed);
    await channel.send({ embeds: [embed] });
    return;
}

function getChannel(discordClient: Client) : TextChannel {
    var channel = discordClient.channels.cache.find((chan) => chan.id == config['channel']);
    if (channel instanceof TextChannel) return channel
    else throw TypeError("Configured default channel is not a TextChannel.")
}

function handlePromises(discordClient: Client, summonerName: string[], team: string[], gameType: string[]) {
    return async (championLeague) => {
        const champion = championLeague.slice(0, championLeague.length / 2);
        const league = championLeague.slice(championLeague.length / 2);
        const title = `${String(gameType)}`;
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
            try {
                e.delete();
            }
            finally {
            }
        }
    };
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

function bold(str: string) {
    return '**' + str + '**';
}
