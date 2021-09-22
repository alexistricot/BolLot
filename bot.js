const dotenv = require('dotenv');
const { Client, Intents } = require('discord.js');
const handleMessage = require('./handleMessage');
const LeagueJS = require('leaguejs/lib/LeagueJS');

// load the bot token from .env
dotenv.config();

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
client.on('messageCreate', handleMessage);

// Riot API interactions
const leagueJs = new LeagueJS(process.env.RIOT_API_KEY, {
    PLATFORM_ID: process.env.LEAGUE_API_PLATFORM_ID,
});

leagueJs.Summoner.gettingByName('Hgis').then((summ) => {
    const hgis = summ;
    console.log('\n Hgis : \n');
    console.log(hgis);
    leagueJs.Match.gettingListByAccount(hgis?.accountId).then((data) => {
        const last_match = data['matches'][0];
        console.log('\n last match :\n');
        console.log(last_match);
        leagueJs.StaticData.gettingChampionById(last_match['champion']).then((champ) => {
            console.log('\n champion : \n');
            console.log(champ);
        });
    });
});
