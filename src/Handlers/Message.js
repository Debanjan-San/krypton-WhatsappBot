const { getBinaryNodeChild } = require('@adiwajshing/baileys')
const { serialize } = require('../lib/WAclient')
const { response } = require('express')
const { getStats, ranks } = require('../lib/stats')
const chalk = require('chalk')
const emojiStrip = require('emoji-strip')
const axios = require('axios')

module.exports = MessageHandler = async (messages, client) => {
    try {
        if (messages.type !== 'notify') return
        let M = serialize(JSON.parse(JSON.stringify(messages.messages[0])), client)
        if (!M.message) return
        if (M.key && M.key.remoteJid === 'status@broadcast') return
        if (M.type === 'protocolMessage' || M.type === 'senderKeyDistributionMessage' || !M.type || M.type === '')
            return

        const { isGroup, sender, from, body } = M
        const gcMeta = isGroup ? await client.groupMetadata(from) : ''
        const gcName = isGroup ? gcMeta.subject : ''
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(client.prefix)
        const cmdName = body.slice(client.prefix.length).trim().split(/ +/).shift().toLowerCase()
        const arg = body.replace(cmdName, '').slice(1).trim()
        const groupMembers = gcMeta?.participants || []
        const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id)
        const ActivateMod = (await client.DB.get('mod')) || []
        const ActivateChatBot = (await client.DB.get('chatbot')) || []
        const banned = (await client.DB.get('banned')) || []

        // Antilink system
        if (
            isGroup &&
            ActivateMod.includes(from) &&
            groupAdmins.includes(client.user.id.split(':')[0] + '@s.whatsapp.net') &&
            body
        ) {
            const groupCodeRegex = body.match(/chat.whatsapp.com\/(?:invite\/)?([\w\d]*)/)
            if (groupCodeRegex && groupCodeRegex.length === 2 && !groupAdmins.includes(sender)) {
                const groupCode = groupCodeRegex[1]
                const groupNow = await client.groupInviteCode(from)

                if (groupCode !== groupNow) {
                    await client.sendMessage(from, { delete: M.key })
                    return await client.groupParticipantsUpdate(from, [sender], 'remove')
                    M.reply('Successfully removed an intruder!!!!')
                }
            }
        }

        //Banned system
        if (banned.includes(sender)) return M.reply('You are banned from using the bot')

        //console.log(body)
        // AI chatting using
        if (M.quoted?.participant) M.mentions.push(M.quoted.participant)
        if (
            M.mentions.includes(client.user.id.split(':')[0] + '@s.whatsapp.net') &&
            !isCmd &&
            isGroup &&
            ActivateChatBot.includes(from)
        ) {
            const text = await axios.get(`https://api.simsimi.net/v2/?text=${emojiStrip(body)}&lc=en&cf=true`)
            M.reply(body == 'hi' ? `Hey ${M.pushName} whats up?` : text.data.messages[0].text)
        }

        // Logging Message
        client.log(
            `${chalk[isCmd ? 'red' : 'green'](`${isCmd ? '~EXEC' : '~RECV'}`)} ${
                isCmd ? `${client.prefix}${cmdName}` : 'Message'
            } ${chalk.white('from')} ${M.pushName} ${chalk.white('in')} ${isGroup ? gcName : 'DM'} ${chalk.white(
                `args: [${chalk.blue(args.length)}]`
            )}`,
            'yellow'
        )

        if (!isGroup) return
        if (!isCmd) return
        const command =
            client.cmd.get(cmdName) || client.cmd.find((cmd) => cmd.aliases && cmd.aliases.includes(cmdName))

        if (!command) return M.reply('No such command found! BAKA')
        if (!groupAdmins.includes(sender) && command.category == 'moderation')
            return M.reply('This command can only be used by group or community admins')
        if (!groupAdmins.includes(client.user.id.split(':')[0] + '@s.whatsapp.net') && command.category == 'moderation')
            return M.reply('This command can only be used when bot is admin')
        if (!client.mods.includes(sender.split('@')[0]) && command.category == 'dev')
            return M.reply('This command only can be accessed by the mods')
        command.execute(client, arg, M)

        //Will add exp according to the commands
        await client.exp.add(sender, command.exp)

        //Level up
        const level = (await client.DB.get(`${sender}_LEVEL`)) || 0
        const experience = await client.exp.get(sender)
        const { requiredXpToLevelUp } = getStats(level)
        if (requiredXpToLevelUp > experience) return null
        await client.DB.add(`${sender}_LEVEL`, 1)
        client.sendMessage(
            from,
            {
                video: {
                    url: 'https://media.tenor.com/msfmevhmlDAAAAPo/anime-chibi.mp4'
                },
                caption: `\n\n\nCongratulations you leveled up from *${level} ---> ${level + 1}* 🎊\n\n\n`,
                gifPlayback: true
            },
            {
                quoted: M
            }
        )
    } catch (err) {
        client.log(err, 'red')
    }
}
