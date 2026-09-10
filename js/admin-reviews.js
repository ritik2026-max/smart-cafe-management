import { db } from "../firebase/firebase.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


// =========================================
// VARIABLES
// =========================================

let allReviews = [];

let currentStatus = "all";


// =========================================
// ELEMENTS
// =========================================

const reviewsBody =
    document.getElementById("reviewsBody");

const searchInput =
    document.getElementById("reviewSearch");

const filterButtons =
    document.querySelectorAll(".review-filter");


// =========================================
// LOAD REVIEWS
// =========================================

async function loadReviews() {

    try {

        console.log(
            "🔄 Loading reviews..."
        );


        const snapshot =
            await getDocs(
                collection(
                    db,
                    "reviews"
                )
            );


        allReviews = [];


        snapshot.forEach((document) => {

            allReviews.push({

                id: document.id,

                ...document.data()

            });

        });


        // Newest reviews first

        allReviews.sort((a, b) => {

            return (
                Number(b.createdAt || 0) -
                Number(a.createdAt || 0)
            );

        });


        console.log(
            "✅ Reviews loaded:",
            allReviews.length
        );


        displayReviews();

    }

    catch (error) {

        console.error(
            "❌ Reviews Error:",
            error
        );


        reviewsBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="
                        text-align:center;
                        color:red;
                        padding:30px;
                    "
                >

                    ❌ Unable to load reviews.

                </td>

            </tr>

        `;

    }

}


// =========================================
// DISPLAY REVIEWS
// =========================================

function displayReviews() {

    reviewsBody.innerHTML = "";


    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const filteredReviews =
        allReviews.filter((review) => {


            // =================================
            // STATUS FILTER
            // =================================

            const status =
                review.status || "Pending";


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
                        review.customerName || ""
                    ).toLowerCase();


                const text =
                    String(
                        review.review || ""
                    ).toLowerCase();


                const mobile =
                    String(
                        review.mobile || ""
                    ).toLowerCase();


                if (
                    !name.includes(search) &&
                    !text.includes(search) &&
                    !mobile.includes(search)
                ) {

                    return false;

                }

            }


            return true;

        });


    // =========================================
    // NO REVIEWS
    // =========================================

    if (
        filteredReviews.length === 0
    ) {

        reviewsBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="
                        text-align:center;
                        padding:40px;
                    "
                >

                    ⭐ No reviews found.

                </td>

            </tr>

        `;

        return;

    }


    // =========================================
    // CREATE REVIEW ROWS
    // =========================================

    filteredReviews.forEach((review) => {

        const status =
            review.status || "Pending";


        const rating =
            Number(review.rating || 0);


        const stars =
            "⭐".repeat(
                Math.max(
                    0,
                    Math.min(
                        5,
                        rating
                    )
                )
            );


        const statusClass =
            status
                .toLowerCase()
                .replace(/\s+/g, "-");


        reviewsBody.innerHTML += `

            <tr>

                <!-- CUSTOMER -->

                <td>

                    <strong>

                        ${escapeHTML(
                            review.customerName ||
                            "Guest"
                        )}

                    </strong>

                    ${
                        review.mobile
                            ? `
                                <br>
                                <small>
                                    📱
                                    ${escapeHTML(
                                        review.mobile
                                    )}
                                </small>
                              `
                            : ""
                    }

                </td>


                <!-- RATING -->

                <td>

                    <span
                        title="${rating}/5"
                    >

                        ${stars || "-"}

                    </span>

                    <br>

                    <small>
                        ${rating}/5
                    </small>

                </td>


                <!-- REVIEW -->

                <td
                    style="
                        min-width:250px;
                        max-width:400px;
                    "
                >

                    ${escapeHTML(
                        review.review ||
                        "-"
                    )}

                </td>


                <!-- DATE -->

                <td>

                    ${escapeHTML(
                        review.reviewTime ||
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


                <!-- ACTIONS -->

                <td>

                    <div
                        style="
                            display:flex;
                            gap:6px;
                            flex-wrap:wrap;
                        "
                    >

                        ${
                            status !== "Approved"
                                ? `
                                    <button
                                        onclick="changeReviewStatus(
                                            '${review.id}',
                                            'Approved'
                                        )"
                                        style="
                                            background:#28a745;
                                            color:white;
                                            border:none;
                                            padding:7px 10px;
                                            border-radius:6px;
                                            cursor:pointer;
                                        "
                                    >
                                        ✅ Approve
                                    </button>
                                  `
                                : ""
                        }


                        ${
                            status !== "Rejected"
                                ? `
                                    <button
                                        onclick="changeReviewStatus(
                                            '${review.id}',
                                            'Rejected'
                                        )"
                                        style="
                                            background:#dc3545;
                                            color:white;
                                            border:none;
                                            padding:7px 10px;
                                            border-radius:6px;
                                            cursor:pointer;
                                        "
                                    >
                                        ❌ Reject
                                    </button>
                                  `
                                : ""
                        }


                        <button
                            onclick="deleteReview(
                                '${review.id}'
                            )"
                            style="
                                background:#555;
                                color:white;
                                border:none;
                                padding:7px 10px;
                                border-radius:6px;
                                cursor:pointer;
                            "
                        >
                            🗑 Delete
                        </button>

                    </div>

                </td>

            </tr>

        `;

    });

}


// =========================================
// CHANGE REVIEW STATUS
// =========================================

window.changeReviewStatus =
    async function(
        reviewId,
        newStatus
    ) {

        try {

            console.log(
                "🔄 Updating review:",
                reviewId,
                newStatus
            );


            const reviewRef =
                doc(
                    db,
                    "reviews",
                    reviewId
                );


            await updateDoc(
                reviewRef,
                {
                    status: newStatus
                }
            );


            // Update local data

            const review =
                allReviews.find(
                    item =>
                        item.id ===
                        reviewId
                );


            if (review) {

                review.status =
                    newStatus;

            }


            displayReviews();


            console.log(
                "✅ Review status updated"
            );


            alert(
                `✅ Review ${newStatus}`
            );

        }

        catch (error) {

            console.error(
                "❌ Status Update Error:",
                error
            );


            alert(
                "❌ Review status update failed."
            );

        }

    };


// =========================================
// DELETE REVIEW
// =========================================

window.deleteReview =
    async function(reviewId) {

        const confirmed =
            confirm(
                "Are you sure you want to delete this review?"
            );


        if (!confirmed) {

            return;

        }


        try {

            console.log(
                "🗑 Deleting review:",
                reviewId
            );


            await deleteDoc(
                doc(
                    db,
                    "reviews",
                    reviewId
                )
            );


            allReviews =
                allReviews.filter(
                    review =>
                        review.id !==
                        reviewId
                );


            displayReviews();


            console.log(
                "✅ Review deleted"
            );


            alert(
                "✅ Review deleted successfully."
            );

        }

        catch (error) {

            console.error(
                "❌ Delete Review Error:",
                error
            );


            alert(
                "❌ Review delete failed."
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


            displayReviews();

        }
    );

});


// =========================================
// SEARCH
// =========================================

searchInput.addEventListener(
    "input",
    () => {

        displayReviews();

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

loadReviews();