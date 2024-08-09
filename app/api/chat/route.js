import { NextResponse } from "next/server"; // Next.js's way of returning a response to user
import dotenv, { config } from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST function to handle incoming requests
export async function POST(req) {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // AI model

    const reqObj = await req.json(); // Parse request to JS object
    const prompt = reqObj.prompt; // Extract prompt from user

    const result = await model.generateContent(prompt); // Send prompt to model
    const response = await result.response;
    const textToSend = response.text(); // Convert response promise to text

    return NextResponse.json({ message: textToSend });
}
