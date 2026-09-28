import 'dotenv/config'; 
import Groq from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
	console.log("Missing GROQ_API_KEY in .env")
}

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })