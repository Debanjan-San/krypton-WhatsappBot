const Welcomer = require('welcomer-gif')

module.exports = EventsHandler = async (event, client) => {
    const activateEvents = (await client.DB.get('events')) || []
    const groupMetadata = await client.groupMetadata(event.id)
    if (!activateEvents.includes(event.id)) return
    const text =
        event.action === 'add'
            ? `- ${groupMetadata.subject} -\n\n💈 *Group Description:*\n${
                  groupMetadata.desc
              }\n\nHope you follow the rules and have fun!\n\n*‣ ${event.participants
                  .map((jid) => `@${jid.split('@')[0]}`)
                  .join(' ')}*`
            : event.action === 'remove'
            ? `Goodbye *${event.participants
                  .map((jid) => `@${jid.split('@')[0]}`)
                  .join(', ')}* 👋🏻, we're probably not gonna miss you.`
            : event.action === 'demote'
            ? `Ara Ara, looks like *@${event.participants[0].split('@')[0]}* got Demoted`
            : `Congratulations *@${event.participants[0].split('@')[0]}*, you're now an admin`
    if (event.action === 'add') {
        const user = event.participants[0]
        const username = (await client.contact.getContact(user, client)).username
        const tag = ((Math.random() * 10000) | 0).toString().padStart(4, '0')
        let imageUrl
        try {
            imageUrl = await client.profilePictureUrl(user, 'image')
        } catch {
            imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'
        }
        const pfp = await client.utils.getBuffer(imageUrl)
        const image = new Welcomer()
            .setBackground('https://i.pinimg.com/originals/07/28/dc/0728dc400eca09632215055ff003d8bf.gif')
            .setGIF(true)
            .setAvatar(pfp)
            .setName(username)
            .setDiscriminator(tag)
        return void (await client.sendMessage(event.id, {
            video: await client.utils.gifToMp4(await image.generate()),
            gifPlayback: true,
            mentions: event.participants,
            caption: text
        }))
    }
    client.sendMessage(event.id, {
        text,
        mentions: event.participants
    })
}
