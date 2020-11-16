// Socket.IO
const socket = io();

// User Data
let me;
let isSidebarOpen = false;

// DOM Elements
const $sidebar = document.querySelector(".sidebar");
const $toggleBtn = document.querySelector(".toggler");
const $roomName = document.querySelector(".room");
const $persons = document.querySelector(".persons");
const $messageForm = document.querySelector(".compose-message");
const $chats = document.querySelector(".chats");
const $input = document.querySelector("#message");
const $button = document.querySelector(".compose-message button");

// Redirect to home page
const redirectToRoot = () => {
    const currentRoomURL = window.location.href.split("/");
    currentRoomURL.pop();
    const redirectURL = currentRoomURL.reduce((acc, cur) => acc + cur);
    window.location.replace(redirectURL);
};

// Get user data from session storage and do validation
const getPersistedUser = () => {
    const username = sessionStorage.getItem("username");
    const room = sessionStorage.getItem("room");

    if (username && room) {
        const user = { username, room };
        return user;
    } else redirectToRoot();
};

// Connect the user to room
(() => {
    const user = getPersistedUser();

    socket.emit("join", user, ({ error, user }) => {
        if (error) {
            alert(error);
            redirectToRoot();
        }
        me = user;
        $roomName.innerText = user.room;
        document.title = `${user.room.toUpperCase()} | Chat App`;
    });
})();

// Toggling state of sidebar
const toggleSideBar = () => {
    isSidebarOpen = !isSidebarOpen;
    $toggleBtn.classList.toggle("toggler-clicked");
    $sidebar.classList.toggle("sidebar-show");
};

// Toggle sidebar
$toggleBtn.addEventListener("click", () => {
    toggleSideBar();
});

// Close sidebar on input focus
$input.addEventListener("focus", () => {
    if (isSidebarOpen) toggleSideBar();
});

// Create HTML for messages
const createMessageDiv = ({ username, text, createdAt }) => {
    const $div = document.createElement("div");
    const $h3 = document.createElement("h3");
    const $span = document.createElement("span");
    const $p = document.createElement("p");

    let date = new Date(createdAt);
    date = date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });

    $div.classList.add("chat");
    $h3.innerText = username;
    $span.innerText = date;
    $p.innerText = text;

    if (username === me.username) {
        $div.style.marginLeft = "auto";
        $div.style.marginRight = "1rem";
    }

    $div.append($h3);
    $div.append($span);
    $div.append($p);

    return $div;
};

// Automatic scrolling for the div
const autoScroll = () => {
    const $newChat = $chats.lastElementChild;

    // Height of chat including margins, paddings, border
    const newChatStyles = getComputedStyle($newChat);
    const newChatMargins = parseFloat(
        newChatStyles.marginBottom + newChatStyles.marginTop
    );
    const newChatHeight = $newChat.offsetHeight + Math.ceil(newChatMargins);

    // Scroll height - new message height
    const chatsScrollHeightwoNewChat = Math.ceil(
        $chats.scrollHeight - newChatHeight
    );

    // Scrolltop + container height
    const scrollOffset = Math.ceil($chats.scrollTop + $chats.offsetHeight);

    // If the scroll height of container is lesser than our scroll top offset
    // ie we have scrolled up a bit
    // then no auto scroll
    if (chatsScrollHeightwoNewChat <= scrollOffset + newChatHeight)
        $chats.scrollTop = $chats.scrollHeight;
};

// A new message from server
socket.on("MESSAGE", (message) => {
    const $messageDiv = createMessageDiv(message);
    $chats.append($messageDiv);
    autoScroll();
});

// Updates room information
socket.on("ROOM_DATA", (users) => {
    $persons.querySelectorAll("*").forEach((child) => child.remove());

    for (let i = 0; i < users.length; i++) {
        let user = users[i];

        if (user.id === me.id) continue;

        const $personDiv = document.createElement("div");
        $personDiv.classList.add("person");
        $personDiv.innerText = user.username;
        $personDiv.id = user.id;
        $persons.appendChild($personDiv);
    }
});

// Entering a message
$messageForm.onsubmit = (e) => {
    e.preventDefault();

    $button.setAttribute("disabled", "disabled");

    const message = $messageForm[0].value;
    if (!message) return;

    socket.emit("SEND_MESSAGE", message, () => {
        $button.removeAttribute("disabled");
        $messageForm[0].value = "";
        $messageForm[0].focus();
    });
};
