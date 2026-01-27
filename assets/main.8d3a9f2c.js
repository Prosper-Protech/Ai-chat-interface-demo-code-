// ============================
// AI CHAT VERSION
// ============================

// Debug logging
console.log('🚀 AI Chat Widget Loading...');

// Global variables
let open = false;
let ws = null;
let isProcessing = false;
let typingEl = null;
let currentChatId = 'chat_' + Date.now();
let currentAIResponse = null;
let responseComplete = true;
let conversationHistory = [];

// DOM elements - will be initialized after DOM loads
let box, messages, input, sendBtn, statusDot, statusText, aiBubble, closeBtn, themeToggle;

// Initialize everything when DOM is ready
function initializeChat() {
    console.log('🔄 Initializing AI Chat Widget...');
    
    // Get DOM elements
    box = document.getElementById('aiBox');
    messages = document.getElementById('messages');
    input = document.getElementById('input');
    sendBtn = document.getElementById('sendBtn');
    statusDot = document.getElementById('statusDot');
    statusText = document.getElementById('statusText');
    aiBubble = document.getElementById('aiBubble');
    closeBtn = document.getElementById('closeBtn');
    themeToggle = document.getElementById('themeToggle');
    
    // Debug element existence
    console.log('📋 Elements found:', {
        box: !!box,
        messages: !!messages,
        input: !!input,
        sendBtn: !!sendBtn,
        statusDot: !!statusDot,
        statusText: !!statusText,
        aiBubble: !!aiBubble,
        closeBtn: !!closeBtn,
        themeToggle: !!themeToggle
    });
    
    // Add initial welcome message
    addMsg('ai', 'Hello! I\'m your AI Support Assistant from SAMITECH CORPORATION. How can I help you today?');
    conversationHistory.push({
        role: 'assistant',
        content: 'Hello! I\'m your AI Support Assistant from SAMITECH CORPORATION. How can I help you today?'
    });
    
    // Set up event listeners
    setupEventListeners();
    
    console.log('✅ AI Chat Widget Initialized Successfully');
}

function setupEventListeners() {
    console.log('🔗 Setting up event listeners...');
    
    // Bubble click - OPEN CHAT
    if (aiBubble) {
        aiBubble.addEventListener('click', function(e) {
            console.log('🎯 Bubble clicked! Opening chat...');
            e.stopPropagation();
            openChat();
        });
        
        // Add touch event for mobile
        aiBubble.addEventListener('touchstart', function(e) {
            console.log('📱 Touch event on bubble');
            e.preventDefault();
            openChat();
        }, { passive: false });
    } else {
        console.error('❌ aiBubble element not found!');
    }
    
    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            console.log('❌ Close button clicked');
            e.stopPropagation();
            closeChat();
        });
    }
    
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleTheme();
        });
    }
    
    // Send button
    if (sendBtn) {
        sendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            sendMsg();
        });
    }
    
    // Input enter key
    if (input) {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMsg();
            }
        });
        
        // Auto-resize
        input.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });
    }
    
    // Close chat when clicking outside
    document.addEventListener('click', function(e) {
        if (open && box && !box.contains(e.target) && aiBubble && !aiBubble.contains(e.target)) {
            console.log('👆 Clicked outside, closing chat');
            closeChat();
        }
    });
    
    // Prevent closing when clicking inside chat
    if (box) {
        box.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    console.log('✅ Event listeners set up');
}

function openChat() {
    console.log('📖 Opening chat...');
    
    if (open) {
        console.log('⚠️ Chat already open');
        return;
    }
    
    open = true;
    
    // Show chat box with animation
    if (box) {
        box.classList.add('open');
        console.log('✅ Chat box displayed');
        
        // Focus input after animation
        setTimeout(() => {
            if (input) {
                input.focus();
                console.log('🎯 Input focused');
            }
        }, 300);
    } else {
        console.error('❌ Chat box element not found!');
    }
    
    // Connect WebSocket
    connectWebSocket();
    
    console.log('🚪 Chat opened successfully');
}

function closeChat() {
    console.log('📕 Closing chat...');
    
    if (!open) {
        console.log('⚠️ Chat already closed');
        return;
    }
    
    open = false;
    
    // Hide chat box with animation
    if (box) {
        box.classList.remove('open');
        
        // Wait for animation then hide
        setTimeout(() => {
            if (box && !open) {
                box.style.display = 'none';
            }
        }, 300);
    }
    
    // Close WebSocket
    if (ws) {
        ws.close();
        ws = null;
        console.log('🔌 WebSocket closed');
    }
    
    console.log('🚪 Chat closed successfully');
}

function toggleChat() {
    console.log('🔄 Toggling chat state');
    if (open) {
        closeChat();
    } else {
        openChat();
    }
}

function toggleTheme() {
    document.body.classList.toggle('light');
    const icon = themeToggle.querySelector('i');
    if (icon) {
        icon.className = document.body.classList.contains('light') ? 'fa fa-sun' : 'fa fa-moon';
    }
    console.log('🎨 Theme toggled');
}

function connectWebSocket() {
    console.log('🔗 Connecting WebSocket...');
    
    if (ws && ws.readyState === WebSocket.OPEN) {
        console.log('✅ WebSocket already connected');
        updateStatus('Connected', 'connected');
        return;
    }
    
    updateStatus('Connecting...', 'connecting');
    
    try {
        ws = new WebSocket('wss://backend.buildpicoapps.com/api/chatbot/chat');
        
        ws.onopen = () => {
            console.log('✅ WebSocket connected successfully');
            updateStatus('Connected', 'connected');
        };
        
        ws.onmessage = (event) => {
            handleWebSocketMessage(event.data);
        };
        
        ws.onclose = (event) => {
            console.log('🔌 WebSocket closed');
            updateStatus('Disconnected', 'disconnected');
            ws = null;
            
            if (open) {
                setTimeout(() => {
                    connectWebSocket();
                }, 3000);
            }
        };
        
        ws.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
            updateStatus('Connection Error', 'disconnected');
        };
        
    } catch (error) {
        console.error('❌ Failed to create WebSocket:', error);
        updateStatus('Failed to connect', 'disconnected');
    }
}

function updateStatus(text, status) {
    if (statusText && statusDot) {
        statusText.textContent = text;
        statusDot.className = 'status-dot ' + status;
    }
}

function handleWebSocketMessage(data) {
    if (!data || data.trim() === '') return;
    
    if (data === '[DONE]' || data === '[END]' || data === '[COMPLETE]') {
        console.log('✅ Response complete');
        responseComplete = true;
        isProcessing = false;
        hideTyping();
        if (sendBtn) sendBtn.disabled = false;
        return;
    }
    
    try {
        if (data.startsWith('{') || data.startsWith('[')) {
            const jsonData = JSON.parse(data);
            
            if (jsonData.message || jsonData.response) {
                const fullResponse = jsonData.message || jsonData.response;
                hideTyping();
                addMsg('ai', fullResponse);
                
                conversationHistory.push({
                    role: 'assistant',
                    content: fullResponse
                });
                
                if (conversationHistory.length > 20) {
                    conversationHistory = conversationHistory.slice(-20);
                }
                
                responseComplete = true;
                isProcessing = false;
                if (sendBtn) sendBtn.disabled = false;
                return;
            }
        }
    } catch (e) {
        // Not JSON
    }
    
    if (responseComplete) {
        responseComplete = false;
        hideTyping();
        currentAIResponse = addMsg('ai', data);
    } else {
        if (currentAIResponse) {
            const bubble = currentAIResponse.querySelector('.bubble');
            const currentText = bubble.innerText || bubble.textContent;
            bubble.innerHTML = formatText(currentText + data);
            messages.scrollTop = messages.scrollHeight;
        }
    }
    
    const trimmedData = data.trim();
    if (trimmedData.endsWith('.') || trimmedData.endsWith('?') || trimmedData.endsWith('!')) {
        clearTimeout(window.responseCompleteTimer);
        window.responseCompleteTimer = setTimeout(() => {
            if (!responseComplete && currentAIResponse) {
                const fullResponse = currentAIResponse.querySelector('.bubble').innerText;
                conversationHistory.push({
                    role: 'assistant',
                    content: fullResponse
                });
                
                if (conversationHistory.length > 20) {
                    conversationHistory = conversationHistory.slice(-20);
                }
                
                responseComplete = true;
                isProcessing = false;
                hideTyping();
                if (sendBtn) sendBtn.disabled = false;
            }
        }, 1500);
    }
}

function sendMsg() {
    const text = input.value.trim();
    if (!text || isProcessing || !input) return;
    
    responseComplete = true;
    currentAIResponse = null;
    
    addMsg('user', text);
    input.value = '';
    input.style.height = 'auto';
    
    conversationHistory.push({
        role: 'user',
        content: text
    });
    
    if (conversationHistory.length > 20) {
        conversationHistory = conversationHistory.slice(-20);
    }
    
    isProcessing = true;
    if (sendBtn) sendBtn.disabled = true;
    
    showTyping();
    
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.log('🔌 WebSocket not ready');
        connectWebSocket();
        
        setTimeout(() => {
            if (ws && ws.readyState === WebSocket.OPEN) {
                sendMessageToAI(text);
            } else {
                hideTyping();
                addMsg('ai', "I'm connecting... Please wait a moment.");
                isProcessing = false;
                if (sendBtn) sendBtn.disabled = false;
            }
        }, 1500);
    } else {
        sendMessageToAI(text);
    }
}

function sendMessageToAI(text) {
    try {
        let conversationContext = "";
        conversationHistory.forEach((msg) => {
            const role = msg.role === 'user' ? 'User' : 'Assistant';
            conversationContext += `${role}: ${msg.content}\n\n`;
        });
        
        const systemPrompt = `You are AI Support from SAMITECH CORPORATION. Remember our conversation and provide helpful responses.

Conversation History:
${conversationContext}

User: ${text}

Assistant:`;
        
        const payload = {
            chatId: currentChatId,
            appId: 'word-almost',
            systemPrompt: systemPrompt,
            message: text,
            stream: true
        };
        
        console.log('📤 Sending message to AI');
        ws.send(JSON.stringify(payload));
        
        clearTimeout(window.responseTimeout);
        window.responseTimeout = setTimeout(() => {
            if (isProcessing) {
                console.log('⏰ Response timeout');
                hideTyping();
                isProcessing = false;
                responseComplete = true;
                if (sendBtn) sendBtn.disabled = false;
            }
        }, 25000);
        
    } catch (error) {
        console.error('❌ Error sending message:', error);
        hideTyping();
        addMsg('ai', "Sorry, I encountered an error. Please try again.");
        isProcessing = false;
        if (sendBtn) sendBtn.disabled = false;
    }
}

function addMsg(type, text) {
    if (!messages) return null;
    
    const div = document.createElement('div');
    div.className = 'msg ' + type;
    
    const avatarSrc = type === 'ai' 
        //ai icon verify
        ? 'https://firebasestorage.googleapis.com/v0/b/i-to-u.appspot.com/o/publicimage%2F1001358726.png?alt=media&token=92643a01-a1c5-4a3b-9015-5fc6542688fc'
        //user icon verify
        : 'https://firebasestorage.googleapis.com/v0/b/i-to-u.appspot.com/o/publicimage%2F1001358781.png?alt=media&token=b9e86f33-9ed0-404f-8506-b679ff12a5a6';
    
    const time = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const formattedText = formatText(text);
    
    div.innerHTML = `
        ${type === 'ai' ? `<img class="avatar" src="${avatarSrc}" alt="AI">` : ''}
        <div class="msg-content">
            <div class="bubble">${formattedText}</div>
            <div class="msg-tools">
                <span onclick="copyMsg(this)"><i class="fa fa-copy"></i></span>
                <span onclick="editMsg(this)"><i class="fa fa-pen"></i></span>
                <span onclick="deleteMsg(this)"><i class="fa fa-trash"></i></span>
                <span onclick="shareMsg(this)"><i class="fa fa-share-nodes"></i></span>
                <span style="margin-left:5px;font-size:10px;color:#888;">${time}</span>
            </div>
        </div>
        ${type === 'user' ? `<img class="avatar" src="${avatarSrc}" alt="User">` : ''}
    `;
    
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    
    if (type === 'ai') {
        currentAIResponse = div;
    }
    
    return div;
}

function formatText(text) {
    if (!text) return '';
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
}

function showTyping() {
    hideTyping();
    
    if (!messages) return;
    
    typingEl = document.createElement('div');
    typingEl.className = 'msg ai';
    typingEl.id = 'typingIndicator';
    typingEl.innerHTML = `
        <img class="avatar" src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png" alt="AI">
        <div class="msg-content">
            <div class="bubble">
                <div class="typing">
                    <div class="wave"></div>
                    <div class="wave"></div>
                    <div class="wave"></div>
                </div>
            </div>
        </div>
    `;
    messages.appendChild(typingEl);
    messages.scrollTop = messages.scrollHeight;
}

function hideTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) {
        typing.remove();
    }
    typingEl = null;
}

function copyMsg(el) {
    const text = el.closest('.msg').querySelector('.bubble').innerText;
    navigator.clipboard.writeText(text);
    const original = el.innerHTML;
    el.innerHTML = '<i class="fa fa-check"></i>';
    setTimeout(() => el.innerHTML = original, 1000);
}

function editMsg(el) {
    const bubble = el.closest('.msg').querySelector('.bubble');
    const text = bubble.innerText;
    const newText = prompt('Edit message:', text);
    if (newText !== null) bubble.innerHTML = formatText(newText);
}

function deleteMsg(el) {
    if (confirm('Delete message?')) el.closest('.msg').remove();
}

function shareMsg(el) {
    const text = el.closest('.msg').querySelector('.bubble').innerText;
    if (navigator.share) {
        navigator.share({ title: 'AI Message', text: text });
    } else {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeChat);

// Also try to initialize after a short delay as fallback
setTimeout(() => {
    if (!box) {
        console.log('🔄 Retrying initialization...');
        initializeChat();
    }
}, 1000);

// Add manual test function to window
window.testAIChat = function() {
    console.log('🧪 Testing AI Chat...');
    if (!open) {
        openChat();
        setTimeout(() => {
            input.value = "Hello, is this working?";
            sendMsg();
        }, 1000);
    } else {
        input.value = "Test message";
        sendMsg();
    }
};

console.log('🎯 AI Chat Script Loaded - Ready for Vercel Deployment!');
