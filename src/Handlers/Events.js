module.exports = EventsHandler = async (data, client) => {
    const activateEvents = (await client.DB.get('events')) || []
    const groupMetadata = await client.groupMetadata(data.id)

    if (!activateEvents.includes(data.id)) return

    const text =
        data.action === 'add'
            ? `- ${groupMetadata.subject} -\n\n💈 *Group Description:*\n${
                  groupMetadata.description
              }\n\nHope you follow the rules and have fun!\n\n*‣ ${data.participants
                  .map((jid) => `@${jid.split('@')[0]}`)
                  .join(' ')}*`
            : data.action === 'remove'
            ? `Goodbye *${data.participants
                  .map((jid) => `@${jid.split('@')[0]}`)
                  .join(', ')}* 👋🏻, we're probably not gonna miss you.`
            : data.action === 'demote'
            ? `Ara Ara, looks like *@${data.participants[0].split('@')[0]}* got Demoted`
            : `Congratulations *@${data.participants[0].split('@')[0]}*, you're now an admin`
    client.sendMessage(data.id, {
        text,
        mentions: [data.participants[0]]
    })
}
