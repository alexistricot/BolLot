const { Client, Intents } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

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

module.exports = client;
