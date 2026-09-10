import { db } from "../firebase/firebase.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


// =========================================
// ELEMENTS
// =========================================

const cafeName =
    document.getElementById("cafeName");

const tagline =
    document.getElementById("tagline");

const mobile =
    document.getElementById("mobile");

const whatsapp =
    document.getElementById("whatsapp");

const address =
    document.getElementById("address");

const openingTime =
    document.getElementById("openingTime");

const closingTime =
    document.getElementById("closingTime");

const instagram =
    document.getElementById("instagram");

const website =
    document.getElementById("website");

const saveButton =
    document.getElementById("saveSettings");


// =========================================
// SETTINGS DOCUMENT
// =========================================

const settingsRef =
    doc(
        db,
        "settings",
        "cafe"
    );


// =========================================
// LOAD SETTINGS
// =========================================

async function loadSettings() {

    try {

        console.log(
            "🔄 Loading cafe settings..."
        );


        const snapshot =
            await getDoc(settingsRef);


        if (snapshot.exists()) {

            const data =
                snapshot.data();


            cafeName.value =
                data.cafeName || "";


            tagline.value =
                data.tagline || "";


            mobile.value =
                data.mobile || "";


            whatsapp.value =
                data.whatsapp || "";


            address.value =
                data.address || "";


            openingTime.value =
                data.openingTime || "";


            closingTime.value =
                data.closingTime || "";


            instagram.value =
                data.instagram || "";


            website.value =
                data.website || "";


            console.log(
                "✅ Settings loaded"
            );

        }

        else {

            console.log(
                "ℹ️ No settings found. Ready for first save."
            );

        }

    }

    catch (error) {

        console.error(
            "❌ Load Settings Error:",
            error
        );

        alert(
            "❌ Settings load nahi hui."
        );

    }

}


// =========================================
// SAVE SETTINGS
// =========================================

saveButton.addEventListener(
    "click",
    async () => {

        const data = {

            cafeName:
                cafeName.value.trim(),

            tagline:
                tagline.value.trim(),

            mobile:
                mobile.value.trim(),

            whatsapp:
                whatsapp.value.trim(),

            address:
                address.value.trim(),

            openingTime:
                openingTime.value,

            closingTime:
                closingTime.value,

            instagram:
                instagram.value.trim(),

            website:
                website.value.trim(),

            updatedAt:
                Date.now()

        };


        // =================================
        // BASIC VALIDATION
        // =================================

        if (
            data.cafeName === ""
        ) {

            alert(
                "Please enter cafe name."
            );

            cafeName.focus();

            return;

        }


        if (
            data.whatsapp === ""
        ) {

            alert(
                "Please enter WhatsApp number."
            );

            whatsapp.focus();

            return;

        }


        try {

            saveButton.disabled =
                true;

            saveButton.innerText =
                "💾 Saving...";


            // =================================
            // SAVE TO FIRESTORE
            // =================================

            await setDoc(
                settingsRef,
                data,
                {
                    merge: true
                }
            );


            console.log(
                "✅ Settings saved successfully"
            );


            alert(
                "✅ Cafe settings saved successfully!"
            );

        }

        catch (error) {

            console.error(
                "❌ Save Settings Error:",
                error
            );


            alert(
                "❌ Settings save nahi hui. Please try again."
            );

        }

        finally {

            saveButton.disabled =
                false;

            saveButton.innerText =
                "💾 Save Settings";

        }

    }
);


// =========================================
// LOGOUT
// =========================================

window.logout =
    function() {

        window.location.href =
            "login.html";

    };


// =========================================
// START
// =========================================

loadSettings();