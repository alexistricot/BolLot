# BolLot

## ToDos

- [ ] finally learn how to use promises
- [c] explore the LeagueApi docs
- [ ] or use LeagueJS which seems overall better : https://www.npmjs.com/package/leaguejs
- [ ] define the different projects to build
- [ ] figure out how to get all users connected in the Discord channel
- [ ] associate them to their league accounts ?
- [ ] or just have a lost of tracked accounts, which can be added/removed
    using Discord messages
- [ ] figure out how to execute a task on a regular basis
- [ ] figure out how to get info on the current game of a player
- [ ] define the architecture of the current match(es) tracker

## Architecture

### Current match tracker

The idea is to have a list of players followed (either the connected players or
a list of players managed from the Discord channel) and output the rank and
champions win rate of all players in the game when one (or more) of the players
enter a game.

This requires:

- a way to track a bunch of players by name or puuid
- a way to execute a task on a regular basis (request the current game)
- a way to get the current game
- a way to get the passed games of a player
- a way to print a bunch of info cleanly on Discord (embed msgs ?)

### Last match history

On request with a given player's name, output the last amtch in their history.