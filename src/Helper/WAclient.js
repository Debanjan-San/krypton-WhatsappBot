const { proto, getContentType, jidDecode, downloadContentFromMessage } = require('@whiskeysockets/baileys')

const decodeJid = (jid) => {
    const { user, server } = jidDecode(jid) || {}
    return user && server ? `${user}@${server}`.trim() : jid
}

/**
 * @param {proto.IMessage} message
 * @returns {Promise<Buffer>}
 */

const downloadMedia = async (message) => {
    /**@type {keyof proto.IMessage} */
    let type = Object.keys(message)[0]
    let M = message[type]
    if (type === 'buttonsMessage' || type === 'viewOnceMessageV2') {
        if (type === 'viewOnceMessageV2') {
            M = message.viewOnceMessageV2?.message
            type = Object.keys(M || {})[0]
        } else type = Object.keys(M || {})[1]
        M = M[type]
    }
    const stream = await downloadContentFromMessage(M, type.replace('Message', ''))
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }
    return buffer
}

/**
 * parse message for easy use
 * @param {proto.IWebMessageInfo} M
 * @param client
 */
function serialize(M, client) {
    if (M.key) {
        M.id = M.key.id
        M.isSelf = M.key.fromMe
        M.from = decodeJid(M.key.remoteJid)
        M.isGroup = M.from.endsWith('@g.us')
        M.sender = M.isGroup ? decodeJid(M.key.participant) : M.isSelf ? decodeJid(client.user.id) : M.from
    }
    if (M.message) {
        M.type = getContentType(M.message)
        if (M.type === 'ephemeralMessage') {
            M.message = M.message[M.type].message
            const tipe = Object.keys(M.message)[0]
            M.type = tipe
            if (tipe === 'viewOnceMessageV2') {
                M.message = M.message[M.type].message
                M.type = getContentType(M.message)
            }
        }
        if (M.type === 'viewOnceMessageV2') {
            M.message = M.message[M.type].message
            M.type = getContentType(M.message)
        }
        M.messageTypes = (type) => ['videoMessage', 'imageMessage'].includes(type)
        try {
            const quoted = M.message[M.type]?.contextInfo
            if (quoted.quotedMessage['ephemeralMessage']) {
                const tipe = Object.keys(quoted.quotedMessage.ephemeralMessage.message)[0]
                if (tipe === 'viewOnceMessageV2') {
                    M.quoted = {
                        type: 'view_once',
                        stanzaId: quoted.stanzaId,
                        participant: decodeJid(quoted.participant),
                        message: quoted.quotedMessage.ephemeralMessage.message.viewOnceMessage.message
                    }
                } else {
                    M.quoted = {
                        type: 'ephemeral',
                        stanzaId: quoted.stanzaId,
                        participant: decodeJid(quoted.participant),
                        message: quoted.quotedMessage.ephemeralMessage.message
                    }
                }
            } else if (quoted.quotedMessage['viewOnceMessageV2']) {
                M.quoted = {
                    type: 'view_once',
                    stanzaId: quoted.stanzaId,
                    participant: decodeJid(quoted.participant),
                    message: quoted.quotedMessage.viewOnceMessage.message
                }
            } else {
                M.quoted = {
                    type: 'normal',
                    stanzaId: quoted.stanzaId,
                    participant: decodeJid(quoted.participant),
                    message: quoted.quotedMessage
                }
            }
            M.quoted.isSelf = M.quoted.participant === decodeJid(client.user.id)
            M.quoted.mtype = Object.keys(M.quoted.message).filter(
                (v) => v.includes('Message') || v.includes('conversation')
            )[0]
            M.quoted.text =
                M.quoted.message[M.quoted.mtype]?.text ||
                M.quoted.message[M.quoted.mtype]?.description ||
                M.quoted.message[M.quoted.mtype]?.caption ||
                M.quoted.message[M.quoted.mtype]?.hydratedTemplate?.hydratedContentText ||
                M.quoted.message[M.quoted.mtype] ||
                ''
            M.quoted.key = {
                id: M.quoted.stanzaId,
                fromMe: M.quoted.isSelf,
                remoteJid: M.from
            }
            M.quoted.download = () => downloadMedia(M.quoted.message)
        } catch {
            M.quoted = null
        }
        M.body =
            M.message?.conversation ||
            M.message?.[M.type]?.text ||
            M.message?.[M.type]?.caption ||
            (M.type === 'listResponseMessage' && M.message?.[M.type]?.singleSelectReply?.selectedRowId) ||
            (M.type === 'buttonsResponseMessage' && M.message?.[M.type]?.selectedButtonId) ||
            (M.type === 'templateButtonReplyMessage' && M.message?.[M.type]?.selectedId) ||
            ''
        M.reply = (text) =>
            client.sendMessage(
                M.from,
                {
                    text
                },
                {
                    quoted: M
                }
            )
        M.mentions = []
        if (M.quoted?.participant) M.mentions.push(M.quoted.participant)
        const array = M?.message?.[M.type]?.contextInfo?.mentionedJid || []
        M.mentions.push(...array.filter(Boolean))
        M.download = () => downloadMedia(M.message)
        M.numbers = client.utils.extractNumbers(M.body)
        M.urls = client.utils.extractUrls(M.body)
    }
    return M
}

module.exports = {
    serialize,
    decodeJid
}
