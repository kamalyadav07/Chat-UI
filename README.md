# Fun Friday Group - Real-Time Chat App 💬

A simple, real-time web chat application built from scratch with Node.js, Socket.IO, and MySQL. This project demonstrates a full-stack development process, featuring a frontend interface modeled after modern mobile messaging apps, a backend server to manage communication, and a database for message persistence.

---
## ✨ Features

* **Real-Time Messaging:** Instantly send and receive messages using WebSockets (Socket.IO).
* **Persistent Chat History:** All messages are saved to a MySQL database and loaded on connection.
* **Modern UI:** A clean, mobile-first interface with distinct incoming and outgoing message bubbles.
* **Anonymous User ID:** Uniquely identifies users in different browser tabs or sessions using `localStorage`.
* **UI Details:** Includes read-receipt checkmarks, timestamps, profile pictures, and system messages.

---
## 📸 Screenshot

![Chat App Screenshot](https://i.postimg.cc/RFJVX5T9/Screenshot-2025-09-30-112551.png)


---
## 💻 Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Backend:** Node.js, Express.js
* **Real-Time Communication:** Socket.IO
* **Database:** MySQL

---
## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You must have the following software installed:
* [Node.js](https://nodejs.org/) (which includes npm)
* [MySQL Server](https://dev.mysql.com/downloads/mysql/)

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/kamalyadav07/Chat-UI.git](https://github.com/kamalyadav07/Chat-UI.git)
    cd Chat-UI
    ```

2.  **Install backend dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the database:**
    * Open your MySQL client (like MySQL Workbench).
    * Run the following SQL script to create the database and table:
    ```sql
    -- Create the database
    CREATE DATABASE chatapp;

    -- Use the database
    USE chatapp;

    -- Create the messages table
    CREATE TABLE messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_name VARCHAR(50) NOT NULL,
        message_text TEXT NOT NULL,
        is_outgoing BOOLEAN NOT NULL,
        sender_id VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

4.  **Configure server credentials:**
    * Open the `server.js` file.
    * Find the `db.createConnection` block and update it with your MySQL password.
    ```javascript
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'YOUR_MYSQL_PASSWORD', // <-- IMPORTANT
        database: 'chatapp'
    });
    ```

5.  **Run the application:**
    ```bash
    node server.js
    ```
    The server will start, and you'll see a message: `Server is running! Open your browser to http://localhost:3000`

---
## ⚙️ Usage

To test the chat application, open two separate browser windows or tabs and navigate to `http://localhost:3000`. This will simulate a conversation between two different "anonymous" users. Messages are sent in real-time and will be saved to the database.

---
## 📜 License

This project is licensed under the MIT License.
