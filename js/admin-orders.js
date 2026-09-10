import { db, auth } from "../firebase/firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


// =========================================
// VARIABLES
// =========================================

let allOrders = [];

let currentFilter = "All";

let unsubscribeOrders = null;


// =========================================
// ELEMENTS
// =========================================

const ordersBody =
    document.getElementById("ordersBody");

const totalOrders =
    document.getElementById("totalOrders");

const pendingOrders =
    document.getElementById("pendingOrders");

const preparingOrders =
    document.getElementById("preparingOrders");

const completedOrders =
    document.getElementById("completedOrders");

const totalSales =
    document.getElementById("totalSales");


// =========================================
// AUTH CHECK
// =========================================

onAuthStateChanged(auth, (user) => {

    if (!user) {

        window.location.href =
            "login.html";

        return;

    }

    console.log(
        "✅ Admin logged in:",
        user.email
    );


    loadOrders();

});


// =========================================
// LOAD ORDERS
// =========================================

window.loadOrders = function () {

    console.log(
        "🔄 Loading orders..."
    );


    if (unsubscribeOrders) {

        unsubscribeOrders();

    }


    unsubscribeOrders = onSnapshot(

        collection(db, "orders"),

        (snapshot) => {

            allOrders = [];


            snapshot.forEach((document) => {

                allOrders.push({

                    id: document.id,

                    ...document.data()

                });

            });


            // newest first

            allOrders.sort(
                (a, b) =>
                    Number(
                        b.createdAt || 0
                    ) -
                    Number(
                        a.createdAt || 0
                    )
            );


            updateStatistics();

            displayOrders();


            console.log(
                "✅ Orders loaded:",
                allOrders.length
            );

        },


        (error) => {

            console.error(
                "❌ Orders Error:",
                error
            );


            ordersBody.innerHTML = `

                <tr>

                    <td
                        colspan="8"
                        style="
                            text-align:center;
                            color:red;
                            padding:30px;
                        "
                    >

                        ❌ Unable to load orders.

                    </td>

                </tr>

            `;

        }

    );

};


// =========================================
// UPDATE STATISTICS
// =========================================

function updateStatistics() {

    let pending = 0;

    let preparing = 0;

    let completed = 0;

    let sales = 0;


    allOrders.forEach(order => {

        const status =
            order.status || "Pending";


        if (status === "Pending") {

            pending++;

        }


        if (status === "Preparing") {

            preparing++;

        }


        if (
            status === "Completed" ||
            status === "Delivered"
        ) {

            completed++;

        }


        if (
            status !== "Cancelled"
        ) {

            sales +=
                Number(
                    order.total || 0
                );

        }

    });


    totalOrders.innerText =
        allOrders.length;


    pendingOrders.innerText =
        pending;


    preparingOrders.innerText =
        preparing;


    completedOrders.innerText =
        completed;


    totalSales.innerText =
        "₹" +
        sales.toLocaleString(
            "en-IN"
        );

}


// =========================================
// FILTER ORDERS
// =========================================

window.filterOrders =
    function (filter) {

        currentFilter =
            filter;


        document
            .querySelectorAll(
                ".filter-btn"
            )
            .forEach(button => {

                button.classList.remove(
                    "active"
                );

            });


        const buttons =
            document.querySelectorAll(
                ".filter-btn"
            );


        buttons.forEach(button => {

            if (
                button.innerText
                    .includes(filter)
            ) {

                button.classList.add(
                    "active"
                );

            }

        });


        displayOrders();

    };


// =========================================
// DISPLAY ORDERS
// =========================================

function displayOrders() {

    ordersBody.innerHTML = "";


    let filteredOrders =
        allOrders;


    if (
        currentFilter !== "All"
    ) {

        filteredOrders =
            allOrders.filter(
                order => {

                    const status =
                        order.status ||
                        "Pending";


                    if (
                        currentFilter ===
                        "Completed"
                    ) {

                        return (
                            status ===
                                "Completed" ||
                            status ===
                                "Delivered"
                        );

                    }


                    return (
                        status ===
                        currentFilter
                    );

                }
            );

    }


    if (
        filteredOrders.length === 0
    ) {

        ordersBody.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:40px;
                    "
                >

                    🛒 No orders found.

                </td>

            </tr>

        `;

        return;

    }


    filteredOrders.forEach(order => {

        const status =
            order.status ||
            "Pending";


        let itemsHTML = "";


        if (
            Array.isArray(order.items)
        ) {

            order.items.forEach(item => {

                const quantity =
                    Number(
                        item.quantity || 1
                    );


                itemsHTML += `

                    <div style="margin-bottom:4px;">

                        ${escapeHTML(
                            item.name ||
                            "Item"
                        )}

                        × ${quantity}

                    </div>

                `;

            });

        }


        const date =
            formatDate(
                order.createdAt,
                order.orderTime
            );


        ordersBody.innerHTML += `

            <tr>

                <td>

                    <strong>
                        #${escapeHTML(
                            order.id
                                .substring(0, 6)
                        )}
                    </strong>

                </td>


                <td>

                    ${date}

                </td>


                <td>

                    <strong>
                        ${escapeHTML(
                            order.customerName ||
                            "Guest"
                        )}
                    </strong>

                    <br>

                    <small>

                        📱
                        ${escapeHTML(
                            order.mobile ||
                            "-"
                        )}

                    </small>

                </td>


                <td>

                    🪑
                    ${escapeHTML(
                        order.tableNo ||
                        "-"
                    )}

                </td>


                <td>

                    ${itemsHTML || "-"}

                </td>


                <td>

                    <strong>

                        ₹${Number(
                            order.total || 0
                        ).toLocaleString(
                            "en-IN"
                        )}

                    </strong>

                </td>


                <td>

                    <select
                        onchange="changeOrderStatus(
                            '${order.id}',
                            this.value
                        )"
                        style="
                            padding:7px;
                            border-radius:7px;
                            border:1px solid #ddd;
                            cursor:pointer;
                        "
                    >

                        <option
                            value="Pending"
                            ${status === "Pending"
                                ? "selected"
                                : ""}
                        >
                            🟡 Pending
                        </option>


                        <option
                            value="Preparing"
                            ${status === "Preparing"
                                ? "selected"
                                : ""}
                        >
                            👨‍🍳 Preparing
                        </option>


                        <option
                            value="Completed"
                            ${status === "Completed" ||
                              status === "Delivered"
                                ? "selected"
                                : ""}
                        >
                            ✅ Completed
                        </option>


                        <option
                            value="Cancelled"
                            ${status === "Cancelled"
                                ? "selected"
                                : ""}
                        >
                            ❌ Cancelled
                        </option>

                    </select>

                </td>


                <td>

                    <button
                        onclick="viewOrder(
                            '${order.id}'
                        )"
                        style="
                            border:none;
                            background:#ff6b00;
                            color:white;
                            padding:8px 12px;
                            border-radius:7px;
                            cursor:pointer;
                        "
                    >

                        👁️ View

                    </button>

                </td>

            </tr>

        `;

    });

}


// =========================================
// CHANGE STATUS
// =========================================

window.changeOrderStatus =
    async function (
        orderId,
        newStatus
    ) {

        try {

            console.log(
                "🔄 Updating:",
                orderId,
                newStatus
            );


            await updateDoc(

                doc(
                    db,
                    "orders",
                    orderId
                ),

                {

                    status:
                        newStatus,

                    updatedAt:
                        Date.now()

                }

            );


            console.log(
                "✅ Status updated"
            );


        }

        catch (error) {

            console.error(
                "❌ Status Update Error:",
                error
            );


            alert(
                "❌ Status update failed."
            );

        }

    };


// =========================================
// VIEW ORDER
// =========================================

window.viewOrder =
    function (orderId) {

        const order =
            allOrders.find(
                item =>
                    item.id === orderId
            );


        if (!order) {

            alert(
                "Order not found."
            );

            return;

        }


        const modal =
            document.getElementById(
                "orderModal"
            );


        const details =
            document.getElementById(
                "orderDetails"
            );


        let itemsHTML = "";


        if (
            Array.isArray(order.items)
        ) {

            order.items.forEach(item => {

                const quantity =
                    Number(
                        item.quantity || 1
                    );


                const price =
                    Number(
                        item.price || 0
                    );


                const itemTotal =
                    price * quantity;


                itemsHTML += `

                    <div
                        style="
                            display:flex;
                            justify-content:space-between;
                            padding:10px 0;
                            border-bottom:1px solid #eee;
                        "
                    >

                        <span>

                            ${escapeHTML(
                                item.name ||
                                "Item"
                            )}

                            × ${quantity}

                        </span>


                        <strong>

                            ₹${itemTotal.toLocaleString(
                                "en-IN"
                            )}

                        </strong>

                    </div>

                `;

            });

        }


        details.innerHTML = `

            <div style="margin-top:20px;">

                <p>

                    <strong>
                        Order ID:
                    </strong>

                    #${escapeHTML(
                        order.id
                    )}

                </p>


                <p>

                    <strong>
                        Customer:
                    </strong>

                    ${escapeHTML(
                        order.customerName ||
                        "Guest"
                    )}

                </p>


                <p>

                    <strong>
                        Mobile:
                    </strong>

                    ${escapeHTML(
                        order.mobile ||
                        "-"
                    )}

                </p>


                <p>

                    <strong>
                        Table:
                    </strong>

                    🪑 ${escapeHTML(
                        order.tableNo ||
                        "-"
                    )}

                </p>


                <p>

                    <strong>
                        Status:
                    </strong>

                    ${escapeHTML(
                        order.status ||
                        "Pending"
                    )}

                </p>


                <p>

                    <strong>
                        Order Time:
                    </strong>

                    ${formatDate(
                        order.createdAt,
                        order.orderTime
                    )}

                </p>


                <h3
                    style="
                        margin-top:20px;
                    "
                >
                    🍽️ Items
                </h3>


                <div>

                    ${itemsHTML || "No items"}

                </div>


                <h2
                    style="
                        text-align:right;
                        margin-top:20px;
                    "
                >

                    Total:
                    ₹${Number(
                        order.total || 0
                    ).toLocaleString(
                        "en-IN"
                    )}

                </h2>


                ${
                    order.instructions
                    ? `

                        <div
                            style="
                                margin-top:15px;
                                padding:12px;
                                background:#fff7ed;
                                border-radius:8px;
                            "
                        >

                            📝
                            <strong>
                                Instructions:
                            </strong>

                            <br>

                            ${escapeHTML(
                                order.instructions
                            )}

                        </div>

                    `
                    : ""
                }

            </div>

        `;


        modal.style.display =
            "flex";

    };


// =========================================
// CLOSE MODAL
// =========================================

window.closeOrderModal =
    function () {

        document.getElementById(
            "orderModal"
        ).style.display =
            "none";

    };


// =========================================
// FORMAT DATE
// =========================================

function formatDate(
    timestamp,
    fallback
) {

    if (timestamp) {

        const date =
            new Date(
                Number(timestamp)
            );


        if (
            !isNaN(
                date.getTime()
            )
        ) {

            return date.toLocaleString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        }

    }


    return escapeHTML(
        fallback || "-"
    );

}


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

console.log(
    "🚀 Admin Orders JS loaded"
);