import { NextResponse } from "next/server";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

export async function POST(req) {
    try {
        const genAI = new GoogleGenerativeAI({
            apiKey: process.env.GEMINI_API_KEY,
        });

        // Extract and log the request body
        const reqObj = await req.json();
        console.log("Request Object:", reqObj);

        const prompt = reqObj.messages?.[reqObj.messages.length - 1]?.content;

        if (!prompt) {
            throw new Error("No prompt provided");
        }

        const input = {
            model: "gemini-pro",
            contents: [prompt],
        };

        // Log the input to be sent to the API
        console.log("API Input:", input);

        const result = await genAI.generateContent(input);

        // Log the result received from the API
        console.log("API Result:", result);

        const textToSend = result.candidates?.[0]?.content || "I'm sorry, I don't understand your request.";

        return NextResponse.json({ message: textToSend });

    } catch (error) {
        console.error("Error:", error);

        // Return more detailed error information
        return NextResponse.json(
            {
                error: "Failed to generate a response from the AI model.",
                details: error.message,
                stack: error.stack,
            },
            { status: 500 }
        );
    }
}

