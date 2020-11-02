const users = new Map();

const addUser = ({ id, username, room }) => {
    if (!username || !room) return { error: "username and room required" };

    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

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
