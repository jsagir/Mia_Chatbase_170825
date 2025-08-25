const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }
  
  try {
    // HARDCODED CREDENTIALS FOR TESTING
    const CHATBASE_API_KEY = '8171b8f9-aac3-4b77-8175-226cc23e4d9b';
    const CHATBOT_ID = 'MNPuL5RkxOrS4SeEetwE6';
    
    console.log('Using hardcoded credentials:', {
      apiKey: CHATBASE_API_KEY.substring(0, 8) + '...',
      chatbotId: CHATBOT_ID
    });
    
    console.log('Received request body:', JSON.stringify(req.body, null, 2));
    
    const { conversation } = req.body;
    
    if (!conversation || !Array.isArray(conversation)) {
      return res.status(400).json({
        error: 'Invalid request. Expected conversation array.'
      });
    }
    
    // Clean the conversation array to remove any extra fields
    const cleanMessages = conversation.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    const requestBody = {
      messages: cleanMessages,
      chatbotId: CHATBOT_ID,
      stream: false
    };
    
    console.log('Sending to Chatbase:', JSON.stringify(requestBody, null, 2));
    
    const response = await axios.post(
      'https://www.chatbase.co/api/v1/chat',
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${CHATBASE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const botResponse = response.data.text || response.data.answer || 'No response';
    return res.status(200).json({ response: botResponse });
    
  } catch (error) {
    console.error('Full error:', error.response?.data);
    
    return res.status(500).json({
      error: 'Failed to get response',
      details: error.message,
      status: error.response?.status,
      chatbaseError: error.response?.data,
      credentials: {
        apiKey: '8171b8f9-aac3-4b77-8175-226cc23e4d9b'.substring(0, 8) + '...',
        chatbotId: 'MNPuL5RkxOrS4SeEetwE6'
      }
    });
  }
};
