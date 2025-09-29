// frontend/js/login.js

// IMPORTANT: Set your backend API URL here
const API_BASE_URL = 'http://localhost:5000/api/auth'; // Adjust if your port/path is different

// ==========================================================
// LOGIN FORM SUBMISSION HANDLER
// ==========================================================
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // SUCCESS: Store the JWT and redirect the user
                
                // 1. Store the JWT (for authenticating future requests)
                localStorage.setItem("token", data.token);

                // 2. Redirect the user based on the URL sent from the backend
                // This will be /dashboard.html or /bond-setup.html based on isConfigured
                window.location.href = data.redirectUrl; 

            } else {
                // FAILURE: Display error message from the backend
                alert(data.message || "Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error('Login error:', error);
            alert("A network error occurred. Please try again.");
        }
    });
}

// ==========================================================
// SIGNUP FORM SUBMISSION HANDLER (Assumes signup form is on signup.html)
// ==========================================================
const signupForm = document.getElementById("signupForm"); 
if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value; // Assuming you have a 'name' input
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API_BASE_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // SUCCESS: Store the JWT and redirect the user
                
                // 1. Store the JWT
                localStorage.setItem("token", data.token);

                // 2. Redirect the user (Signup always redirects to bond-setup.html)
                window.location.href = data.redirectUrl; 

            } else {
                // FAILURE: Display error message (e.g., "User already exists")
                alert(data.message || "Signup failed.");
            }
        } catch (error) {
            console.error('Signup error:', error);
            alert("A network error occurred. Please try again.");
        }
    });
}
