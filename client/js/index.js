const [usernameInput, roomInput] = document.querySelectorAll("input");

const validate = (user) => true;

const redirect = () => {
    let redirectURL = window.location.href;
    redirectURL = redirectURL.split("?")[0] + "chat.html";
    window.location.href = redirectURL;
};

const persistData = (user) => {
    sessionStorage.setItem("username", user.username);
    sessionStorage.setItem("room", user.room);
};

const formSubmit = (e) => {
    e.preventDefault();

    const user = {
        username: usernameInput.value,
        room: roomInput.value,
    };

    const isValid = validate(user);

    if (!isValid) return;

    persistData(user);

    redirect();
};

document.querySelector(".form").onsubmit = formSubmit;
