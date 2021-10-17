const { Client, Intents } = require('discord.js');
const dotenv = require('dotenv');
const config = require('./config.json');
const { SlashCommandBuilder, SlashCommandStringOption } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

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
    console.log('Discord client ready.');
});

// login
client.login(process.env.DISCORD_TOKEN);

// define summoner option for commands
const summonerOption = new SlashCommandStringOption()
    .setName('summoner')
    .setDescription('The summoner to look for.')
    .setRequired(true);

// set up the commands
const commands = [
    new SlashCommandBuilder()
        .setName('last')
        .setDescription('Print the last game of a EUW summoner.')
        .addStringOption(summonerOption),
    new SlashCommandBuilder()
        .setName('track')
        .setDescription('Track a summoner (print info on game start).')
        .addStringOption(summonerOption),
    new SlashCommandBuilder()
        .setName('untrack')
        .setDescription("Untrack a summoner (don't print info on game start).")
        .addStringOption(summonerOption),
].map((command) => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN);
rest.put(Routes.applicationGuildCommands(config['clientId'], config['guild']), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);

module.exports = client;
