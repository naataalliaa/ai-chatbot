"use client";

import { Box, Button, Stack, TextField, Avatar } from "@mui/material";
import { useState, useRef, useEffect } from "react";


export default function Home() {
    // System prompt for the AI, providing guidelines on how to respond to users
    const systemPrompt = `Welcome to VoyageGenius Customer Support.
I’m here to assist you with all your travel planning needs.`;

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
    try {
        // Update messages and render user message
        setMessages((messages) => [
            ...messages,
            { role: "user", content: userResponse },
        ]);

        // Perform API call
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messages: [...messages, { role: "user", content: userResponse }],
            }),
        });

        // Check if the response is OK
        if (!response.ok) {
            // Throw an error with more detailed information
            const errorMessage = await response.text();
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}: ${errorMessage}`);
        }
        // Parse JSON
        const data = await response.json();

        // Log the response for debugging
        console.log(data);

        // Update messages with the response from the API
        setMessages((messages) => [
            ...messages,
            { role: "assistant", content: data.message },
        ]);
        
        // Clear the input field
        setUserResponse("");
    } catch (error) {
        console.error("Error:", error);
        
    }
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
                border="2.5px solid"
                borderRadius="30px"
                borderColor="rgb(var(--card-border-rgb))"
                p={2}
                spacing={3}
                bo
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
                            alignItems="center"
                        >
                            {message.role === "assistant" && (
                                <Avatar
                                alt="Assistant"
                                src="/components/chatbot.png"
                                sx={{
                                    mr: 1,
                                    width: 80, 
                                    height: 70, 
                                }}
     
                                />
                            )}
                            <Box
                                sx={{
                                    bgcolor:
                                        message.role === "assistant"
                                            ? "rgba(179, 206, 229, 0.7)"
                                            : "rgba(65, 105, 225, 0.7)",
                                    color: "black",
                                    borderRadius: 2,
                                    p: 2,
                                    maxWidth: "75%",
                                }}
                            >
                                {message.content}
                            </Box>
                            {message.role !== "assistant" && (
                                <Avatar
                                alt="User"
                                src="/components/user.png"
                                sx={{ml:2}}
                                />
                            )}
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