require('dotenv').config()
const {
    default: Baileys,
    DisconnectReason,
    useSingleFileAuthState,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    delay
} = require('@adiwajshing/baileys')
const { QuickDB } = require('quick.db')
const { MongoDriver } = require('quickmongo')
const MessageHandler = require('./Handlers/Message')
const EventsHandler = require('./Handlers/Events')
const { color } = require('./lib/colour')
const contact = require('./lib/contacts')
const utils = require('./lib/function')
const openai = require('./lib/openAI')
const app = require('express')()
const qr = require('qr-image')
const mongoose = require('mongoose')
const P = require('pino')
const { Boom } = require('@hapi/boom')
const { readFileSync, unlink } = require('fs-extra')
const port = process.env.PORT || 3000
const driver = new MongoDriver(process.env.URL)

const start = async () => {
    const { state, saveState } = useSingleFileAuthState('./session.json')
    const clearState = () => unlink('./session.json')

    const client = Baileys({
        version: (await fetchLatestBaileysVersion()).version,
        printQRInTerminal: true,
        auth: state,
        logger: P({
            level: 'fatal'
        }),
        browser: ['Krypton_Botto', 'fatal', '1.0.0']
    })

    //Config
    client.name = process.env.NAME || 'Krypton'
    client.prefix = process.env.PREFIX || '!'
    client.url = process.env.URL || null
    client.port = process.env.PORT || 3000
    client.openaiAPI = process.env.OPENAI_API || null
    client.mods = (process.env.MODS || '').split(', ')

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

    //Utils
    client.utils = utils

    //connection updates
    client.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        if (update.qr) {
            console.log(
                color('[', 'white'),
                color('!', 'red'),
                color(']', 'white'),
                color(`Scan the QR code above | You can also authenicate in http://localhost:${port}`, 'blue')
            )
            client.QR = qr.imageSync(update.qr)
        }
        if (connection === 'close') {
            const { statusCode } = new Boom(lastDisconnect?.error).output
            if (statusCode !== DisconnectReason.loggedOut) {
                console.log('Connecting...')
                setTimeout(() => start(), 3000)
            } else {
                console.log('Disconnected.', true)
                clearState()
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
            console.log('🤖', color('Krypton Bot is ready!!', 'green'))
        }
    })

    app.get('/', (req, res) => {
        res.status(200).setHeader('Content-Type', 'image/png').send(client.QR)
    })

    client.ev.on('messages.upsert', async (messages) => await MessageHandler(messages, client))

    client.ev.on('group-participants.update', async (event) => await EventsHandler(event, client))

    client.ev.on('contacts.update', async (update) => await contact.saveContacts(update, client))

    client.ev.on('creds.update', saveState)
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
