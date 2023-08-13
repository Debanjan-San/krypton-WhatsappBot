const { Sticker } = require('wa-sticker-formatter')

module.exports = {
    name: 'sticker',
    aliases: ['s'],
    category: 'utils',
    exp: 15,
    description: 'sticker [caption/quote message containing media] <pack> | <author>',
    async execute(client, flag, arg, M) {
        flag.forEach((el) => (arg = arg.replace(el, '')))
        if (!M.messageTypes(M.type) && !M.messageTypes(M.quoted.mtype))
            return void M.reply('Caption/Quote an image/video/gif message')
        const pack = arg.split('|')
        const buffer = M.quoted ? await M.quoted.download() : await M.download()
        const sticker = await new Sticker(buffer, {
            pack: pack[1]?.trim() || '👾 Handcrafted for you by',
            author: pack[2]?.trim() || 'Krypton 👾',
            categories: ['🤩', '🎉'],
            quality: 70,
            type:
                flag.includes('--c') || flag.includes('--crop')
                    ? 'crop'
                    : flag.includes('--s') || flag.includes('--stretch')
                    ? 'default'
                    : flag.includes('--circle')
                    ? 'circle'
                    : 'full'
        }).build()
        await client.sendMessage(M.from, { sticker }, { quoted: M })
    }
}
