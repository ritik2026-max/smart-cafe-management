import {
    db
} from "../firebase/firebase.js";

import {
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


// =========================================
// WHATSAPP NUMBER
// =========================================

const WHATSAPP_NUMBER = "919685989854";


// =========================================
// ELEMENTS
// =========================================

const cartItems =
    document.getElementById("cartItems");

const cartTotal =
    document.getElementById("cartTotal");

const totalItems =
    document.getElementById("totalItems");

const placeOrderBtn =
    document.getElementById("placeOrderBtn");

const orderMessage =
    document.getElementById("orderMessage");


// =========================================
// CART
// =========================================

let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


// =========================================
// DISPLAY CART
// =========================================

function displayCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <h2>
                    🛒 Your cart is empty
                </h2>

                <p>
                    Please add food items first.
                </p>

                <button
                    onclick="location.href='menu.html'"
                >
                    Browse Menu
                </button>

            </div>

        `;

        updateSummary(0, 0);

        return;
    }


    let total = 0;
    let itemCount = 0;


    cart.forEach((item, index) => {

        const price =
            Number(item.price || 0);

        const quantity =
            Number(item.quantity || 1);

        const itemTotal =
            price * quantity;


        total += itemTotal;
        itemCount += quantity;


        const row =
            document.createElement("div");

        row.className = "cart-item";


        row.innerHTML = `

            <img
                src="${escapeHTML(
                    item.image ||
                    "../image/logo.png"
                )}"
                alt="${escapeHTML(
                    item.name ||
                    "Food"
                )}"
            >

            <div class="item-info">

                <h3>
                    ${escapeHTML(
                        item.name ||
                        "Item"
                    )}
                </h3>

                <div class="item-price">

                    ₹${price.toLocaleString("en-IN")}

                </div>

            </div>


            <div class="quantity">

                <button
                    data-action="minus"
                >
                    −
                </button>

                <span>
                    ${quantity}
                </span>

                <button
                    data-action="plus"
                >
                    +
                </button>

            </div>


            <strong>

                ₹${itemTotal.toLocaleString("en-IN")}

            </strong>


            <button
                class="remove-btn"
                data-action="remove"
            >
                🗑️
            </button>

        `;


        const image =
            row.querySelector("img");


        image.onerror =
            function () {

                this.src =
                    "../image/logo.png";

            };


        row.querySelector(
            '[data-action="minus"]'
        ).addEventListener(
            "click",
            () => decreaseQuantity(index)
        );


        row.querySelector(
            '[data-action="plus"]'
        ).addEventListener(
            "click",
            () => increaseQuantity(index)
        );


        row.querySelector(
            '[data-action="remove"]'
        ).addEventListener(
            "click",
            () => removeItem(index)
        );


        cartItems.appendChild(row);

    });


    updateSummary(
        total,
        itemCount
    );

}


// =========================================
// SUMMARY
// =========================================

function updateSummary(total, count) {

    totalItems.innerText =
        count;

    cartTotal.innerText =
        "₹" +
        Number(total).toLocaleString("en-IN");

}


// =========================================
// INCREASE QUANTITY
// =========================================

function increaseQuantity(index) {

    cart[index].quantity =
        Number(
            cart[index].quantity || 1
        ) + 1;

    saveCart();

}


// =========================================
// DECREASE QUANTITY
// =========================================

function decreaseQuantity(index) {

    const quantity =
        Number(
            cart[index].quantity || 1
        );


    if (quantity > 1) {

        cart[index].quantity =
            quantity - 1;

    } else {

        cart.splice(index, 1);

    }


    saveCart();

}


// =========================================
// REMOVE ITEM
// =========================================

function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

}


// =========================================
// SAVE CART
// =========================================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    displayCart();

}


// =========================================
// PLACE ORDER
// =========================================

placeOrderBtn.addEventListener(
    "click",
    async () => {

        if (cart.length === 0) {

            showMessage(
                "❌ Cart is empty.",
                true
            );

            return;

        }


        const customerName =
            document
                .getElementById("customerName")
                .value
                .trim();


        const tableNo =
            document
                .getElementById("tableNo")
                .value
                .trim();


        if (customerName === "") {

            showMessage(
                "❌ Please enter customer name.",
                true
            );

            return;

        }


        if (tableNo === "") {

            showMessage(
                "❌ Please enter table number.",
                true
            );

            return;

        }


        // =====================================
        // TOTAL
        // =====================================

        const total =
            cart.reduce(
                (sum, item) => {

                    return (
                        sum +
                        Number(item.price || 0) *
                        Number(item.quantity || 1)
                    );

                },
                0
            );


        // =====================================
        // WHATSAPP MESSAGE
        // =====================================

        let whatsappMessage =
            `🍽️ *NEW ORDER - THE SKY HOUSE CAFE*%0A%0A`;

        whatsappMessage +=
            `👤 *Customer:* ${customerName}%0A`;

        whatsappMessage +=
            `🪑 *Table No:* ${tableNo}%0A%0A`;

        whatsappMessage +=
            `📋 *ORDER DETAILS*%0A`;


        cart.forEach((item, index) => {

            const price =
                Number(item.price || 0);

            const quantity =
                Number(item.quantity || 1);

            const itemTotal =
                price * quantity;


            whatsappMessage +=
                `${index + 1}. ${item.name}%0A`;

            whatsappMessage +=
                `   Qty: ${quantity} × ₹${price} = ₹${itemTotal}%0A`;

        });


        whatsappMessage +=
            `%0A💰 *TOTAL: ₹${total}*%0A%0A`;

        whatsappMessage +=
            `🏪 The Sky House Cafe & Restaurant`;


        const whatsappURL =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;


        // =====================================
        // OPEN WHATSAPP WINDOW
        // =====================================
        // Browser popup blocker se bachne ke liye
        // click ke time hi window open kar rahe hain.

        let whatsappWindow = null;

        try {

            whatsappWindow =
                window.open(
                    "about:blank",
                    "_blank"
                );

        } catch (error) {

            console.log(
                "WhatsApp window could not open:",
                error
            );

        }


        // =====================================
        // DISABLE BUTTON
        // =====================================

        placeOrderBtn.disabled = true;

        placeOrderBtn.innerText =
            "⏳ Placing Order...";


        try {

            // =================================
            // ORDER DATA
            // =================================

            const order = {

                customerName:
                    customerName,

                tableNo:
                    tableNo,

                items:
                    cart.map(item => ({

                        id:
                            item.id || "",

                        name:
                            item.name || "Item",

                        price:
                            Number(
                                item.price || 0
                            ),

                        quantity:
                            Number(
                                item.quantity || 1
                            )

                    })),

                total:
                    total,

                status:
                    "Pending",

                orderTime:
                    new Date().toLocaleString(
                        "en-IN"
                    ),

                createdAt:
                    Date.now()

            };


            // =================================
            // SAVE TO FIRESTORE
            // =================================

            const orderRef =
                await addDoc(
                    collection(
                        db,
                        "orders"
                    ),
                    order
                );


            console.log(
                "✅ Order placed:",
                orderRef.id
            );


            // =================================
            // CLEAR CART
            // =================================

            localStorage.removeItem("cart");

            cart = [];

            displayCart();


            // =================================
            // SUCCESS MESSAGE
            // =================================

            showMessage(
                "✅ Order placed successfully!"
            );


            placeOrderBtn.innerText =
                "✅ Order Placed";


            // =================================
            // OPEN WHATSAPP
            // =================================

            if (
                whatsappWindow &&
                !whatsappWindow.closed
            ) {

                whatsappWindow.location.href =
                    whatsappURL;

            } else {

                // Popup blocked होने पर fallback

                window.location.href =
                    whatsappURL;

            }


            // =================================
            // REDIRECT TO MENU
            // =================================

            setTimeout(
                () => {

                    location.href =
                        "menu.html";

                },
                5000
            );


        }

        catch (error) {

            console.error(
                "❌ Place Order Error:",
                error
            );


            // अगर Firebase order fail हो जाए
            // तो blank WhatsApp tab बंद कर दें

            if (
                whatsappWindow &&
                !whatsappWindow.closed
            ) {

                whatsappWindow.close();

            }


            showMessage(
                "❌ Order failed. Please try again.",
                true
            );


            placeOrderBtn.disabled =
                false;


            placeOrderBtn.innerText =
                "🍽️ Place Order";

        }

    }
);


// =========================================
// MESSAGE
// =========================================

function showMessage(
    message,
    error = false
) {

    orderMessage.innerText =
        message;

    orderMessage.style.color =
        error
            ? "red"
            : "green";

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

displayCart();