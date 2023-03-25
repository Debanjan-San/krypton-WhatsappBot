const { Sticker, StickerTypes } = require('wa-sticker-formatter')

module.exports = {
    name: 'sticker',
    aliases: ['s'],
    category: 'utils',
    description: 'sticker [caption/quote message containing media] [options] | <pack> | <author>',
    async execute(client, arg, M) {
        const content = JSON.stringify(M.quoted)
        const isMedia = M.type === 'imageMessage' || M.type === 'videoMessage'
        const isQuoted =
            (M.type === 'extendedTextMessage' && content.includes('imageMessage')) ||
            (M.type === 'extendedTextMessage' && content.includes('videoMessage'))

        if (isMedia || isQuoted) {
            const context = arg.split(' ')
            const pack = context.shift().split('|')
            const flags = context;
            const buffer = isQuoted ? await M.quoted.download() : await M.download()
            const sticker = new Sticker(buffer, {
                pack: pack[0] ? pack[0].trim() : '👾 Handcrafted for you by',
                author: pack[1] ? pack[1].trim() : `Krypton 👾`,
                quality: 50,
                type:
                    flags.includes('--c') || flags.includes('--crop') || flags.includes('--cropped')
                        ? 'crop'
                        : flags.includes('--s') || flags.includes('--stretch') || flags.includes('--stretched')
                        ? 'default'
                        : flags.includes('--circle') ||
                          flags.includes('--r') | flags.includes('--round') ||
                          flags.includes('--rounded')
                        ? 'circle'
                        : 'full',
            })

            await client.sendMessage(
                M.from,
                {
                    sticker: await sticker.build(),
                },
                {
                    quoted: M,
                }
            )
        } else return M.reply('Please quote or caption the image/video')
        // console.log(buffer)
    },
}
