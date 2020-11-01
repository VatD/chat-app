const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require("path");

const { sendMessage } = require("./utils/events");
const { onJoin, onSendMessage, onDisconnect } = require("./utils/handlers");

app.use(express.static(path.join(__dirname, "../client")));

app.get("/", (req, res) => {
    res.send("index.html");
});

io.on("connection", (socket) => {
    socket.on("join", onJoin);
    socket.on(sendMessage, onSendMessage);
    socket.on("disconnect", onDisconnect);
});

server.listen(process.env.PORT || 3000, () =>
    console.log(`listening on port ${process.env.PORT || 3000}`)
);
