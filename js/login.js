import { auth } from "../firebase/firebase.js";

import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";


// =========================================
// ELEMENTS
// =========================================

const loginBtn =
    document.getElementById("loginBtn");

const forgotPasswordBtn =
    document.getElementById(
        "forgotPasswordBtn"
    );

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const errorElement =
    document.getElementById("error");

const messageElement =
    document.getElementById("message");


// =========================================
// CLEAR MESSAGES
// =========================================

function clearMessages() {

    errorElement.innerText = "";

    messageElement.innerText = "";

}


// =========================================
// LOGIN
// =========================================

loginBtn.addEventListener(
    "click",
    async () => {

        clearMessages();


        const email =
            emailInput.value
                .trim()
                .toLowerCase();

        const password =
            passwordInput.value;


        // =================================
        // VALIDATION
        // =================================

        if (
            email === "" ||
            password === ""
        ) {

            errorElement.innerText =
                "Please enter email and password.";

            return;

        }


        try {

            loginBtn.disabled = true;

            loginBtn.innerText =
                "Logging in...";


            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            console.log(
                "✅ Admin login successful:",
                email
            );


            window.location.href =
                "dashboard.html";

        }


        catch (error) {

            console.error(
                "❌ Login Error:",
                error
            );


            loginBtn.disabled = false;

            loginBtn.innerText =
                "🔐 Login";


            if (
                error.code ===
                "auth/invalid-credential"
            ) {

                errorElement.innerText =
                    "❌ Invalid email or password.";

            }

            else if (
                error.code ===
                "auth/user-not-found"
            ) {

                errorElement.innerText =
                    "❌ No account found with this email.";

            }

            else if (
                error.code ===
                "auth/wrong-password"
            ) {

                errorElement.innerText =
                    "❌ Incorrect password.";

            }

            else if (
                error.code ===
                "auth/too-many-requests"
            ) {

                errorElement.innerText =
                    "⚠️ Too many attempts. Please try again later.";

            }

            else {

                errorElement.innerText =
                    "❌ Login failed. Please try again.";

            }

        }

    }
);


// =========================================
// FORGOT PASSWORD
// =========================================

forgotPasswordBtn.addEventListener(
    "click",
    async () => {

        clearMessages();


        const email =
            emailInput.value
                .trim()
                .toLowerCase();


        // =================================
        // EMAIL REQUIRED
        // =================================

        if (email === "") {

            errorElement.innerText =
                "Please enter your admin email first.";

            emailInput.focus();

            return;

        }


        // =================================
        // EMAIL FORMAT
        // =================================

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(email)
        ) {

            errorElement.innerText =
                "Please enter a valid email address.";

            emailInput.focus();

            return;

        }


        try {

            forgotPasswordBtn.disabled =
                true;

            forgotPasswordBtn.innerText =
                "Sending reset link...";


            await sendPasswordResetEmail(
                auth,
                email
            );


            console.log(
                "✅ Password reset email sent to:",
                email
            );


            messageElement.innerText =
                "✅ Password reset link sent! Check your email inbox.";


            passwordInput.value = "";

        }


        catch (error) {

            console.error(
                "❌ Password Reset Error:",
                error
            );


            if (
                error.code ===
                "auth/user-not-found"
            ) {

                errorElement.innerText =
                    "❌ No account found with this email.";

            }

            else if (
                error.code ===
                "auth/invalid-email"
            ) {

                errorElement.innerText =
                    "❌ Invalid email address.";

            }

            else if (
                error.code ===
                "auth/too-many-requests"
            ) {

                errorElement.innerText =
                    "⚠️ Too many requests. Please try again later.";

            }

            else {

                errorElement.innerText =
                    "❌ Password reset failed. Please try again.";

            }

        }

        finally {

            forgotPasswordBtn.disabled =
                false;

            forgotPasswordBtn.innerText =
                "Forgot Password?";

        }

    }
);