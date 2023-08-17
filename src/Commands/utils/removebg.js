module.exports.execute = async (client, flag, arg, M) => {
    if (!client.config.bgAPI) return M.reply("🟥 *You didn't provide an api key*")
    const content = JSON.stringify(M.quoted)
    const isQuoted = M.type === 'extendedTextMessage' && content.includes('imageMessage')
    const isImage = isQuoted
        ? M.type === 'extendedTextMessage' && content.includes('imageMessage')
        : M.type === 'imageMessage'
    if (!isImage) return M.reply("🟥 *You didn't provide an image*")
    const buffer = isQuoted ? await M.quoted.download() : await M.download()
    const image = await client.utils.removeBG(buffer)

    await client.sendMessage(
        M.from,
        {
            image: image
        },
        {
            quoted: M
        }
    )
}

module.exports.command = {
    name: 'removebg',
    aliases: ['rbg'],
    category: 'utils',
    usage: '[quote the image]',
    exp: 10,
    description: 'Removes background from the image'
}
