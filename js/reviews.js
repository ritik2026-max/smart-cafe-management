import { db } from "../firebase/firebase.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


const reviewBtn =
    document.getElementById("reviewBtn");


reviewBtn.addEventListener(
    "click",
    async () => {

        const customerName =
            document
                .getElementById("customerName")
                .value
                .trim();


        const mobile =
            document
                .getElementById("mobile")
                .value
                .trim();


        const rating =
            document
                .getElementById("rating")
                .value;


        const review =
            document
                .getElementById("review")
                .value
                .trim();


        // =================================
        // VALIDATION
        // =================================

        if (customerName === "") {

            alert(
                "Please enter your name."
            );

            return;

        }


        if (rating === "") {

            alert(
                "Please select a rating."
            );

            return;

        }


        if (review === "") {

            alert(
                "Please write your review."
            );

            return;

        }


        // =================================
        // REVIEW DATA
        // =================================

        const reviewData = {

            customerName,

            mobile,

            rating:
                Number(rating),

            review,

            status:
                "Pending",

            createdAt:
                Date.now(),

            reviewTime:
                new Date().toLocaleString()

        };


        try {

            reviewBtn.disabled = true;

            reviewBtn.innerText =
                "Submitting...";


            // =================================
            // SAVE TO FIREBASE
            // =================================

            const reviewRef =
                await addDoc(
                    collection(
                        db,
                        "reviews"
                    ),
                    reviewData
                );


            console.log(
                "✅ Review ID:",
                reviewRef.id
            );


            alert(
                "✅ Thank you! Your review has been submitted."
            );


            // Clear form

            document
                .getElementById("customerName")
                .value = "";

            document
                .getElementById("mobile")
                .value = "";

            document
                .getElementById("rating")
                .value = "";

            document
                .getElementById("review")
                .value = "";

        }

        catch (error) {

            console.error(
                "❌ Review Error:",
                error
            );


            alert(
                "❌ Review submit nahi hua. Please try again."
            );

        }

        finally {

            reviewBtn.disabled = false;

            reviewBtn.innerText =
                "⭐ Submit Review";

        }

    }
);