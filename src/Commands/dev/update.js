const simpleGit = require('simple-git')
const git = simpleGit()

module.exports = {
    name: 'updates',
    aliases: ['updatenow'],
    category: 'dev',
    exp: 0,
    description: 'Updates gives the list of latest commits and updatenow updates the bot',
    async execute(client, flag, arg, M) {
        const command = M.body.split(' ')[0].toLowerCase().slice(client.prefix.length).trim()
        await git.fetch()
        const commits = await git.log(['main' + '..origin/' + 'main'])
        if (command == 'updates') {
            let updates = '======= *UPDATES* =======\n\n'
            if (commits.total == 0) return M.reply('Sorry there is no new updates!!')
            commits['all'].map((commit) => {
                updates +=
                    '```🔹 [' +
                    commit.date.substring(0, 10) +
                    ']: ' +
                    commit.message +
                    ' <' +
                    commit.author_name +
                    '>```\n'
            })
            M.reply(updates)
        }
        if (command == 'updatenow') {
            if (commits.total == 0) return M.reply('You are already using the updated version')
            git.pull(async (err, update) => {
                if (update && update.summary.changes) {
                    await M.reply('```Updateing....```')
                    await client.utils.term('npm install').stderr.pipe(process.stderr)
                } else if (err) return M.reply(err)
            })
        }
    }
}
