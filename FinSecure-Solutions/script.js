document.addEventListener("DOMContentLoaded", () => {
    const $ = (id) => document.getElementById(id);

    const authSection = $("authSection");
    const dashboardSection = $("dashboardSection");
    const registerForm = $("registerForm");
    const loginForm = $("loginForm");

    function message(id, text) {
        $(id).textContent = text;
    }

    async function api(url, options = {}) {
        const response = await fetch(url, {
            credentials: "same-origin",
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            }
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(
                data.message || `Request failed (${response.status})`
            );
        }

        return data;
    }

    function showRegister() {
        registerForm.hidden = false;
        loginForm.hidden = true;
        $("showRegister").classList.add("active");
        $("showLogin").classList.remove("active");
        message("loginMessage", "");
    }

    function showLogin() {
        registerForm.hidden = true;
        loginForm.hidden = false;
        $("showLogin").classList.add("active");
        $("showRegister").classList.remove("active");
        message("registerMessage", "");
    }

    $("showRegister").addEventListener("click", showRegister);
    $("showLogin").addEventListener("click", showLogin);

    // REGISTER
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = $("registerUsername").value.trim();
        const password = $("registerPassword").value;
        const confirmPassword = $("confirmPassword").value;

        if (password !== confirmPassword) {
            message("registerMessage", "Passwords do not match.");
            return;
        }

        message("registerMessage", "Registering...");

        try {
            const data = await api("/api/register", {
                method: "POST",
                body: JSON.stringify({
                    username,
                    password,
                    confirmPassword
                })
            });

            registerForm.reset();
            showLogin();
            $("loginUsername").value = username;

            message("loginMessage", data.message);
        } catch (error) {
            message("registerMessage", error.message);
            console.error("Registration error:", error);
        }
    });

    function openDashboard(data) {
        authSection.hidden = true;
        dashboardSection.hidden = false;

        $("welcomeMessage").textContent =
            `Welcome, ${data.user.username}!`;
    }

    async function loadDashboard() {
        try {
            const data = await api("/api/dashboard");
            openDashboard(data);
        } catch {
            dashboardSection.hidden = true;
            authSection.hidden = false;
            showRegister();
        }
    }

    // LOGIN
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const username = $("loginUsername").value.trim();
        const password = $("loginPassword").value;

        message("loginMessage", "Logging in...");

        try {
            await api("/api/login", {
                method: "POST",
                body: JSON.stringify({ username, password })
            });

            loginForm.reset();
            await loadDashboard();
        } catch (error) {
            message("loginMessage", error.message);
            console.error("Login error:", error);
        }
    });

    // XSS-SAFETY DEMONSTRATION
    $("commentForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const comment = $("comment").value;
        message("commentMessage", "Submitting...");

        try {
            const data = await api("/api/comment", {
                method: "POST",
                body: JSON.stringify({ comment })
            });

            message("commentMessage", data.message);

            // Never interpret untrusted user input as HTML.
            $("commentOutput").textContent = data.comment;
            $("comment").value = "";
        } catch (error) {
            message("commentMessage", error.message);
        }
    });

    // LOGOUT
    $("logoutButton").addEventListener("click", async () => {
        try {
            const data = await api("/api/logout", {
                method: "POST",
                body: JSON.stringify({})
            });

            dashboardSection.hidden = true;
            authSection.hidden = false;
            showRegister();
            message("registerMessage", data.message);
        } catch (error) {
            alert(error.message);
        }
    });

    // Check whether a valid session already exists.
    loadDashboard();
});