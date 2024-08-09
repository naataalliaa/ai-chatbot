"use client";

import { Box, Button, Stack, TextField } from "@mui/material";
import { useState, useRef, useEffect } from "react";

export default function Home() {
    // System prompt for the AI, providing guidelines on how to respond to users
    const systemPrompt = `Welcome to VoyageGenius Customer Support
I’m here to assist you with all your travel planning needs. At VoyageGenius, our goal is to make your journey effortless and enjoyable by providing you with tailored travel plans based on your preferences. Whether you’re looking to explore new destinations, find the best flights and accommodations within your budget, or just need help navigating our platform, I’m here to help.

Here’s what I can assist you with:

Travel Plan Creation: Provide details such as your budget, preferred destinations, travel dates, and the number of travelers. I will generate a customized travel plan that includes flight options and hotel comparisons, along with a detailed cost breakdown.

Flight and Hotel Comparisons: I can help you compare flights and hotels from various sites to find the best deals and options that suit your needs.

Booking Assistance: Once you’ve decided on your travel plan, I can provide direct links to book your flights and accommodations for the planned dates.

Itinerary Details: Need more information about your travel plan? I can provide detailed itineraries, including routes, layovers, and hotel amenities.

Problem Resolution: Encountering issues or have questions about your bookings or our services? Let me know, and I’ll assist you in resolving them swiftly.

Please provide me with the details of your travel preferences or let me know how I can assist you today.`;

    // Stores all messages in chatbot conversation, intialised to a standard greeting message
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: systemPrompt,
        },
    ]);
    const [userResponse, setUserResponse] = useState(""); // Stores the latest message from user

    // Function used to send the user's latest message to the API
    const sendMessage = async () => {
        // Update messages and render user message
        setMessages((messages) => [
            ...messages,
            { role: "user", content: userResponse },
        ]);
        // Perform API call
        const response = await fetch("api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "aplication/json",
            },
            body: JSON.stringify({
                messages: messages,
                prompt: userResponse,
            }),
        });
        const data = await response.json();
        // Update messages with the response from the API
        setMessages((messages) => [
            ...messages,
            { role: "assistant", content: data.message },
        ]);
    };

    return (
        <Box
            width="100vw"
            height="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{
                color: "rgb(var(--foreground-rgb))",
                background:
                    "linear-gradient(to bottom, transparent, rgb(var(--background-end-rgb))) rgb(var(--background-start-rgb))",
            }}
        >
            <Stack
                direction="column"
                width="500px"
                height="700px"
                border="1px solid"
                borderColor="rgb(var(--card-border-rgb))"
                p={2}
                spacing={3}
            >
                <Stack
                    direction="column"
                    spacing={2}
                    flexGrow={1}
                    overflow="auto"
                    maxHeight="100%"
                >
                    {messages.map((message, index) => (
                        <Box
                            key={index}
                            display="flex"
                            justifyContent={
                                message.role === "assistant"
                                    ? "flex-start"
                                    : "flex-end"
                            }
                        >
                            <Box
                                sx={{
                                    bgcolor:
                                        message.role === "assistant"
                                            ? "rgba(255, 165, 0, 0.7)"
                                            : "rgba(65, 105, 225, 0.7)",
                                    color: "white",
                                    borderRadius: 2,
                                    p: 2,
                                }}
                            >
                                {message.content}
                            </Box>
                        </Box>
                    ))}
                </Stack>
                <Stack direction="row" spacing={2}>
                    <TextField
                        label="Message"
                        fullWidth
                        value={userResponse}
                        onChange={(e) => setUserResponse(e.target.value)}
                        sx={{
                            bgcolor: "rgb(var(--callout-rgb))",
                            color: "rgb(var(--foreground-rgb))",
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={sendMessage}
                        sx={{
                            bgcolor: "rgb(var(--card-rgb))",
                            color: "rgb(var(--foreground-rgb))",
                        }}
                    >
                        Send
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}
