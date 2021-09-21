const dotenv = require('dotenv');
const { Client, Intents } = require('discord.js');
const handleMessage = require('./handleMessage');

// load the bot token from .env
dotenv.config();

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

client.on('messageCreate', handleMessage);

// login
client.login(process.env.DISCORD_TOKEN);
