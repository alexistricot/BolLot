const handleCommands = require('./handleCommands');
const listenForGames = require('./listenForGames');
const initTracker = require('./initTracker');

// Riot API interactions
const leagueJs = require('./initLeague');

// load a new discord client and declare commands
const client = require('./initDiscord');

// initialize the tracker
initTracker();

// message handling
client.on('interactionCreate', handleCommands(leagueJs));

// listen for starting games
listenForGames(leagueJs, client);
