const { getBinaryNodeChild } = require('@adiwajshing/baileys')
const { serialize } = require('../lib/WAclient')
const { color } = require('../lib/colour')
const { Collection } = require('discord.js')
const { readdirSync } = require('fs-extra')
const { join } = require('path')
const { response } = require('express')

module.exports = MessageHandler = async (messages, client) => {
    try {
        if (messages.type !== 'notify') return
        let M = serialize(JSON.parse(JSON.stringify(messages.messages[0])), client)
        if (!M.message) return
        if (M.key && M.key.remoteJid === 'status@broadcast') return
        if (M.type === 'protocolMessage' || M.type === 'senderKeyDistributionMessage' || !M.type || M.type === '')
            return

        client.prefix = '!'
        client.cmd = new Collection()

        const { isGroup, sender, from, body } = M
        const gcMeta = isGroup ? await client.groupMetadata(from) : ''
        const gcName = isGroup ? gcMeta.subject : ''
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(client.prefix)
        const cmdName = body.slice(client.prefix.length).trim().split(/ +/).shift().toLowerCase()
        const arg = body.replace(cmdName, '').slice(1).trim()
        const groupMembers = gcMeta?.participants || []
        const groupAdmins = groupMembers.filter((v) => v.admin).map((v) => v.id)

        console.log(body)
        // AI chatting using OpenAI
        if (M.mentions.includes(client.user.id.split(':')[0] + '@s.whatsapp.net') && !isCmd && isGroup) {
            const text = await client.AI.chat(body.trim())
            M.reply(text.response.trim().replace('[Your Name]', M.pushName))
        }

        // Logging Message
        if (!isGroup && isCmd)
            console.log(
                color('~', 'yellow'),
                color('EXEC', 'red'),
                color(cmdName, 'yellow'),
                'from',
                color(sender.split('@')[0], 'yellow'),
                'args :',
                color(args.length, 'blue')
            )
        if (!isGroup && !isCmd)
            console.log(
                color('~', 'yellow'),
                color('RECV', 'green'),
                color('Message', 'yellow'),
                'from',
                color(sender.split('@')[0], 'yellow'),
                'args :',
                color(args.length, 'blue')
            )
        if (isCmd && isGroup)
            console.log(
                color('~', 'yellow'),
                color('EXEC', 'red'),
                color(cmdName, 'yellow'),
                'from',
                color(sender.split('@')[0], 'yellow'),
                'in',
                color(gcName, 'yellow'),
                'args :',
                color(args.length, 'blue')
            )
        if (!isCmd && isGroup)
            console.log(
                color('~', 'yellow'),
                color('RECV', 'green'),
                color('Message', 'yellow'),
                'from',
                color(sender.split('@')[0], 'yellow'),
                'in',
                color(gcName, 'yellow'),
                'args :',
                color(args.length, 'blue')
            )

        /**
         * Import all commands
         */
        const commandFiles = readdirSync(join(__dirname, '..', 'command')).filter((file) => file.endsWith('.js'))
        for (const file of commandFiles) {
            /**
             * @constant
             * @type {commandFiles}
             */
            const command = require(join(__dirname, '..', 'command', file))
            client.cmd.set(command.name, command)
        }
        if (!isCmd) return
        const command =
            client.cmd.get(cmdName) || client.cmd.find((cmd) => cmd.aliases && cmd.aliases.includes(cmdName))

        if (!command) return M.reply('No such command found! BAKA')
        if (!groupAdmins.includes(sender) && command?.admin)
            return M.reply('This command can only be used by group or community admins')
        if (!groupAdmins.includes(client.user.id.split(':')[0] + '@s.whatsapp.net') && command?.botAdmin)
            return M.reply('This command can only be used when bot is admin')
        // if (command?.mods) return M.reply("This command can only be used by bot admins")
        if (isGroup && command?.privateChat) return M.reply('This command can only be used in private chat')
        if (!isGroup && command?.public) return M.reply('This command can only be used in public chat')
        command.execute(client, arg, M)
        //console.log(command)
    } catch (err) {
        console.log(err)
    }
}
