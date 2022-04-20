# Utilized functions

Used function from `leagueJS` to transform to reimplement and type using
`riot-api-typedef`.

## Summoner

- `Summoner.gettingByName(summoner: gettingByName): SummonerDTO`
  - https://developer.riotgames.com/apis#summoner-v4/GET_getBySummonerName
  

## Match

- `Match.gettingListByAccount(puuid: string, beginIndex: number, endIndex: number): List[MatchDTO]`
  - https://developer.riotgames.com/apis#match-v5/GET_getMatchIdsByPUUID 
  - not sure about return type, listed as `List[string]`

## Spectator

- `Spectator.gettingActiveGame(id: string): CurrentGameInfo`
  - https://developer.riotgames.com/apis#spectator-v4/GET_getCurrentGameInfoBySummoner
  - not sure which id this is (*encrypted summoner id*)

## League

- `League.gettingLeagueEntriesForSummonerId(id: string): LeagueEntryDTO`
  - https://developer.riotgames.com/apis#league-v4/GET_getLeagueEntriesForSummoner
  - again *encrypted summoner id*

## StaticData

- `StaticData.gettingChampionById(id: string): ChampionDTO`
  - see code in `StaticDataDDragonCompat.js`
  - typed in JSDoc -> easy to reproduce ?
  - 