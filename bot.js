const dotenv = require('dotenv');
const { Client, Intents } = require('discord.js');
const handleMessage = require('./handleMessage');
const LeagueJS = require('leaguejs/lib/LeagueJS');

// load the environment
dotenv.config();

// Riot API interactions
const leagueJs = new LeagueJS(process.env.RIOT_API_KEY, {
    PLATFORM_ID: process.env.LEAGUE_API_PLATFORM_ID,
});

// Discord bot interactions

// load a new client
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});
// print when ready
client.once('ready', () => {
    console.log('Ready!');
});
// login
client.login(process.env.DISCORD_TOKEN);
// message handling
client.on('messageCreate', handleMessage(leagueJs));

// function comparefunc(x, y) {
//     // sort games from most recent to oldest
//     if (Number(x['timestamp']) > Number(y['timestamp'])) return -1;
//     if (Number(x['timestamp']) > Number(y['timestamp'])) return 1;
//     return 0;
// }
