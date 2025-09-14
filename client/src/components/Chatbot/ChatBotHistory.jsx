import React from "react";
import ReactMarkdown from "react-markdown";

import { Box, Paper } from "@mui/material"; 

function ChatBotHistory({ chatHistory }) {
  return (
    <Box sx={{ py: 2 }}> 
      {chatHistory.map((message, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            justifyContent: message.type === "user" ? "flex-end" : "flex-start",
            mb: 2, 
          }}
        >
          <Paper
            elevation={2} 
            sx={{
              p: 1.5, 
              borderRadius: 3, 
              maxWidth: "75%", 
              wordBreak: "break-word",
              bgcolor: message.type === "user" ? "primary.main" : "grey.200", 
              color: message.type === "user" ? "white" : "text.primary", 
            }}
          >
            <ReactMarkdown>{message.message}</ReactMarkdown>
          </Paper>
        </Box>
      ))}
    </Box>
  );
}

export default ChatBotHistory;