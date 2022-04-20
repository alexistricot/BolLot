import matchToString from './matchToString.js';
import {CommandInteraction, Message} from "discord.js";
import {} from "./tracker.ts";

export default handleCommands

function handleCommands(leagueJs) {
    return async function (interaction: Interaction) {
        // check the interaction
        if (interaction.user.bot) return;
        if (!interaction.isCommand()) return;
        // get the argument
        const summoner = summonerInteraction(interaction);
        // execute the command
        switch (interaction.commandName) {
            case 'last':
                await interaction.reply('`Working...`');
                lastGameBySummonerName(interaction, leagueJs, summoner);
                break;
            case 'track':
                await interaction.reply('`Working...`');
                trackPlayer(interaction, leagueJs, summoner);
                break;
            case 'untrack':
                await interaction.reply('`Working...`');
                untrackPlayer(interaction, leagueJs, summoner);
                break;
            default:
                break;
        }
    };
};

function lastGameBySummonerName(interaction: CommandInteraction, leagueJs, summonerName: string) {
    leagueJs.Summoner.gettingByName(summonerName).then((summ) => {
        leagueJs.Match.gettingListByAccount(summ.puuid, { beginIndex: 0, endIndex: 1 }).then(
            (data) => {
                // get the last game
                const last_match = data['matches'][0];
                console.log(last_match['metadata']);
                const output = matchToString(last_match);
                reply(interaction, output);
            },
        );
    });
}

/**
 * @param  {CommandInteraction} interaction
 * @returns {string} 
 */
function summonerInteraction(interaction: CommandInteraction): string {
    const summoner = interaction.options.data[0].value;
    if (typeof(summoner) === "string") return summoner;
    else return "";
}

/**
 * Reply to an interaction with a message.
 * @param  {CommandInteraction} interaction
 * @param  {Message} message
 * @returns void
 */
function reply(interaction: CommandInteraction, message: Message): void {
    if (interaction.replied) {
        interaction.editReply(message);
    }
    else {
        interaction.reply(message);
    }
    console.log(message);
}
