const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const path = require("path");

const { onJoin, onSendMessage, onDisconnect } = require("./utils/handlers");

const dir = process.env.NODE_ENV === "production" ? "public" : "client";
app.use(express.static(path.join(__dirname, `../${dir}`)));

app.get("/", (req, res) => res.send());

app.get("*", (req, res) => res.redirect("/"));

io.on("connection", (socket) => {
    socket.on("join", (data, callback) => onJoin(io, socket, data, callback));
    socket.on("SEND_MESSAGE", (message, callback) =>
        onSendMessage(io, socket, message, callback)
    );
    socket.on("disconnect", () => onDisconnect(io, socket));
});

server.listen(process.env.PORT || 3000, () =>
    console.log(`listening on port ${process.env.PORT || 3000}`)
);
