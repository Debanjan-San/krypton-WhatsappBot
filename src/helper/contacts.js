const getContact = async (jid, client) => {
    // Get contact information from the contact database using the JID
    const contact = await client.contactDB.get(jid)

    // If the contact exists, return their name, otherwise return "User"
    const username = contact ?? 'User'

    return { username, jid }
}

// Saves an array of contacts to the contact database
const saveContacts = async (contacts, client) => {
    // Use Promise.all to concurrently process each contact in the array
    await Promise.all(
        contacts.map(async (contact) => {
            // If the contact has an ID, set their notify value in the database
            if (contact.id) {
                await client.contactDB.set(contact.id, contact.notify ?? '')
            }
        })
    )
}

module.exports = {
    saveContacts,
    getContact
}
