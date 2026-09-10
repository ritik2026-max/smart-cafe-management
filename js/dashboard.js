import { db, auth } from "../firebase/firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


// =========================================
// DASHBOARD ELEMENTS
// =========================================

const totalOrders = document.getElementById("totalOrders");
const totalSales = document.getElementById("totalSales");
const pendingOrders = document.getElementById("pendingOrders");
const deliveredOrders = document.getElementById("deliveredOrders");
const topFood = document.getElementById("topFood");
const totalItems = document.getElementById("totalItems");
const recentOrders = document.querySelector("#recentOrders tbody");


// =========================================
// SALES CHART
// =========================================

let salesChart = null;


// =========================================
// AUTH CHECK
// =========================================

onAuthStateChanged(auth, (user) => {

    console.log("🔐 Auth User:", user);

    if (!user) {

        console.log("❌ No authenticated user");

        window.location.href = "login.html";

        return;
    }

    console.log("✅ Admin logged in:", user.email);

    loadDashboard();

});


// =========================================
// LOAD DASHBOARD
// =========================================

async function loadDashboard() {

    try {

        console.log("🔄 Loading dashboard...");

        const snapshot = await getDocs(
            collection(db, "orders")
        );

        let orders = [];

        let sales = 0;

        let pending = 0;

        let completed = 0;

        let itemsSold = 0;

        let foodCount = {};

        let salesData = {};


        // =====================================
        // READ FIREBASE ORDERS
        // =====================================

        snapshot.forEach((document) => {

            const order = {
                id: document.id,
                ...document.data()
            };

            orders.push(order);


            // =================================
            // TOTAL SALES
            // =================================

            sales += Number(order.total || 0);


            // =================================
            // STATUS
            // =================================

            const status = order.status || "Pending";

            if (status === "Pending") {
                pending++;
            }

            if (
                status === "Completed" ||
                status === "Delivered"
            ) {
                completed++;
            }


            // =================================
            // FOOD DATA
            // =================================

            if (Array.isArray(order.items)) {

                order.items.forEach((item) => {

                    const quantity =
                        Number(item.quantity || 1);

                    itemsSold += quantity;

                    const name =
                        item.name || "Unknown";

                    if (!foodCount[name]) {
                        foodCount[name] = 0;
                    }

                    foodCount[name] += quantity;

                });

            }


            // =================================
            // SALES BY DATE
            // =================================

            let date = "Unknown";

            if (order.orderTime) {

                date =
                    String(order.orderTime)
                        .split(",")[0];

            }

            if (!salesData[date]) {
                salesData[date] = 0;
            }

            salesData[date] +=
                Number(order.total || 0);

        });


        // =====================================
        // SORT NEWEST ORDERS FIRST
        // =====================================

        orders.sort((a, b) => {

            return (
                Number(b.createdAt || 0) -
                Number(a.createdAt || 0)
            );

        });


        // =====================================
        // UPDATE DASHBOARD CARDS
        // =====================================

        if (totalOrders) {

            totalOrders.innerText =
                orders.length;

        }

        if (totalSales) {

            totalSales.innerText =
                "₹" +
                sales.toLocaleString("en-IN");

        }

        if (pendingOrders) {

            pendingOrders.innerText =
                pending;

        }

        if (deliveredOrders) {

            deliveredOrders.innerText =
                completed;

        }

        if (totalItems) {

            totalItems.innerText =
                itemsSold;

        }


        // =====================================
        // MOST ORDERED FOOD
        // =====================================

        let bestFood = "-";

        let bestQuantity = 0;

        Object.keys(foodCount).forEach((name) => {

            if (
                foodCount[name] >
                bestQuantity
            ) {

                bestQuantity =
                    foodCount[name];

                bestFood =
                    name;

            }

        });


        if (topFood) {

            topFood.innerText =
                bestFood === "-"
                    ? "No Orders"
                    : bestFood;

        }


        // =====================================
        // RECENT ORDERS
        // =====================================

        if (recentOrders) {

            recentOrders.innerHTML = "";

            const recent =
                orders.slice(0, 10);


            if (recent.length === 0) {

                recentOrders.innerHTML = `

                    <tr>

                        <td
                            colspan="5"
                            style="
                                text-align:center;
                                padding:25px;
                            "
                        >

                            🛒 No Orders Yet

                        </td>

                    </tr>

                `;

            } else {

                recent.forEach((order) => {

                    let itemsHTML = "";


                    if (
                        Array.isArray(order.items)
                    ) {

                        order.items.forEach((item) => {

                            itemsHTML += `

                                ${escapeHTML(
                                    item.name || "Item"
                                )}

                                ×
                                ${Number(
                                    item.quantity || 1
                                )}

                                <br>

                            `;

                        });

                    }


                    recentOrders.innerHTML += `

                        <tr>

                            <td>
                                🪑
                                ${escapeHTML(
                                    order.tableNo || "-"
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    order.customerName ||
                                    "Guest"
                                )}
                            </td>

                            <td>
                                ${itemsHTML || "-"}
                            </td>

                            <td>

                                <span class="status">

                                    ${escapeHTML(
                                        order.status ||
                                        "Pending"
                                    )}

                                </span>

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

                        </tr>

                    `;

                });

            }

        }


        // =====================================
        // SALES CHART
        // =====================================

        createSalesChart(salesData);


        // =====================================
        // CONSOLE RESULTS
        // =====================================

        console.log(
            "✅ Dashboard loaded successfully"
        );

        console.log(
            "📦 Total Orders:",
            orders.length
        );

        console.log(
            "💰 Total Sales:",
            sales
        );

        console.log(
            "⏳ Pending:",
            pending
        );

        console.log(
            "✅ Completed:",
            completed
        );

        console.log(
            "🍽 Items Sold:",
            itemsSold
        );

    }

    catch (error) {

        console.error(
            "❌ Dashboard Error:",
            error
        );


        if (recentOrders) {

            recentOrders.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        style="
                            text-align:center;
                            color:red;
                            padding:25px;
                        "
                    >

                        ❌ Unable to load
                        dashboard data.

                    </td>

                </tr>

            `;

        }

    }

}


// =========================================
// CREATE SALES CHART
// =========================================

function createSalesChart(salesData) {

    const chartElement =
        document.getElementById("salesChart");


    if (!chartElement) {

        console.log(
            "⚠️ Sales chart element not found"
        );

        return;

    }


    const labels =
        Object.keys(salesData);

    const values =
        Object.values(salesData);


    if (salesChart) {

        salesChart.destroy();

    }


    salesChart = new Chart(
        chartElement,
        {

            type: "line",

            data: {

                labels: labels,

                datasets: [

                    {

                        label: "Sales (₹)",

                        data: values,

                        borderWidth: 3,

                        tension: 0.3,

                        fill: false

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        display: true

                    }

                },


                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {

                            callback: function(value) {

                                return (
                                    "₹" +
                                    Number(value)
                                        .toLocaleString(
                                            "en-IN"
                                        )
                                );

                            }

                        }

                    }

                }

            }

        }
    );

}


// =========================================
// LOGOUT
// =========================================

window.logout = async function() {

    try {

        await signOut(auth);

        console.log(
            "✅ Admin logged out"
        );

        window.location.href =
            "login.html";

    }

    catch (error) {

        console.error(
            "❌ Logout Error:",
            error
        );

    }

};


// =========================================
// ESCAPE HTML
// =========================================

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}