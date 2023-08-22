const { getStats } = require('../../Library/stats')

module.exports.execute = async (client, flag, arg, M) => {
    let pfp
    try {
        pfp = await client.profilePictureUrl(M.mentions[0] ?? M.sender, 'image')
    } catch {
        pfp =
            'https://w0.peakpx.com/wallpaper/346/996/HD-wallpaper-love-live-sunshine-404-error-love-live-sunshine-anime-girl-anime.jpg'
    }

    const level = (await client.DB.get(`${M.mentions[0] ?? M.sender}_LEVEL`)) || 1
    const { requiredXpToLevelUp, rank } = getStats(level)
    const username = (await client.contact.getContact(M.mentions[0] ?? M.sender, client)).username
    const experience = (await client.exp.get(M.mentions[0] ?? M.sender)) || 0

    M.reply(`
🏷️ *Username: ${username}*
    
🪄 *Experience: ${experience}*
    
🏆 *Level: ${level}*
    
🎡 *Rank: ${rank}*
                
🍥 *RequiredXpToLevelUp: ${requiredXpToLevelUp} exp required*`)
}

module.exports.command = {
    name: 'rank',
    aliases: ['rk'],
    category: 'general',
    usage: '',
    exp: 5,
    description: 'Gives you your rank'
}
