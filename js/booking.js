import { db } from "../firebase/firebase.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


const bookingBtn =
    document.getElementById("bookingBtn");


bookingBtn.addEventListener(
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


        const bookingDate =
            document
                .getElementById("bookingDate")
                .value;


        const bookingTime =
            document
                .getElementById("bookingTime")
                .value;


        const guests =
            document
                .getElementById("guests")
                .value;


        const occasion =
            document
                .getElementById("occasion")
                .value;


        const specialRequest =
            document
                .getElementById("specialRequest")
                .value
                .trim();


        // =====================================
        // VALIDATION
        // =====================================

        if (customerName === "") {

            alert(
                "Please enter your name."
            );

            return;

        }


        if (
            !/^[0-9]{10}$/.test(mobile)
        ) {

            alert(
                "Please enter a valid 10 digit mobile number."
            );

            return;

        }


        if (bookingDate === "") {

            alert(
                "Please select booking date."
            );

            return;

        }


        if (bookingTime === "") {

            alert(
                "Please select booking time."
            );

            return;

        }


        if (
            guests === "" ||
            Number(guests) < 1
        ) {

            alert(
                "Please enter number of guests."
            );

            return;

        }


        // =====================================
        // BOOKING DATA
        // =====================================

        const bookingData = {

            customerName,

            mobile,

            bookingDate,

            bookingTime,

            guests:
                Number(guests),

            occasion,

            specialRequest,

            status:
                "Pending",

            createdAt:
                Date.now(),

            bookingTimeCreated:
                new Date().toLocaleString()

        };


        try {

            bookingBtn.disabled = true;

            bookingBtn.innerText =
                "Booking...";


            // =================================
            // SAVE TO FIREBASE
            // =================================

            const bookingRef =
                await addDoc(
                    collection(
                        db,
                        "bookings"
                    ),
                    bookingData
                );


            console.log(
                "✅ Booking ID:",
                bookingRef.id
            );


            // =================================
            // SUCCESS
            // =================================

            alert(
                "✅ Table booking request submitted successfully!"
            );


            // Clear form

            document
                .getElementById("customerName")
                .value = "";

            document
                .getElementById("mobile")
                .value = "";

            document
                .getElementById("bookingDate")
                .value = "";

            document
                .getElementById("bookingTime")
                .value = "";

            document
                .getElementById("guests")
                .value = "";

            document
                .getElementById("occasion")
                .value = "";

            document
                .getElementById("specialRequest")
                .value = "";


        }

        catch (error) {

            console.error(
                "❌ Booking Error:",
                error
            );


            alert(
                "❌ Booking failed. Please try again."
            );

        }


        finally {

            bookingBtn.disabled = false;

            bookingBtn.innerText =
                "📅 Book My Table";

        }

    }
);