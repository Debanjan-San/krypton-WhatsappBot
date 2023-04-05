getContact = async (jid, client) => {
    // Gets the arr of contacts
    const contact = await client.contactDB.get(jid)
    //console.log(contact)
    if (!contact)
        return {
            username: 'User',
            jid
        }
    return {
        username: contact || 'User',
        jid
    }
}

saveContacts = async (contacts, client) => {
    // Saves the contacts
    for (const contact of contacts) {
        if (contact.id) {
            await client.contactDB.set(contact.id, contact.notify || '')
            //console.log(contact)
        }
    }
}

module.exports = {
    saveContacts,
    getContact
}
