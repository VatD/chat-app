const users = new Map();

const addUser = ({ id, username, room }) => {
    if (!user || !room) return { error: "username or string not provided" };

    username = username.trim().toLowerCase().substring(0, 15);
    room = room.trim().toLowerCase().substring(0, 15);

    for (let val of users.values()) {
        if (val.username === username && val.room === room)
            return { error: "username in use" };
    }

    users.set(id, { username, room });
    const user = { id, username, room };
    return user;
};

const removeUser = (id) => {
    const user = users.get(id);
    users.delete(id);
    return user;
};

const getUser = (id) => users.get(id);

const getUsersInRoom = (room) => {
    let roomUsers = [];
    for (let [key, val] of users.entries()) {
        if (val.room === room) roomUsers.push({ id: key, ...val });
    }
    return roomUsers;
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
};
