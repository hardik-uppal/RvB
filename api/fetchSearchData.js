const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const { city, api } = req.query;

    let apiUrl;
    let headers;
    let body;

    if (api === 'openai') {
        apiUrl = 'https://api.openai.com/v1/completions';
        headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        };
        body = JSON.stringify({
            model: "text-davinci-003",
            prompt: `Provide real estate investment insights for ${city}. Include:
1. Current market trends.
2. Average property price.
3. Average rental yield.
4. Investment advice.`,
            max_tokens: 150,
            temperature: 0.7
        });
    } else if (api === 'perplexity') {
        apiUrl = 'https://api.perplexity.ai/v1/chat/completions';
        headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
        };
        body = JSON.stringify({
            messages: [
                {
                    role: "user",
                    content: `Provide real estate investment insights for ${city}. Include:
1. Current market trends.
2. Average property price.
3. Average rental yield.
4. Investment advice.`
                }
            ],
            max_tokens: 150,
            temperature: 0.7
        });
    } else {
        res.status(400).json({ error: 'Invalid API specified' });
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: body
        });
        const data = await response.json();
        res.status(200).json({ text: api === 'openai' ? data.choices[0].text : data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};