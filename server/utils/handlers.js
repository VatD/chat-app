const { generateMessage } = require("./messages");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users.js");

const onJoin = (io, socket, data, callback) => {
    const { error, ...user } = addUser({ id: socket.id, ...data });

    if (error) return callback({ error });

    callback({ user });

    socket.join(user.room);
    socket.emit("MESSAGE", generateMessage("Chat App", "Welcome!"));
    socket.broadcast
        .to(user.room)
        .emit(
            "MESSAGE",
            generateMessage(
                "Chat App",
                `${user.username.toUpperCase()} has joined!`
            )
        );
    io.to(user.room).emit("ROOM_DATA", getUsersInRoom(user.room));
};

const onSendMessage = (io, socket, message, callback) => {
    const user = getUser(socket.id);
    if (!user) return;
    io.to(user.room).emit("MESSAGE", generateMessage(user.username, message));
    callback();
};

const onDisconnect = (io, socket) => {
    const user = removeUser(socket.id);

    if (user) {
        io.to(user.room).emit(
            "MESSAGE",
            generateMessage(
                "Chat App",
                `${user.username.toUpperCase()} has left.`
            )
        );
        io.to(user.room).emit("ROOM_DATA", {
            room: user.room,
            users: getUsersInRoom(user.room),
        });
    }
};

module.exports = {
    onJoin,
    onSendMessage,
    onDisconnect,
};
