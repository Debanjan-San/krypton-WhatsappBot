const {
    default: Baileys,
    DisconnectReason,
    useSingleFileAuthState,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    delay,
} = require('@adiwajshing/baileys')
const { QuickDB } = require('quick.db')
const { MongoDriver } = require('quickmongo')
const MessageHandler = require('./Handlers/Message.js')
const EventsHandler = require('./Handlers/Events.js')
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
const port = process.env.PORT || 8080
const driver = new MongoDriver('mongodb+srv://rrr:rrr@cluster0.xxwc771.mongodb.net/?retryWrites=true&w=majority')

const start = async () => {
    const { state, saveState } = useSingleFileAuthState('./session.json')
    const clearState = () => unlink('./session.json')

    const client = Baileys({
        version: (await fetchLatestBaileysVersion()).version,
        printQRInTerminal: true,
        auth: state,
        logger: P({
            level: 'fatal',
        }),
        browser: ['Krypton_Botto', 'fatal', '1.0.0'],
    })

    //Database
    client.DB = new QuickDB({
        driver,
    })
    //Tables
    client.contactDB = client.DB.table('contacts')

    //Contacts
    client.contact = contact

    //Open AI
    client.AI = openai

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

driver.connect().then(() => {
    console.log(`Connected to the database!`)
    // Starts the script if gets a success in connecting with Database
    start()
})

app.listen(port, () => console.log(`Server started on PORT : ${port}`))
