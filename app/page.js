'use client';

import { Box, Button, Stack, TextField } from '@mui/material';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Voyage assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState('');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return; // Don't send empty messages

    const newMessages = [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ];

    setMessage('');
    setMessages(newMessages);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
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
        color: 'rgb(var(--foreground-rgb))',
        background: 'linear-gradient(to bottom, transparent, rgb(var(--background-end-rgb))) rgb(var(--background-start-rgb))',
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
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                sx={{
                  bgcolor: message.role === 'assistant' ? 'rgba(255, 165, 0, 0.7)' : 'rgba(65, 105, 225, 0.7)',
                  color: 'white',
                  borderRadius: 2,
                  p: 2,
                }}
              >
                {message.content}
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              bgcolor: 'rgb(var(--callout-rgb))',
              color: 'rgb(var(--foreground-rgb))'
            }}
          />
          <Button 
            variant="contained" 
            onClick={sendMessage}
            sx={{
              bgcolor: 'rgb(var(--card-rgb))',
              color: 'rgb(var(--foreground-rgb))'
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
