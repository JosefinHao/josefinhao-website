// AI Chat Widget JavaScript
class ChatWidget {
    constructor() {
        this.chatContainer = null;
        this.chatMessages = null;
        this.chatInput = null;
        this.sendButton = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.chatContainer = document.getElementById('chatWidgetContainer');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('chatSendBtn');

        // Add event listeners
        document.getElementById('chatWidgetBtn').addEventListener('click', () => this.toggleChat());
        document.getElementById('chatCloseBtn').addEventListener('click', () => this.closeChat());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Add welcome message
        this.addBotMessage("Hi! I'm Josefin. Feel free to ask me anything about my work, projects, or background!");
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        this.chatContainer.classList.add('open');
        this.isOpen = true;
        this.chatInput.focus();
    }

    closeChat() {
        this.chatContainer.classList.remove('open');
        this.isOpen = false;
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addUserMessage(message);
        this.chatInput.value = '';

        // Disable send button and show typing indicator
        this.sendButton.disabled = true;
        this.showTypingIndicator();

        try {
            // Call backend API
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();

            // Remove typing indicator
            this.removeTypingIndicator();

            // Add bot response
            if (data.response) {
                this.addBotMessage(data.response);
            } else {
                this.addBotMessage("I'm sorry, I couldn't process that request. Please try again.");
            }
        } catch (error) {
            console.error('Chat error:', error);
            this.removeTypingIndicator();
            this.addBotMessage("Sorry, I'm having trouble connecting right now. Please try again later or contact me directly via the contact form.");
        } finally {
            this.sendButton.disabled = false;
        }
    }

    addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user';
        messageDiv.innerHTML = `
            <div class="message-bubble">${this.escapeHtml(text)}</div>
            <div class="message-time">${this.getCurrentTime()}</div>
        `;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addBotMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot';
        messageDiv.innerHTML = `
            <div class="message-bubble">${this.escapeHtml(text)}</div>
            <div class="message-time">${this.getCurrentTime()}</div>
        `;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addBotMessageWithTyping(text) {
        // Create message container
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message bot';

        const messageBubble = document.createElement('div');
        messageBubble.className = 'message-bubble';
        messageBubble.textContent = ''; // Start empty

        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = this.getCurrentTime();

        messageDiv.appendChild(messageBubble);
        messageDiv.appendChild(timeDiv);
        this.chatMessages.appendChild(messageDiv);

        // Typing animation - word by word
        const words = text.split(' ');
        let currentIndex = 0;

        const typeWord = () => {
            if (currentIndex < words.length) {
                if (currentIndex > 0) {
                    messageBubble.textContent += ' ';
                }
                messageBubble.textContent += words[currentIndex];
                currentIndex++;
                this.scrollToBottom();

                // Random delay between 50-100ms per word for natural typing feel
                const delay = Math.random() * 50 + 50;
                setTimeout(typeWord, delay);
            }
        };

        typeWord();
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        this.chatMessages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize chat widget when page loads
const chatWidget = new ChatWidget();
