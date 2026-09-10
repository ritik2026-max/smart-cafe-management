// =========================================
// FIREBASE CONFIGURATION
// Sky House Cafe
// =========================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";


// =========================================
// FIREBASE CONFIG
// =========================================

const firebaseConfig = {

    apiKey:
        "AIzaSyBo3IxUHJV30zorveaDF4J97yrqzPaTnY0",

    authDomain:
        "sky-house-cafe.firebaseapp.com",

    projectId:
        "sky-house-cafe",

    storageBucket:
        "sky-house-cafe.firebasestorage.app",

    messagingSenderId:
        "836884084879",

    appId:
        "1:836884084879:web:627fe815a4696d0c3f18fa",

    measurementId:
        "G-HB6NKRXGYW"

};


// =========================================
// INITIALIZE FIREBASE
// =========================================

const app =
    initializeApp(firebaseConfig);


// =========================================
// FIRESTORE
// =========================================

const db =
    getFirestore(app);


// =========================================
// AUTHENTICATION
// =========================================

const auth =
    getAuth(app);


// =========================================
// EXPORT
// =========================================

export {
    db,
    auth
};