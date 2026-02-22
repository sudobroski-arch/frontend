const { GoogleGenerativeAI } = require('@google/generative-ai');
require('./env');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function summarize(text, maxLength = 250) {
    if (!text || text.length < 50) return text; // Too short to summarize

    try {
        const prompt = `
      Summarize the following news article text into a concise, engaging summary of about 2-3 sentences (maximum ${maxLength} characters). 
      Focus on the key facts, who is involved, and why it matters. 
      Do not include meta-commentary like "Here is a summary" or "This article discusses".
      
      Article Text:
      ${text.substring(0, 10000)}
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text().trim();

        if (summary) {
            return summary;
        }

        return fallbackSummarize(text);

    } catch (err) {
        console.error('Gemini Summarization failed:', err.message);
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
