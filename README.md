🤖 AI Support Chat Widget – SAMITECH

<div align="center">

https://img.shields.io/badge/version-1.0.0-blue
https://img.shields.io/badge/license-Proprietary-orange
https://img.shields.io/badge/WebSocket-Enabled-green
https://img.shields.io/badge/Responsive-Yes-brightgreen

A modern, interactive AI chat widget with real-time WebSocket connectivity for customer support.

Live Demo • Features • Installation • Usage • API

</div>

https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&h=600

✨ Features

🎨 UI/UX

· ✅ Gradient floating bubble with hover effects
· ✅ Smooth animations & transitions
· ✅ Light/Dark theme toggle
· ✅ Fully responsive design
· ✅ Custom scrollbar styling
· ✅ Typing indicator animation

💬 Chat Capabilities

· ✅ Real-time WebSocket messaging
· ✅ Conversation history (20 messages)
· ✅ Markdown text formatting
· ✅ Message tools (copy/edit/delete/share)
· ✅ Auto-resizing textarea
· ✅ Keyboard shortcuts

🔧 Technical

· ✅ Automatic WebSocket reconnection
· ✅ Connection status indicators
· ✅ Error handling & fallbacks
· ✅ Performance optimized
· ✅ Comprehensive logging
· ✅ Mobile touch support

🚀 Quick Start

Method 1: Direct HTML Embed

Copy the entire HTML file into your project and include it in the <body> section.

Method 2: Modular Setup (Recommended)

```bash
# Clone repository
git clone https://github.com/yourusername/ai-chat-widget.git

# Copy files to your project
cp ai-chat-widget.html your-project-directory/
```

📁 File Structure

```
ai-chat-widget/
├── index.html              # Main widget file
├── README.md              # This documentation
├── assets/                # (Optional) External assets
│   ├── styles.css        # Extracted CSS
│   ├── script.js         # Extracted JavaScript
│   └── images/           # Avatar images
└── examples/
    └── integration.html  # Usage example
```

⚙️ Configuration

WebSocket Settings

```javascript
// WebSocket endpoint
const WS_ENDPOINT = 'wss://backend.buildpicoapps.com/api/chatbot/chat';

// App configuration
const CONFIG = {
    appId: 'word-almost',
    maxHistory: 20,
    timeout: 25000,
    reconnectDelay: 3000
};
```

Customize Appearance

Edit CSS variables in the <style> section:

```css
:root {
    --accent: #f20d70;           /* Primary color */
    --bg-dark: #0b0b10;          /* Dark theme */
    --bg-light: #f5f6fa;         /* Light theme */
    --user-bubble: #f20d70;      /* User message color */
    --ai-bubble: #1c1c1e;        /* AI message color */
}
```

Update Company Info

```html
<!-- Change in line ~80 -->
<h1>AI Support</h1>
<h3><mark class="highlight-line"><b>YOUR COMPANY NAME</b></mark></h3>
```

🎮 Usage

Basic Interaction

1. Open Chat: Click the floating bubble
2. Send Message: Type and press Enter/click send
3. Theme Toggle: Click moon/sun icon
4. Close Chat: Click X or outside widget

Message Tools

Each message has:

· 📋 Copy – Copy to clipboard
· ✏️ Edit – Modify message
· 🗑️ Delete – Remove message
· 📤 Share – Share via Web Share API

Keyboard Shortcuts

Shortcut Action
Enter Send message
Shift + Enter New line
Click outside Close chat

🔌 API Integration

WebSocket Protocol

```json
{
  "chatId": "chat_TIMESTAMP",
  "appId": "word-almost",
  "systemPrompt": "Conversation context...",
  "message": "User input",
  "stream": true
}
```

Response Handling

· Streaming: Real-time text chunks
· JSON: Structured responses
· Completion: [DONE] marker
· Error: Fallback messages

🌐 Browser Support

Browser Version Status
Chrome 58+ ✅ Full Support
Firefox 52+ ✅ Full Support
Safari 10.1+ ✅ Full Support
Edge 16+ ✅ Full Support
iOS Safari 10.3+ ✅ Full Support
Android Chrome 67+ ✅ Full Support

🛠️ Development

Setup for Development

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-chat-widget.git
cd ai-chat-widget

# Open in browser
open index.html

# Or serve locally
python -m http.server 8000
```

Testing

```javascript
// Manual test in browser console
window.testAIChat();  // Sends test message

// Check connection status
console.log('WebSocket:', ws?.readyState);  // 1 = connected

// Force reconnect
connectWebSocket();
```

Extracting CSS/JS (Optional)

To separate concerns:

```bash
# Extract CSS
sed -n '/<style>/,/<\/style>/p' index.html > assets/styles.css

# Extract JavaScript
sed -n '/<script>/,/<\/script>/p' index.html > assets/script.js
```

🐛 Troubleshooting

Common Issues

Issue Solution
Widget not appearing Check browser console, verify DOM loading
WebSocket connection failed Check network, verify endpoint URL
Messages not sending Verify WebSocket state, check input field
No AI responses Check backend service, review WebSocket logs

Debug Mode

Enable console logging by default. Check for:

```
🚀 AI Chat Widget Loading...
✅ AI Chat Widget Initialized
🔗 WebSocket connected
📤 Sending message to AI
```

Connection Status Indicators

· 🟢 Connected: Green pulsing dot
· 🟡 Connecting: Yellow pulsing dot
· 🔴 Disconnected: Red static dot

📱 Mobile Support

· Touch Events: Full support for mobile devices
· Responsive Design: Adapts to screen sizes
· Virtual Keyboard: Auto-focus and resizing
· Touch-friendly: Large tap targets

🔒 Security

· Secure Connection: WebSocket over WSS (TLS)
· No Data Storage: Messages not persisted locally
· Input Sanitization: Basic XSS protection
· No Cookies: Privacy-focused design

📊 Performance

Optimizations

· Lazy WebSocket connection
· Efficient DOM updates with innerHTML
· Event delegation for message tools
· Debounced textarea resizing
· Clean timer management

Memory Management

· Message history limit
· Proper WebSocket cleanup
· Event listener removal
· DOM element cleanup

📝 License

Proprietary Software – © SAMITECH CORPORATION

This software is proprietary and confidential. Unauthorized copying, transfer, or reproduction is prohibited.

🤝 Support

For technical issues:

1. Check browser console for errors
2. Verify WebSocket endpoint is accessible
3. Review network tab in DevTools
4. Contact: [Your Support Contact]

🔄 Version History

Version Date Changes
1.0.0 2024-01-01 Initial release
  WebSocket integration
  Theme toggle
  Mobile responsiveness

🎯 Roadmap

· Voice input support
· File attachment capability
· Multiple language support
· Custom AI model integration
· Analytics dashboard
· Chat export feature

---

<div align="center">

⭐ Star this repo if you find it useful!

Built with ❤️ by SAMITECH CORPORATION

Report Bug · Request Feature

</div>
