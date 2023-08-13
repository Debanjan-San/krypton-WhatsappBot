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
    let msg = message[type]
    if (type === 'buttonsMessage' || type === 'viewOnceMessageV2') {
        if (type === 'viewOnceMessageV2') {
            msg = message.viewOnceMessageV2?.message
            type = Object.keys(msg || {})[0]
        } else type = Object.keys(msg || {})[1]
        msg = msg[type]
    }
    const stream = await downloadContentFromMessage(msg, type.replace('Message', ''))
    let buffer = Buffer.from([])
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk])
    }
    return buffer
}

/**
 * parse message for easy use
 * @param {proto.IWebMessageInfo} msg
 * @param client
 */
function serialize(msg, client) {
    if (msg.key) {
        msg.id = msg.key.id
        msg.isSelf = msg.key.fromMe
        msg.from = decodeJid(msg.key.remoteJid)
        msg.isGroup = msg.from.endsWith('@g.us')
        msg.sender = msg.isGroup ? decodeJid(msg.key.participant) : msg.isSelf ? decodeJid(client.user.id) : msg.from
    }
    if (msg.message) {
        msg.type = getContentType(msg.message)
        if (msg.type === 'ephemeralMessage') {
            msg.message = msg.message[msg.type].message
            const tipe = Object.keys(msg.message)[0]
            msg.type = tipe
            if (tipe === 'viewOnceMessageV2') {
                msg.message = msg.message[msg.type].message
                msg.type = getContentType(msg.message)
            }
        }
        if (msg.type === 'viewOnceMessageV2') {
            msg.message = msg.message[msg.type].message
            msg.type = getContentType(msg.message)
        }
        msg.messageTypes = (type) => ['videoMessage', 'imageMessage'].includes(type)
        msg.mentions = []
        const array = msg?.message?.[msg.type]?.contextInfo?.mentionedJid || []
        msg.mentions.push(...array.filter(Boolean))
        try {
            const quoted = msg.message[msg.type]?.contextInfo
            if (quoted.quotedMessage['ephemeralMessage']) {
                const tipe = Object.keys(quoted.quotedMessage.ephemeralMessage.message)[0]
                if (tipe === 'viewOnceMessageV2') {
                    msg.quoted = {
                        type: 'view_once',
                        stanzaId: quoted.stanzaId,
                        participant: decodeJid(quoted.participant),
                        message: quoted.quotedMessage.ephemeralMessage.message.viewOnceMessage.message
                    }
                } else {
                    msg.quoted = {
                        type: 'ephemeral',
                        stanzaId: quoted.stanzaId,
                        participant: decodeJid(quoted.participant),
                        message: quoted.quotedMessage.ephemeralMessage.message
                    }
                }
            } else if (quoted.quotedMessage['viewOnceMessageV2']) {
                msg.quoted = {
                    type: 'view_once',
                    stanzaId: quoted.stanzaId,
                    participant: decodeJid(quoted.participant),
                    message: quoted.quotedMessage.viewOnceMessage.message
                }
            } else {
                msg.quoted = {
                    type: 'normal',
                    stanzaId: quoted.stanzaId,
                    participant: decodeJid(quoted.participant),
                    message: quoted.quotedMessage
                }
            }
            msg.quoted.isSelf = msg.quoted.participant === decodeJid(client.user.id)
            msg.quoted.mtype = Object.keys(msg.quoted.message).filter(
                (v) => v.includes('Message') || v.includes('conversation')
            )[0]
            msg.quoted.text =
                msg.quoted.message[msg.quoted.mtype]?.text ||
                msg.quoted.message[msg.quoted.mtype]?.description ||
                msg.quoted.message[msg.quoted.mtype]?.caption ||
                msg.quoted.message[msg.quoted.mtype]?.hydratedTemplate?.hydratedContentText ||
                msg.quoted.message[msg.quoted.mtype] ||
                ''
            msg.quoted.key = {
                id: msg.quoted.stanzaId,
                fromMe: msg.quoted.isSelf,
                remoteJid: msg.from
            }
            msg.quoted.download = () => downloadMedia(msg.quoted.message)
        } catch {
            msg.quoted = null
        }
        msg.body =
            msg.message?.conversation ||
            msg.message?.[msg.type]?.text ||
            msg.message?.[msg.type]?.caption ||
            (msg.type === 'listResponseMessage' && msg.message?.[msg.type]?.singleSelectReply?.selectedRowId) ||
            (msg.type === 'buttonsResponseMessage' && msg.message?.[msg.type]?.selectedButtonId) ||
            (msg.type === 'templateButtonReplyMessage' && msg.message?.[msg.type]?.selectedId) ||
            ''
        msg.reply = (text) =>
            client.sendMessage(
                msg.from,
                {
                    text
                },
                {
                    quoted: msg
                }
            )
        msg.download = () => downloadMedia(msg.message)
        msg.numbers = client.utils.extractNumbers(msg.body)
        msg.urls = client.utils.extractUrls(msg.body)
    }
    return msg
}

module.exports = {
    serialize,
    decodeJid
}
