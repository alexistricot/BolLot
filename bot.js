const handleMessage = require('./handleMessage');
const listenForGames = require('./listenForGames');

// Riot API interactions
const leagueJs = require('./initLeague');

// load a new client
const client = require('./initDiscord');

// message handling
client.on('messageCreate', handleMessage(leagueJs));

// listen for starting games
listenForGames(leagueJs, client);
