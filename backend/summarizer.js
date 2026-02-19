const axios = require('axios');
require('dotenv').config();

const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL = 'facebook/bart-large-cnn';

async function summarize(text, maxLength = 250) {
    if (!text || text.length < 50) return text; // Too short to summarize

    try {
        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${HF_MODEL}`,
            {
                inputs: text.substring(0, 3000), // Limit input length for free tier
                parameters: {
                    max_length: maxLength,
                    min_length: 50,
                    do_sample: false
                }
            },
            {
                headers: { Authorization: `Bearer ${HF_API_KEY}` },
                timeout: 20000 // 20s timeout
            }
        );

        if (response.data && response.data[0] && response.data[0].summary_text) {
            return response.data[0].summary_text;
        }

        // Fallback if structure is unexpected
        return fallbackSummarize(text);

    } catch (err) {
        console.error('Summarization API failed:', err.message);
        if (err.response) {
            console.error('Details:', err.response.data);
        }
        return fallbackSummarize(text);
    }
}

function fallbackSummarize(text) {
    // Simple truncation fallback
    const sentenceEnd = text.indexOf('.', 200);
    if (sentenceEnd > -1) {
        return text.substring(0, sentenceEnd + 1);
    }
    return text.substring(0, 200) + '...';
}

module.exports = summarize;
