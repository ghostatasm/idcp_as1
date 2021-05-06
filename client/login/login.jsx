// Functionalities
const handleLogin = (e) => {
    e.preventDefault();

    const user = document.querySelector("#user");
    const pass = document.querySelector("#pass");
    if (user.value == '' || pass.value == '') {
        handleError('Username or password is empty');
        return false;
    }

    const loginForm = document.querySelector("#loginForm");
    sendRequest(loginForm.method, loginForm.action, serialize(loginForm), handleRedirect);

    return false;
};

const handleSignup = (e) => {
    e.preventDefault();

    const user = document.querySelector("#user");
    const pass = document.querySelector("#pass");
    const pass2 = document.querySelector("#pass2");

    if (user.value == '' || pass.value == '' || pass2.value == '') {
        handleError('All fields are required');
        return false;
    }

    if (pass.value !== pass2.value) {
        handleError('Passwords do not match');
        return false;
    }

    const signupForm = document.querySelector("#signupForm");
    sendRequest(signupForm.method, signupForm.action, serialize(signupForm), handleRedirect);

    return false;
};

// React Components
const LoginWindow = (props) => {
    return (
        <div id="login-window">
            <p id="error-display"></p>
            <form id="loginForm" name="loginForm" onSubmit={handleLogin} action="/login" method="POST">
                <label htmlFor="username">Username: </label>
                <input id="user" type="text" name="username" placeholder="username" autoComplete="on" />
                <label htmlFor="pass">Password: </label>
                <input id="pass" type="password" name="pass" placeholder="password" autoComplete="on" />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input type="submit" value="Login" />
            </form>
        </div>
    );
};

const SignupWindow = (props) => {
    return (
        <div id="signup-window">
            <p id="error-display"></p>
            <form id="signupForm" name="signupForm" onSubmit={handleSignup} action="/signup" method="POST">
                <label htmlFor="username">Username: </label>
                <input id="user" type="text" name="username" placeholder="username" autoComplete="on" />
                <label htmlFor="pass">Password: </label>
                <input id="pass" type="password" name="pass" placeholder="password" autoComplete="on" />
                <label htmlFor="pass2">Password: </label>
                <input id="pass2" type="password" name="pass2" placeholder="retype password" autoComplete="on" />
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input type="submit" value="Signup" />
            </form>
        </div>
    );
};

// React component factories
const createLoginWindow = () => {
    ReactDOM.render(
        <LoginWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

const createSignupWindow = () => {
    ReactDOM.render(
        <SignupWindow csrf={csrf} />,
        document.querySelector("#content")
    );
};

// Init
const init = () => {
    const loginButton = document.querySelector("#loginButton");
    const signupButton = document.querySelector("#signupButton");

    signupButton.addEventListener("click", (e) => {
        e.preventDefault();
        createSignupWindow();
        return false;
    });

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        createLoginWindow();
        return false;
    });

    // Default View
    createLoginWindow();
};