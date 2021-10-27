# BolLot

## ToDos

- [x] finally learn how to use promises
- [c] explore the LeagueApi docs
- [x] or use LeagueJS which seems overall better : https://www.npmjs.com/package/leaguejs
- [x] define the different projects to build
- [c] figure out how to get all users connected in the Discord channel
- [c] associate them to their league accounts ?
- [x] or just have a lost of tracked accounts, which can be added/removed
    using Discord messages
- [x] figure out how to execute a task on a regular basis
- [x] figure out how to get info on the current game of a player
- [x] define the architecture of the current match(es) tracker
- [x] add track & untrack functions
- [x] modify output message to embed
- [ ] align the text on output message
- [ ] add winrate on the champions played (implies 10 additional requests)
- [x] change `last` command to an actual command

## Projects

### Current match tracker [x]

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

### Last match history [x]

On request with a given player's name, output the last match in their history.

### Win rate on a champion for a given player [ ]

- [ ] get player puiid and recent games
  - `leagueJs.Summoner.gettingById(summonerId)` => `summoner["puiid"]`
  - `leagueJs.Match.gettingListByAccount(puiid)` => 100 games
    - ```javascript
        matches: [
        { metadata: [Object], info: [Object] }, ...}```
  - 