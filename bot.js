const handleCommands = require('./handleCommands');
const listenForGames = require('./listenForGames');

// Riot API interactions
const leagueJs = require('./initLeague');

// load a new client
const client = require('./initDiscord');

// message handling
client.on('interactionCreate', handleCommands(leagueJs));

// listen for starting games
listenForGames(leagueJs, client);
