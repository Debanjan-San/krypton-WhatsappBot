const api = require('api')('@writesonic/v2.2#4enbxztlcbti48j')
api.auth(process.env.WRITE_SONIC)

const WriteSonic_gpt = async (text) => {
    const result = await api.chatsonic_V2BusinessContentChatsonic_post(
        {
            enable_google_results: 'true',
            enable_memory: true,
            input_text: text
        },
        { engine: 'premium' }
    )

    return {
        response: result
    }
}

module.exports = {
    WriteSonic_gpt
}
