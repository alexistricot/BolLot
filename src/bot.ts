import handleCommands from "./handleCommands";
import listenForGames  from './listenForGames';
import './tracker';

// Riot API interactions
import leagueJs  from './initLeague';

// load a new discord client and declare commands
import client  from './initDiscord';

// message handling
client.on('interactionCreate', handleCommands(leagueJs));

// listen for starting games
listenForGames(leagueJs, client);
