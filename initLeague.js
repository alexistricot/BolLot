const LeagueJS = require('leaguejs/lib/LeagueJS');
const dotenv = require('dotenv');

dotenv.config();

const leagueJs = new LeagueJS(process.env.RIOT_API_KEY, {
    PLATFORM_ID: process.env.LEAGUE_API_PLATFORM_ID,
});

module.exports = leagueJs;
