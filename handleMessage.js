const config = require('./config.json');
const matchToString = require('./matchToString');
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
                // get the last game
                const last_match = data['matches'][0];
                console.log(last_match['metadata']);
                message.reply(matchToString(last_match));
            },
        );
    });
}
