const redirectToRoot = () => {
    const currentRoomURL = window.location.href.split("/");
    currentRoomURL.pop();
    const redirectURL = currentRoomURL.reduce((acc, cur) => acc + cur);
    window.location.replace(redirectURL);
};

const getPersistedUser = () => {
    const username = sessionStorage.getItem("username");
    const room = sessionStorage.getItem("room");

    if (username && room) {
        const user = { username, room };
        return user;
    } else redirectToRoot();
};

console.log(getPersistedUser());
