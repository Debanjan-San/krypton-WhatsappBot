const { Sticker, StickerTypes } = require('wa-sticker-formatter')

module.exports = {
    name: 'streal',
    aliases: ['take'],
    category: 'utils',
    exp: 10,
    description: 'steal [quote message containing sticker] <pack> | <author>',
    async execute(client, arg, M) {
        const content = JSON.stringify(M.quoted)
        const isQuotedSticker = M.type === 'extendedTextMessage' && content.includes('stickerMessage')

        if (isQuotedSticker) {
            const pack = arg.split('|')
            const buffer = await M.quoted.download()
            const sticker = new Sticker(buffer, {
                pack: pack[0] ? pack[0].trim() : '👾 Handcrafted for you by',
                author: pack[1] ? pack[1].trim() : `Krypton 👾`,
                quality: 50
            })

            await client.sendMessage(
                M.from,
                {
                    sticker: await sticker.build()
                },
                {
                    quoted: M
                }
            )
        } else return M.reply('Please quote or caption the image/video')
        // console.log(buffer)
    }
}
