const {
    Configuration,
    OpenAIApi
} = require("openai");
const apiKey = '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'

const configuration = new Configuration({
    apiKey: apiKey
});
const openai = new OpenAIApi(configuration);

chat = async (text) => {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${text}`,
        temperature: 0,
        max_tokens: 3000,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0,
    });

    return {
        response: completion.data.choices[0].text
    }
}

gpt = async (text) => {
    //gpt-3.5-turbo
    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: `${text}`}],
      });

    return {
        response: completion.data.choices[0].message.content
    }
} 

module.exports = {
    chat,
    gpt
};