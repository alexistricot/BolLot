const config = require('./config.json');
const requestPromise = require('request-promise');

module.exports = getChampionEmoji;

uri = 'http://ddragon.leagueoflegends.com/cdn/12.2.1/img/champion/';

async function getChampionEmoji(client, champion) {
    // build the emoji name for this champion
    const emojiName = getChampionEmojiName(champion.name);
    // get the guild
    const guild = client.guilds.cache.find((g) => g.id == config['guild']);
    // get the emoji for this champion (if it exists)
    let emoji = guild.emojis.cache.find((e) => e.name == emojiName);
    if (~emoji) {
        emoji = await createEmoji(guild, champion);
    }
    return emoji;
}

function getChampionEmojiName(championName) {
    return championName
        .toLowerCase()
        .replace(' ', '')
        .replace("'", '')
        .replace('.', '')
        .replace('&', '');
}

function getChampionUrl(champion) {
    return uri + champion.image.full;
}

async function createEmoji(guild, champion) {
    const imageUrl = getChampionUrl(champion);
    const emojiName = getChampionEmojiName(champion.name);
    await guild.emojis.create(imageUrl, emojiName);
    return guild.emojis.cache.find((e) => e.name == emojiName);
}
