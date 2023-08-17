module.exports.execute = async (client, flag, arg, M) => {
    const image = await client.utils.getBuffer(
        'https://i.pinimg.com/564x/3b/d8/bb/3bd8bb87812f4af49d6a52b7a2394c6d.jpg'
    )
    const result = await client.utils.fetch('https://api.github.com/repos/Debanjan-San/krypton-WhatsappBot')
    let caption = ''
    caption += `*${result.name}* ✨\n\n`
    caption += `✍🏻 *Author: ${result.owner.login}*\n`
    caption += `⭐ *Star's: ${result.stargazers_count}*\n`
    caption += `🍴 *Forks: ${result.forks_count}*\n`
    caption += `⚠️ *Issues: ${result.open_issues_count}*\n`
    caption += `🌐 *Visibility: ${result.visibility}*\n`
    caption += `💠 *Language: ${result.language}*\n`
    caption += `🛡️ *License: ${result.license.name}*\n`
    caption += `⚙️ *Repo Link: ${result.html_url}*`
    await client.sendMessage(M.from, { image, caption }, { quoted: M })
}

module.exports.command = {
    name: 'repo',
    aliases: ['script'],
    category: 'general',
    usage: '',
    exp: 100,
    description: 'Get the base repo of the bot'
}
