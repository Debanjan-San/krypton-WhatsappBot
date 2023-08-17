const {
    default: Baileys,
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys')
const { QuickDB } = require('quick.db')
const { getConfig } = require('./getConfig')
const { MongoDriver } = require('quickmongo')
const { Collection } = require('discord.js')
const MessageHandler = require('./Handlers/Message')
const EventsHandler = require('./Handlers/Events')
const contact = require('./Helper/contacts')
const utils = require('./Helper/function')
const openai = require('./Library/AI_lib')
const app = require('express')()
const chalk = require('chalk')
const P = require('pino')
const { Boom } = require('@hapi/boom')
const { join } = require('path')
const { imageSync } = require('qr-image')
const { readdirSync, remove } = require('fs-extra')
const port = process.env.PORT || 3000
const driver = new MongoDriver(process.env.URL)

const start = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('session')

    const client = Baileys({
        version: (await fetchLatestBaileysVersion()).version,
        auth: state,
        logger: P({ level: 'silent' }),
        browser: ['krypton-WhatsappBot', 'silent', '4.0.0'],
        printQRInTerminal: true
    })

    //Config
    client.config = getConfig()

    //Database
    client.DB = new QuickDB({
        driver
    })
    //Tables
    client.contactDB = client.DB.table('contacts')

    //Contacts
    client.contact = contact

    //Open AI
    client.AI = openai

    //Experience
    client.exp = client.DB.table('experience')

    //Commands
    client.cmd = new Collection()

    //Utils
    client.utils = utils

    client.messagesMap = new Map()

    /**
     * @returns {Promise<string[]>}
     */

    client.getAllGroups = async () => Object.keys(await client.groupFetchAllParticipating())

    /**
     * @returns {Promise<string[]>}
     */

    client.getAllUsers = async () => {
        const data = (await client.contactDB.all()).map((x) => x.id)
        const users = data.filter((element) => /^\d+@s$/.test(element)).map((element) => `${element}.whatsapp.net`)
        return users
    }

    //Colourful
    client.log = (text, color = 'green') =>
        color ? console.log(chalk.keyword(color)(text)) : console.log(chalk.green(text))

    //Command Loader
    const loadCommands = async () => {
        const readCommand = (rootDir) => {
            readdirSync(rootDir).forEach(($dir) => {
                const commandFiles = readdirSync(join(rootDir, $dir)).filter((file) => file.endsWith('.js'))
                for (let file of commandFiles) {
                    const cmd = require(join(rootDir, $dir, file))
                    client.cmd.set(cmd.command.name, cmd)
                    client.log(`Loaded: ${cmd.command.name.toUpperCase()} from ${file}`)
                }
            })
            client.log('Successfully Loaded Commands')
        }
        readCommand(join(__dirname, '.', 'Commands'))
    }

    //connection updates
    client.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        if (update.qr) {
            client.log(`[${chalk.red('!')}]`, 'white')
            client.log(`Scan the QR code above | You can also authenicate in http://localhost:${port}`, 'blue')
            client.QR = imageSync(update.qr)
        }
        if (connection === 'close') {
            const { statusCode } = new Boom(lastDisconnect?.error).output
            if (statusCode !== DisconnectReason.loggedOut) {
                console.log('Connecting...')
                setTimeout(() => start(), 3000)
            } else {
                client.log('Disconnected.', 'red')
                await remove('session')
                console.log('Starting...')
                setTimeout(() => start(), 3000)
            }
        }
        if (connection === 'connecting') {
            client.state = 'connecting'
            console.log('Connecting to WhatsApp...')
        }
        if (connection === 'open') {
            client.state = 'open'
            loadCommands()
            client.log('Connected to WhatsApp')
            client.log('Total Mods: ' + client.config.mods.length)
        }
    })

    app.get('/', (req, res) => {
        res.status(200).setHeader('Content-Type', 'image/png').send(client.QR)
    })

    client.ev.on('messages.upsert', async (messages) => await MessageHandler(messages, client))

    client.ev.on('group-participants.update', async (event) => await EventsHandler(event, client))

    client.ev.on('contacts.update', async (update) => await contact.saveContacts(update, client))

    client.ev.on('creds.update', saveCreds)
    return client
}

if (!process.env.URL) return console.error('You have not provided any MongoDB URL!!')
driver
    .connect()
    .then(() => {
        console.log(`Connected to the database!`)
        // Starts the script if gets a success in connecting with Database
        start()
    })
    .catch((err) => console.error(err))

app.listen(port, () => console.log(`Server started on PORT : ${port}`))
