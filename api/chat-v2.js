const axios = require('axios');

module.exports = async (req, res) => {
  // Aggressive anti-cache headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('X-Version', 'v2-no-hmac');
  res.setHeader('X-Deployment-Time', new Date().toISOString());
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }
  
  try {
    const CHATBASE_API_KEY = '8171b8f9-aac3-4b77-8175-226cc23e4d9b';
    const CHATBOT_ID = 'MNPuL5RkxOrS4SeEetwE6';
    
    const { conversation } = req.body;
    
    if (!conversation || !Array.isArray(conversation)) {
      return res.status(400).json({
        error: 'Invalid request. Expected conversation array.',
        version: 'v2-no-hmac',
        timestamp: new Date().toISOString()
      });
    }
    
    // CRITICAL: Only send these three fields
    const requestBody = {
      messages: conversation,
      chatbotId: CHATBOT_ID,
      stream: false
    };
    
    console.log('[V2] Sending to Chatbase:', JSON.stringify(requestBody, null, 2));
    
    const response = await axios.post(
      'https://www.chatbase.co/api/v1/chat',
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${CHATBASE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );
    
    const botResponse = response.data.text || response.data.answer || response.data.message || 'No response';
    
    return res.status(200).json({ 
      response: botResponse,
      version: 'v2-no-hmac',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[V2] Full error:', error.response?.data || error.message);
    
    return res.status(error.response?.status || 500).json({
      error: 'Failed to get response',
      details: error.message,
      status: error.response?.status,
      chatbaseError: error.response?.data,
      version: 'v2-no-hmac',
      timestamp: new Date().toISOString(),
      requestSent: {
        hasUserId: false,
        hasUserHash: false,
        hasSecret: false,
        fields: ['messages', 'chatbotId', 'stream']
      }
    });
  }
};