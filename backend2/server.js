const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const { setupSocketHandlers } = require('./sockets/handlers');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

setupSocketHandlers(io);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});