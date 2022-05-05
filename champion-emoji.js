const config = require('./config.json');
const requestPromise = require('request-promise');

module.exports = { getChampionEmoji, removeEmojis };

uri = 'http://ddragon.leagueoflegends.com/cdn/12.7.1/img/champion/';

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
        .replaceAll(' ', '')
        .replaceAll("'", '')
        .replaceAll('.', '')
        .replaceAll('&', '');
}

function getChampionUrl(champion) {
    console.log(`champion image: ${JSON.stringify(champion.image)}`);
    return `http://ddragon.leagueoflegends.com/cdn/${champion.version}/img/champion/${champion.image.full}`;
}

async function createEmoji(guild, champion) {
    const imageUrl = getChampionUrl(champion);
    const emojiName = getChampionEmojiName(champion.name);
    console?.log(`creating emoji ${emojiName}`);
    console?.log(`image url: ${imageUrl}`);
    await guild.emojis.create(imageUrl, emojiName);
    return guild.emojis.cache.find((e) => e.name == emojiName);
}

function removeEmojis(guild) {
    return () => {
        guild.emojis.fetch().then((emojis) => {
            for (const emoji of emojis) {
                if (emoji.author.id === guild.client.user.id) {
                    emoji.delete().then(console.log);
                }
            }
        });
    };
}
