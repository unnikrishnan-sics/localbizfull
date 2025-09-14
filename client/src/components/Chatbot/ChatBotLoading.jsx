import React from 'react';
import { Box, CircularProgress } from '@mui/material';

function ChatBotLoading({ isLoading }) {
  return (
    <Box>
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
          <CircularProgress size={24} /> 
        </Box>
      )}
    </Box>
  );
}

export default ChatBotLoading;