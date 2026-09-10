import { db } from "../firebase/firebase.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


// =========================================
// VARIABLES
// =========================================

let allBookings = [];

let currentStatus = "all";


// =========================================
// ELEMENTS
// =========================================

const bookingsBody =
    document.getElementById("bookingsBody");

const searchInput =
    document.getElementById("bookingSearch");

const filterButtons =
    document.querySelectorAll(".booking-filter");


// =========================================
// LOAD BOOKINGS
// =========================================

async function loadBookings() {

    try {

        console.log(
            "🔄 Loading bookings..."
        );


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "bookings"
                )
            );


        allBookings = [];


        snapshot.forEach((document) => {

            allBookings.push({

                id: document.id,

                ...document.data()

            });

        });


        // Newest booking first

        allBookings.sort((a, b) => {

            return (
                Number(b.createdAt || 0) -
                Number(a.createdAt || 0)
            );

        });


        console.log(
            "✅ Bookings loaded:",
            allBookings.length
        );


        displayBookings();

    }

    catch (error) {

        console.error(
            "❌ Booking Error:",
            error
        );


        bookingsBody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    style="
                        text-align:center;
                        color:red;
                        padding:30px;
                    "
                >

                    ❌ Unable to load bookings.

                </td>

            </tr>

        `;

    }

}


// =========================================
// DISPLAY BOOKINGS
// =========================================

function displayBookings() {

    bookingsBody.innerHTML = "";


    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const filteredBookings =
        allBookings.filter((booking) => {


            // =================================
            // STATUS FILTER
            // =================================

            const status =
                booking.status || "Pending";


            if (
                currentStatus !== "all" &&
                status !== currentStatus
            ) {

                return false;

            }


            // =================================
            // SEARCH
            // =================================

            if (search !== "") {

                const name =
                    String(
                        booking.customerName || ""
                    ).toLowerCase();


                const mobile =
                    String(
                        booking.mobile || ""
                    ).toLowerCase();


                const date =
                    String(
                        booking.bookingDate || ""
                    ).toLowerCase();


                const occasion =
                    String(
                        booking.occasion || ""
                    ).toLowerCase();


                if (
                    !name.includes(search) &&
                    !mobile.includes(search) &&
                    !date.includes(search) &&
                    !occasion.includes(search)
                ) {

                    return false;

                }

            }


            return true;

        });


    // =========================================
    // NO BOOKINGS
    // =========================================

    if (
        filteredBookings.length === 0
    ) {

        bookingsBody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    style="
                        text-align:center;
                        padding:40px;
                    "
                >

                    📭 No bookings found.

                </td>

            </tr>

        `;

        return;

    }


    // =========================================
    // CREATE ROWS
    // =========================================

    filteredBookings.forEach((booking) => {

        const status =
            booking.status || "Pending";


        const statusClass =
            status
                .toLowerCase()
                .replace(/\s+/g, "-");


        bookingsBody.innerHTML += `

            <tr>

                <!-- BOOKING ID -->

                <td>

                    <strong>

                        #${escapeHTML(
                            booking.id.substring(
                                0,
                                6
                            )
                        )}

                    </strong>

                </td>


                <!-- CUSTOMER -->

                <td>

                    <strong>

                        ${escapeHTML(
                            booking.customerName ||
                            "Guest"
                        )}

                    </strong>

                    <br>

                    <small>

                        📱
                        ${escapeHTML(
                            booking.mobile || "-"
                        )}

                    </small>

                </td>


                <!-- DATE -->

                <td>

                    📅
                    ${escapeHTML(
                        booking.bookingDate ||
                        "-"
                    )}

                </td>


                <!-- TIME -->

                <td>

                    ⏰
                    ${escapeHTML(
                        booking.bookingTime ||
                        "-"
                    )}

                </td>


                <!-- GUESTS -->

                <td>

                    👥
                    ${Number(
                        booking.guests || 0
                    )}

                </td>


                <!-- OCCASION -->

                <td>

                    ${escapeHTML(
                        booking.occasion ||
                        "-"
                    )}

                </td>


                <!-- SPECIAL REQUEST -->

                <td>

                    ${escapeHTML(
                        booking.specialRequest ||
                        "-"
                    )}

                </td>


                <!-- STATUS -->

                <td>

                    <span
                        class="status ${statusClass}"
                    >

                        ${escapeHTML(
                            status
                        )}

                    </span>

                </td>


                <!-- ACTION -->

                <td>

                    <select
                        onchange="changeBookingStatus(
                            '${booking.id}',
                            this.value
                        )"
                    >

                        <option
                            value="Pending"
                            ${
                                status === "Pending"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Pending
                        </option>


                        <option
                            value="Confirmed"
                            ${
                                status === "Confirmed"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Confirmed
                        </option>


                        <option
                            value="Completed"
                            ${
                                status === "Completed"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Completed
                        </option>


                        <option
                            value="Cancelled"
                            ${
                                status === "Cancelled"
                                    ? "selected"
                                    : ""
                            }
                        >
                            Cancelled
                        </option>

                    </select>

                </td>

            </tr>

        `;

    });

}


// =========================================
// CHANGE BOOKING STATUS
// =========================================

window.changeBookingStatus =
    async function(
        bookingId,
        newStatus
    ) {

        try {

            console.log(
                "🔄 Updating booking:",
                bookingId,
                newStatus
            );


            const bookingRef =
                doc(
                    db,
                    "bookings",
                    bookingId
                );


            await updateDoc(
                bookingRef,
                {
                    status: newStatus
                }
            );


            // Update local data

            const booking =
                allBookings.find(
                    item =>
                        item.id ===
                        bookingId
                );


            if (booking) {

                booking.status =
                    newStatus;

            }


            displayBookings();


            console.log(
                "✅ Booking status updated"
            );


            alert(
                `✅ Booking status changed to ${newStatus}`
            );

        }

        catch (error) {

            console.error(
                "❌ Status Update Error:",
                error
            );


            alert(
                "❌ Booking status update failed."
            );

        }

    };


// =========================================
// FILTER BUTTONS
// =========================================

filterButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(
                btn => {

                    btn.classList.remove(
                        "active"
                    );

                }
            );


            button.classList.add(
                "active"
            );


            currentStatus =
                button.dataset.status;


            displayBookings();

        }
    );

});


// =========================================
// SEARCH
// =========================================

searchInput.addEventListener(
    "input",
    () => {

        displayBookings();

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
// ESCAPE HTML
// =========================================

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


// =========================================
// START
// =========================================

loadBookings();