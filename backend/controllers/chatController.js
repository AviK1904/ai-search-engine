import { GoogleGenerativeAI } from '@google/generative-ai';
import { tavily } from '@tavily/core';
import dotenv from 'dotenv';

dotenv.config();

// Initialize APIs
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

// Locked in your requested model!
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); 

export const generateChatResponse = async (req, res) => {
    try {
        // 1. We now receive 'history' from the frontend!
        const { prompt, useWeb, history } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required." });
        }

        // 2. Format the history array exactly how Google Gemini expects it
        const formattedHistory = (history || []).map(msg => ({
            role: msg.role === 'ai' ? 'model' : 'user', // Translate 'ai' to 'model'
            parts: [{ text: msg.content }]
        }));

        // 3. Instead of a blank slate, we start a chat WITH the memory!
        const chat = model.startChat({
            history: formattedHistory
        });

        let answer = "";
        let sources = [];

        // 4. Send the new message into the ongoing chat
        if (useWeb) {
            const searchResult = await tvly.search(prompt, { searchDepth: "basic", maxResults: 3 });
            sources = searchResult.results;
            const context = sources.map(r => r.content).join("\n\n");
            
            // We use chat.sendMessage() instead of model.generateContent()
            const result = await chat.sendMessage(`Context: ${context}\n\nQuestion: ${prompt}`);
            answer = result.response.text();
        } else {
            // We use chat.sendMessage() instead of model.generateContent()
            const result = await chat.sendMessage(prompt);
            answer = result.response.text();
        }

        res.json({ answer, sources });

    } catch (error) {
        console.error("Backend API Error:", error);
        res.status(500).json({ error: error.message || "Server error." });
    }
};