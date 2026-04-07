const { GoogleGenerativeAI } = require('@google/generative-ai');
const Movie = require('../models/nowPlayingMovie.model');
const Cinema = require('../models/cinema.model');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chat = async (req, res) => {
    try {
        const { message } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ con: false, msg: 'Gemini API Key not configured' });
        }

        // Fetch context data
        // In a real app, we might need more sophisticated retrieval (RAG), 
        // but for now, let's just fetch a summary of movies or use existing knowledge if the dataset is huge.
        // Let's assume we pass top 5 recent movies as context.
        const recentMovies = await Movie.find().sort({ releaseDate: -1 }).limit(5);
        const cinemas = await Cinema.find();

        const context = `
            You are a helpful assistant for a Cinema App.
            Here are some movies currently available or coming soon:
            ${recentMovies.map(m => `- ${m.title} (${m.releaseDate ? m.releaseDate.toDateString() : 'TBA'})`).join('\n')}
            
            Here are our cinemas:
            ${cinemas.map(c => `- ${c.name} at ${c.address}`).join('\n')}
            
            Answer the user's question based on this information or general movie knowledge.
            User: ${message}
        `;

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(context);
        const response = await result.response;
        const text = response.text();

        res.json({ con: true, msg: text });

    } catch (err) {
        console.error('Chat Error:', err);
        res.status(500).json({ con: false, msg: 'Failed to generate response' });
    }
};
