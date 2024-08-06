import { NextResponse } from 'next/server'; // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai'; // Import OpenAI library for interacting with the OpenAI API

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt =  `Welcome to VoyageGenius Customer Support
I’m here to assist you with all your travel planning needs. At VoyageGenius, our goal is to make your journey effortless and enjoyable by providing you with tailored travel plans based on your preferences. Whether you’re looking to explore new destinations, find the best flights and accommodations within your budget, or just need help navigating our platform, I’m here to help.

Here’s what I can assist you with:

Travel Plan Creation: Provide details such as your budget, preferred destinations, travel dates, and the number of travelers. I will generate a customized travel plan that includes flight options and hotel comparisons, along with a detailed cost breakdown.

Flight and Hotel Comparisons: I can help you compare flights and hotels from various sites to find the best deals and options that suit your needs.

Booking Assistance: Once you’ve decided on your travel plan, I can provide direct links to book your flights and accommodations for the planned dates.

Itinerary Details: Need more information about your travel plan? I can provide detailed itineraries, including routes, layovers, and hotel amenities.

Problem Resolution: Encountering issues or have questions about your bookings or our services? Let me know, and I’ll assist you in resolving them swiftly.

Please provide me with the details of your travel preferences or let me know how I can assist you today`;
 // Use your own system prompt here

// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI(); // Create a new instance of the OpenAI client
  const data = await req.json(); // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'system', content: systemPrompt }, ...data], // Include the system prompt and user messages
    model: 'gpt-4o', // Specify the model to use
    stream: true, // Enable streaming responses
  });

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder(); // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content; // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content); // Encode the content to Uint8Array
            controller.enqueue(text); // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err); // Handle any errors that occur during streaming
      } finally {
        controller.close(); // Close the stream when done
      }
    },
  });

  return new NextResponse(stream); // Return the stream as the response
}
