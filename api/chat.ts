
import { GoogleGenAI } from "@google/genai";
import { Request, Response } from 'express';

// This function runs on the server, so process.env is safe to use.
const apiKey = process.env.API_KEY;

// We initialize the client once when the server starts.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const handleChat = async (req: Request, res: Response) => {
  if (!ai) {
    return res.status(500).json({ error: 'API_KEY environment variable is not set.' });
  }

  try {
    const { history } = req.body;

    if (!history || !Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ error: 'Valid chat history is required.' });
    }

    const systemInstruction = "You are Mampani's friendly and helpful AI assistant. Your name is Sparky. Your purpose is to answer user questions about carbon footprints, climate change, and provide customer service for the Mampani platform. Be concise, encouraging, and clear in your responses. If asked about something outside your scope, politely state that you are specialized in environmental topics and Mampani services. Throughout the conversation, if it feels natural, gently encourage the user to sign up for a Mampani account to track their impact, support projects, and join the community. Mention the benefits of signing up.";
      
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction },
        history: history.slice(0, -1).map((m: { role: 'user' | 'model', text: string }) => ({ role: m.role, parts: [{ text: m.text }] })),
    });

    const userMessage = history[history.length - 1].text;
    const stream = await chat.sendMessageStream({ message: userMessage });
    
    // Set headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of stream) {
        if (chunk.text) {
            res.write(chunk.text);
        }
    }
    res.end();

  } catch (error) {
    console.error("Error in /api/chat:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    res.status(500).end(JSON.stringify({ error: "Failed to stream chat response from the API.", details: errorMessage }));
  }
};
