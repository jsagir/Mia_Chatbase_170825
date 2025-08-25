# Mia Chatbase Integration API

A Vercel serverless function that provides a secure proxy for the Chatbase API, handling authentication and CORS for client-side applications.

## 🚀 Endpoints

### `/api/chat` - Main Chat Endpoint
The primary endpoint for chat interactions with Chatbase.

**Method:** `POST`

**Request Body:**
```json
{
  "conversation": [
    {
      "role": "user",
      "content": "Your message here"
    }
  ]
}
```

**Response:**
```json
{
  "response": "Bot's response message"
}
```

### `/api/chat-v2` - Alternative Chat Endpoint
A cache-busted version with enhanced debugging and anti-cache headers.

**Method:** `POST`

**Request Body:** Same as `/api/chat`

**Response:**
```json
{
  "response": "Bot's response message",
  "version": "v2-no-hmac",
  "timestamp": "2024-12-17T..."
}
```

### `/api/debug` - Deployment Information
Provides current deployment status and metadata.

**Method:** `GET`

**Response:**
```json
{
  "timestamp": "2024-12-17T...",
  "deploymentId": "dpl_xxx",
  "gitCommit": "de5c9ef",
  "region": "iad1",
  "nodeVersion": "v20.x",
  "message": "This is the LATEST deployment without HMAC",
  "chatEndpointVersion": "v2-no-hmac",
  "lastUpdated": "2024-12-17"
}
```

## 🔧 Configuration

### Environment Variables
Currently using hardcoded credentials for testing. In production, these should be environment variables:

- `CHATBASE_API_KEY`: Your Chatbase API key
- `CHATBOT_ID`: Your Chatbase chatbot ID

### Vercel Configuration
The `vercel.json` file includes:
- Cache prevention headers for all API routes
- Function timeout settings
- CORS configuration

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jsagir/Mia_Chatbase_170825.git
   cd Mia_Chatbase_170825
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Deploy to Vercel:
   ```bash
   vercel
   ```

## 🛠️ Development

### Local Testing
To test locally with Vercel CLI:
```bash
vercel dev
```

### API Testing with cURL
```bash
# Test chat endpoint (Production URL)
curl -X POST https://mia-chatbase-170825.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d '{"conversation": [{"role": "user", "content": "Hello"}]}'

# Test alternative endpoint with cache-busting
curl -X POST https://mia-chatbase-170825.vercel.app/api/chat-v2 \
  -H "Content-Type: application/json" \
  -d '{"conversation": [{"role": "user", "content": "Hello"}]}'

# Check deployment status
curl https://mia-chatbase-170825.vercel.app/api/debug
```

## 📝 Recent Updates

### December 25, 2024 - Latest Deployment
- ✅ **ISSUE RESOLVED**: Fixed "Unrecognized key(s) in object: 'user_id', 'user_hash'" error
- Successfully redeployed latest code from GitHub to Vercel
- Both `/api/chat` and `/api/chat-v2` endpoints are now working correctly
- Deployment confirmed at 12:33 PM (Washington, D.C., USA - iad1)

### December 17, 2024
- Removed HMAC authentication fields (`user_id`, `user_hash`) that were causing 400 errors
- Added cache-busting configuration to prevent stale deployments
- Created debug endpoint for deployment verification
- Added alternative `/api/chat-v2` endpoint with enhanced error reporting

## 🔍 Troubleshooting

### "Unrecognized key(s)" Error (RESOLVED)
**Status: ✅ Fixed as of December 25, 2024**

This error was caused by outdated deployment including `user_id` and `user_hash` fields that Chatbase doesn't recognize. The issue has been resolved by redeploying the latest code.

If you still encounter this error:
- Ensure your request only includes: `messages`, `chatbotId`, `stream`
- Try using the `/api/chat-v2` endpoint
- Check `/api/debug` to verify you're using the latest deployment

### Deployment Not Updating
1. Check deployment status at `/api/debug`
2. Use `/api/chat-v2` if `/api/chat` shows cached behavior
3. Verify `vercel.json` cache headers are present
4. Check Vercel dashboard for deployment status

## 📄 License

This project is for demonstration purposes. Please ensure you comply with Chatbase's terms of service when using their API.

## 🤝 Contributing

Feel free to open issues or submit pull requests for improvements.

---

**Note:** Remember to move credentials to environment variables before using in production!
"# Mia_Chatbase_bridge_250825" 
