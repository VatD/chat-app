const { generateMessage } = require("./messages");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users.js");
const { message, roomData } = require("./events.js");

const onJoin = (data, callback) => {
    const { error, ...user } = addUser({ id: socket.id, ...data });

    if (error) return callback(error);

    socket.join(user.room);
    socket.emit(message, generateMessage("Chat App", "Welcome!"));
    socket.broadcast
        .to(user.room)
        .emit(
            message,
            generateMessage("Chat App", `${user.username} has joined!`)
        );
    io.to(user.room).emit(roomData, {
        room: user.room,
        users: getUsersInRoom(user.room),
    });

    callback();
};

const onSendMessage = (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(message, generateMessage(user.username, message));
    callback("delivered");
};

const onDisconnect = () => {
    const user = removeUser(socket.id);

    if (user) {
        io.to(user.room).emit(
            message,
            generateMessage("Chat App", `${user.username} has left.`)
        );
        io.to(user.room).emit(roomData, {
            room: user.room,
            users: getUsersInRoom(user.room),
        });
    }
};

exports.default = {
    onJoin,
    onSendMessage,
    onDisconnect,
};
