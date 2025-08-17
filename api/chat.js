const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { conversation } = req.body;
  const CHATBASE_API_KEY = process.env.CHATBASE_API;
  const CHATBOT_ID = process.env.CHATBOT_ID;
  
  try {
    const response = await axios.post(
      'https://www.chatbase.co/api/v1/chat',
      {
        messages: conversation,
        chatbotId: CHATBOT_ID,
        stream: false
      },
      {
        headers: {
          'Authorization': `Bearer ${CHATBASE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return res.status(200).json({ response: response.data.text || 'No response' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
