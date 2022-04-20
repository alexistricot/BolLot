import {LeagueJS} from 'leaguejs/lib/LeagueJS.js';
import * as dotenv from 'dotenv';

dotenv.config({path: "../.env"});

const leagueJs = new LeagueJS(process.env.RIOT_API_KEY, {
    PLATFORM_ID: process.env.LEAGUE_API_PLATFORM_ID,
});

export default leagueJs;
