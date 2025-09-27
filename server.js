// --- Imports ---
// We're bringing in the necessary libraries for our server.
const express = require('express');        // To create the web server
const http = require('http');              // To create the HTTP server
const socketIo = require('socket.io');     // For real-time communication (the chat part)
const mysql = require('mysql2');           // To talk to our MySQL database

// --- Initial Setup ---
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// This line tells our server to make the 'public' folder accessible to the web.
// This is how our index.html, style.css, and script.js files are served.
app.use(express.static('public'));

// --- Database Connection ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Kamal@2219',
    database: 'chatapp'
});

db.connect((err) => {
    if (err) {
        // If we can't connect to the database, log the error and stop the server.
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Successfully connected to the MySQL database!');
});

// --- Real-Time Chat Logic ---
// This block of code runs every time a new user opens the chat page.
io.on('connection', (socket) => {
    console.log('A user connected via WebSocket');

    // When a user first connects, load the chat history for them.
    db.query('SELECT * FROM messages ORDER BY created_at ASC', (err, messages) => {
        if (err) throw err;
        // Send the message history only to the user who just connected.
        socket.emit('load old messages', messages);
    });

    // When the server receives a 'chat message' from a user...
    socket.on('chat message', (data) => {
        // ...save that message to the database.
        const query = 'INSERT INTO messages (sender_name, message_text, is_outgoing, sender_id) VALUES (?, ?, ?, ?)';
        
        db.query(query, [data.sender, data.message, false, data.senderId], (err, result) => {
            if (err) throw err;

            // After saving, broadcast the message to all OTHER connected users.
            socket.broadcast.emit('chat message', data);
        });
    });

    // When a user closes the page, this will run.
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// --- Start the Server ---
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running! Open your browser to http://localhost:${PORT}`);
});