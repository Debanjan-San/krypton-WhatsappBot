const { getStats } = require('../lib/stats')
const cx = require('canvacord')

module.exports = {
    name: 'rank',
    aliases: ['rk'],
    category: 'general',
    exp: 5,
    description: 'Gives you your rank',
    async execute(client, arg, M) {
        const user = M.sender

        let pfp
        try {
            pfp = await client.profilePictureUrl(user, 'image')
        } catch {
            pfp =
                'https://w0.peakpx.com/wallpaper/346/996/HD-wallpaper-love-live-sunshine-404-error-love-live-sunshine-anime-girl-anime.jpg'
        }

        const level = (await client.DB.get(`${user}_LEVEL`)) || 1
        const { requiredXpToLevelUp, rank } = getStats(level)
        const username = (await client.contact.getContact(user, client)).username
        const experience = (await client.exp.get(user)) || 0

        const card = await new cx.Rank()
            .setAvatar(pfp)
            .setLevel(level, 'LEVEL', true)
            .setCurrentXP(experience, '#db190b')
            .setRequiredXP(requiredXpToLevelUp, '#db190b')
            .setProgressBar('#db190b')
            .setDiscriminator(user.substring(3, 7), '#FFFFFF')
            .setCustomStatusColor('#db190b')
            .setLevelColor('#db190b', '#FFFFFF')
            .setOverlay('', '', false)
            .setUsername(username, '#FFFFFF')
            .setBackground(
                'IMAGE',
                'https://c4.wallpaperflare.com/wallpaper/758/235/686/pewdiepie-felix-youtuber-hd-wallpaper-preview.jpg'
            )
            .setRank(1, '', false)
            .renderEmojis(true)
            .build({ fontX: 'arial', fontY: 'arial' })

        //user.substring(3, 7)
        client.sendMessage(
            M.from,
            {
                image: card,
                caption: `*Your Exp[${experience}] and Level[${level}]*`
            },
            {
                quoted: M
            }
        )
    }
}
//M.quoted.mtype === 'imageMessage',
