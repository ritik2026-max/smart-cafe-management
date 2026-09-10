import { auth } from "../firebase/firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";


onAuthStateChanged(auth, (user) => {

    if (!user) {

        console.warn(
            "🔒 Admin not logged in. Redirecting..."
        );

        window.location.href =
            "login.html";

        return;
    }


    console.log(
        "✅ Admin authenticated:",
        user.email
    );

});