const { serialize } = require('../Helper/WAclient')
const { getStats } = require('../Library/stats')
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
        const isCmd = body.startsWith(client.config.prefix)
        const [cmdName, ...args] = body.replace(client.config.prefix, '').split(' ')
        const arg = args.filter((x) => !x.startsWith('--')).join(' ')
        const flag = args.filter((arg) => arg.startsWith('--'))
        const groupMembers = gcMeta?.participants || []
        const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id)
        const ActivateMod = (await client.DB.get('mod')) || []
        const ActivateChatBot = (await client.DB.get('chatbot')) || []
        const banned = (await client.DB.get('banned')) || []

        //Antilink
        await antilink(client, M, groupAdmins, ActivateMod, isGroup, sender, body, from)

        //Banned system
        if (banned.includes(sender)) return M.reply('🟥 *You are banned from using the bot*')

        //Ai chat
        await ai_chat(client, M, isGroup, isCmd, ActivateChatBot, body, from)

        // Logging Message
        client.log(
            `${chalk[isCmd ? 'red' : 'green'](`${isCmd ? '~EXEC' : '~RECV'}`)} ${
                isCmd ? `${client.config.prefix}${cmdName}` : 'Message'
            } ${chalk.white('from')} ${M.pushName} ${chalk.white('in')} ${isGroup ? gcName : 'DM'} ${chalk.white(
                `args: [${chalk.blue(args.length)}]`
            )}`,
            'yellow'
        )

        if (!isCmd) return
        const command =
            client.cmd.get(cmdName) ||
            client.cmd.find((cmd) => cmd.command.aliases && cmd.command.aliases.includes(cmdName))

        if (!command) return M.reply(`💔 *No such command found!!*`)
        if (!groupAdmins.includes(sender) && command.command.category == 'moderation')
            return M.reply('🟨 *User Missing Admin Permission*')
        if (
            !groupAdmins.includes(client.user.id.split(':')[0] + '@s.whatsapp.net') &&
            command.command.category == 'moderation'
        )
            return M.reply('💔 *Missing admin permission. Try promoting me to admin and try again.*')
        if (!isGroup && command.command.category == 'moderation')
            return M.reply('🟨 *This command and its aliases can only be used in a group chat*')
        if (!client.config.mods.includes(sender.split('@')[0]) && command.command.category == 'dev')
            return M.reply('📛 *This command only can be accessed by the mods*')
        command.execute(client, flag, arg, M)

        //Experiance
        await experience(client, sender, M, from, command)
    } catch (err) {
        client.log(err, 'red')
    }
}

const antilink = async (client, M, groupAdmins, ActivateMod, isGroup, sender, body, from) => {
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
                M.reply('❤ *Successfully removed an intruder!!!!*')
            }
        }
    }
}

const ai_chat = async (client, M, isGroup, isCmd, ActivateChatBot, body, from) => {
    // AI chatting using
    if (M.quoted?.participant) M.mentions.push(M.quoted.participant)
    if (
        M.mentions.includes(client.user.id.split(':')[0] + '@s.whatsapp.net') &&
        !isCmd &&
        isGroup &&
        ActivateChatBot.includes(from)
    ) {
        const msg = M.mentions
            ? M.mentions
                  .map(async (x) => `${body.replace(x, (await client.contact.getContact(x, client)).username)}`)
                  .join(', ')
            : body
        const text = await axios.get(`https://hercai.onrender.com/beta/hercai?question=${encodeURI(msg)}`, {
            headers: {
                'content-type': 'application/json'
            }
        })
        M.reply(text.data.reply)
    }
}

const experience = async (client, sender, M, from, cmd) => {
    //Will add exp according to the commands
    await client.exp.add(sender, cmd.command.exp)

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
            caption: `🎉 Congratuations! You've Leveled Up!

             *${level} ---> ${level + 1}* 🎊`,
            gifPlayback: true
        },
        {
            quoted: M
        }
    )
}
