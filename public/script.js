// This function runs once the entire HTML page is loaded and ready.
document.addEventListener('DOMContentLoaded', () => {

    // --- Basic Setup ---
    const socket = io(); // Connect to our Socket.IO server
    const form = document.getElementById('chat-form');
    const input = document.getElementById('msg');
    const messagesContainer = document.querySelector('.chat-messages');

    // --- User Identification ---
    // We need a way to know who is who. Since we don't have logins,
    // we'll create a random unique ID for each user and store it in their browser.
    let userId = localStorage.getItem('chatUserId');
    if (!userId) {
        // If no ID is found, create a new one and save it.
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('chatUserId', userId);
    }

    // --- Functions to Update the UI ---

    // This function creates a new chat bubble and adds it to the screen.
    function displayChatMessage({ sender, message, time, is_outgoing }) {
        const messageElement = document.createElement('div');
        const messageType = is_outgoing ? 'outgoing' : 'incoming';
        messageElement.classList.add('message', messageType);

        // Format the timestamp to be readable (e.g., "11:52 PM")
        const timeString = new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        let messageHTML = '';
        if (messageType === 'incoming') {
            messageHTML = `<img src="https://i.pravatar.cc/50?u=${sender}" alt="Avatar"><div class="message-content"><span class="name">${sender}</span><p>${message}</p><span class="time">${timeString}</span></div>`;
        } else {
            messageHTML = `<div class="message-content"><p>${message}</p><span class="time">${timeString} <i class="fas fa-check-double checkmark"></i></span></div>`;
        }
        
        messageElement.innerHTML = messageHTML;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll to the latest message
    }

    // This function adds the "Anonymous" message to the fixed footer.
    function displaySystemMessage(text) {
        const systemMessageContainer = document.querySelector('.system-message-footer');
        if (systemMessageContainer) {
            systemMessageContainer.innerHTML = `<i class="fas fa-user-secret"></i> ${text} <i class="fas fa-user-secret"></i>`;
        }
    }

    // --- Event Listeners ---

    // Listen for the form being submitted.
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop the page from reloading
        if (input.value) {
            // Package up the message data to send to the server.
            const messageData = {
                sender: 'Anonymous',
                message: input.value,
                time: new Date(),
                senderId: userId // Include our unique ID
            };

            // Display the message on our own screen immediately.
            displayChatMessage({ ...messageData, is_outgoing: true });
            
            // Send the message to the server to be saved and broadcast.
            socket.emit('chat message', messageData);
            
            input.value = ''; // Clear the input box
        }
    });

    // Listen for the server sending us the chat history.
    socket.on('load old messages', (msgs) => {
        msgs.forEach(msg => {
            displayChatMessage({
                sender: msg.sender_name,
                message: msg.message_text,
                time: msg.created_at,
                // Check if the message's saved ID matches our ID to decide if it's "outgoing".
                is_outgoing: msg.sender_id === userId
            });
        });
    });

    // Listen for a new message broadcast from the server.
    socket.on('chat message', (data) => {
        // Only display the message if it's from someone else.
        if (data.senderId !== userId) {
            displayChatMessage({ ...data, is_outgoing: false });
        }
    });

    // --- Initial Call ---
    // Display the system message in the footer when the app first loads.
    displaySystemMessage("Now you're appearing as Anonymous!");
});