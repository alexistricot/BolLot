const config = require('./config.json');
const prefix = config['prefix'];

module.exports = function(leagueJs) {
    return function(message) {
        // get the command name and the arguments
        if (!message.content.startsWith(prefix) || message.author.bot) return;
        // check if the command corresponds to one of the aliases
        const args = message.content.slice(prefix.length).trim().split(' ');
        const commandName = args.shift().toLowerCase();
        switch (commandName) {
        case 'last':
            lastGameBySummonerName(message, leagueJs, args[0]);
            break;
        default:
            break;
        }
    };
};

function lastGameBySummonerName(message, leagueJs, summonerName) {
    leagueJs.Summoner.gettingByName(summonerName).then((summ) => {
        leagueJs.Match.gettingListByAccount(summ.puuid, { beginIndex: 0, endIndex: 1 }).then(
            (data) => {
                const last_match = data['matches'][0];
                console.log(last_match['metadata']);
                console.log(last_match['info']);
                const participants = last_match['info']['participants'];
                let output = '';
                for (const player of participants) {
                    const team = config['teams'][String(player['teamId'])];
                    output += `${team} ${player['summonerName']} ${player['championName']} `;
                    output += `${player['kills']}/${player['deaths']}/${player['assists']}`;
                    output += '\n';
                }
                message.reply(output);
            },
        );
    });
}
