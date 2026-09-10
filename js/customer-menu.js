// ==========================================================
// 🍽️ THE SKY HOUSE CAFE & RESTAURANT
// CUSTOMER MENU - FINAL VERSION
// ==========================================================

import { db } from "../firebase/firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


// ==========================================================
// DOM ELEMENTS
// ==========================================================

const menuGrid = document.getElementById("menuGrid");
const menuMessage = document.getElementById("menuMessage");
const searchInput = document.getElementById("searchInput");
const cartCount = document.getElementById("cartCount");


// ==========================================================
// GLOBAL VARIABLES
// ==========================================================

let menuItems = [];

let selectedCategory = "all";


// ==========================================================
// IMAGE FALLBACK
// ==========================================================

const FALLBACK_IMAGE = "../image/food/pizza.jpeg";


// ==========================================================
// CATEGORY NORMALIZER
// ==========================================================

function normalizeCategory(category) {

    const value = String(category || "")
        .toLowerCase()
        .trim();

    const categoryMap = {

        "tandoor starter": "tandoor",
        "tandoori starter": "tandoor",

        "starter": "starter",

        "momos": "momos",

        "pizza": "pizza",

        "pasta": "pasta",

        "chinese": "chinese",

        "rice": "rice",

        "main course": "main course",

        "north indian": "north indian",

        "south indian": "south indian",

        "beverages": "beverages"
    };

    return categoryMap[value] || value;
}


// ==========================================================
// NORMALIZE TEXT
// ==========================================================

function normalizeText(value) {

    return String(value || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}


// ==========================================================
// LOAD MENU FROM FIRESTORE
// ==========================================================

async function loadMenu() {

    console.log("🍽️ Loading menu...");

    if (menuMessage) {

        menuMessage.innerText =
            "🍽️ Loading menu...";
    }

    try {

        const menuRef =
            collection(db, "menu");

        const snapshot =
            await getDocs(menuRef);


        menuItems = [];


        snapshot.forEach((documentSnapshot) => {

            const data =
                documentSnapshot.data();


            menuItems.push({

                id:
                    documentSnapshot.id,

                name:
                    data.name || "Unnamed Item",

                price:
                    Number(data.price || 0),

                category:
                    normalizeCategory(data.category),

                image:
                    data.image || "",

                available:
                    data.available !== false
            });

        });


        console.log(
            "✅ MENU LOADED:",
            menuItems.length,
            "items"
        );


        // Sort alphabetically
        menuItems.sort((a, b) => {

            return a.name.localeCompare(
                b.name
            );

        });


        renderMenu();


    } catch (error) {

        console.error(
            "❌ MENU LOAD ERROR:",
            error
        );


        if (menuMessage) {

            menuMessage.innerHTML = `
                <div class="error-box">
                    <h2>❌ Unable to load menu</h2>
                    <p>Please refresh the page.</p>
                    <small>
                        ${error.message || ""}
                    </small>
                </div>
            `;
        }

    }

}


// ==========================================================
// RENDER MENU
// ==========================================================

function renderMenu() {

    if (!menuGrid) {

        console.error(
            "❌ menuGrid element not found."
        );

        return;
    }


    // Clear old cards
    menuGrid.innerHTML = "";


    // ======================================================
    // SEARCH VALUE
    // ======================================================

    const searchValue =
        normalizeText(
            searchInput
                ? searchInput.value
                : ""
        );


    // ======================================================
    // FILTER MENU
    // ======================================================

    const filteredItems =
        menuItems.filter((item) => {


            // ----------------------------------------------
            // AVAILABLE CHECK
            // ----------------------------------------------

            if (item.available === false) {

                return false;
            }


            // ----------------------------------------------
            // CATEGORY CHECK
            // ----------------------------------------------

            const itemCategory =
                normalizeCategory(
                    item.category
                );


            const categoryMatch =
                selectedCategory === "all" ||
                itemCategory ===
                normalizeCategory(
                    selectedCategory
                );


            if (!categoryMatch) {

                return false;
            }


            // ----------------------------------------------
            // SEARCH CHECK
            // ----------------------------------------------

            if (!searchValue) {

                return true;
            }


            const itemName =
                normalizeText(
                    item.name
                );


            const category =
                normalizeText(
                    item.category
                );


            return (
                itemName.includes(
                    searchValue
                ) ||
                category.includes(
                    searchValue
                )
            );

        });


    // ======================================================
    // EMPTY RESULT
    // ======================================================

    if (
        filteredItems.length === 0
    ) {

        if (menuMessage) {

            menuMessage.innerHTML =
                "🍽️ No food items found.";
        }

        return;
    }


    // Hide message
    if (menuMessage) {

        menuMessage.innerHTML = "";
    }


    // ======================================================
    // CREATE FOOD CARDS
    // ======================================================

    filteredItems.forEach(
        (item) => {

            createFoodCard(
                item
            );

        }
    );

}


// ==========================================================
// CREATE FOOD CARD
// ==========================================================

function createFoodCard(item) {

    // ------------------------------------------------------
    // CARD
    // ------------------------------------------------------

    const card =
        document.createElement("div");

    card.className =
        "food-card";


    // ------------------------------------------------------
    // IMAGE
    // ------------------------------------------------------

    const image =
        document.createElement("img");

    image.className =
        "menu-image";


    // Use Firestore image
    // or fallback food image
    image.src =
        item.image &&
        item.image.trim() !== ""
            ? item.image
            : FALLBACK_IMAGE;


    image.alt =
        item.name ||
        "Food";


    // Prevent broken images
    image.onerror =
        function () {

            this.onerror = null;

            this.src =
                FALLBACK_IMAGE;

        };


    // ------------------------------------------------------
    // INFO CONTAINER
    // ------------------------------------------------------

    const info =
        document.createElement("div");

    info.className =
        "food-info";


    // ------------------------------------------------------
    // FOOD NAME
    // ------------------------------------------------------

    const name =
        document.createElement("h3");

    name.innerText =
        item.name ||
        "Unnamed Item";


    // ------------------------------------------------------
    // CATEGORY
    // ------------------------------------------------------

    const category =
        document.createElement("div");

    category.className =
        "category";

    category.innerText =
        item.category ||
        "Food";


    // ------------------------------------------------------
    // PRICE
    // ------------------------------------------------------

    const price =
        document.createElement("div");

    price.className =
        "price";

    price.innerText =
        "₹" +
        Number(
            item.price || 0
        ).toLocaleString(
            "en-IN"
        );


    // ------------------------------------------------------
    // ADD TO CART BUTTON
    // ------------------------------------------------------

    const button =
        document.createElement("button");

    button.className =
        "add-btn";

    button.innerText =
        "🛒 Add to Cart";


    button.addEventListener(
        "click",
        () => {

            addToCart(
                item
            );

        }
    );


    // ------------------------------------------------------
    // APPEND
    // ------------------------------------------------------

    info.appendChild(
        name
    );

    info.appendChild(
        category
    );

    info.appendChild(
        price
    );

    info.appendChild(
        button
    );


    card.appendChild(
        image
    );

    card.appendChild(
        info
    );


    menuGrid.appendChild(
        card
    );

}


// ==========================================================
// ADD TO CART
// ==========================================================

function addToCart(item) {

    let cart = [];


    try {

        cart =
            JSON.parse(
                localStorage.getItem(
                    "cart"
                )
            ) || [];

    } catch (error) {

        console.warn(
            "Cart data reset."
        );

        cart = [];

    }


    // ------------------------------------------------------
    // CHECK EXISTING ITEM
    // ------------------------------------------------------

    const existing =
        cart.find(
            (cartItem) =>
                cartItem.id ===
                item.id
        );


    if (existing) {

        existing.quantity =
            Number(
                existing.quantity || 1
            ) + 1;

    } else {

        cart.push({

            id:
                item.id,

            name:
                item.name ||
                "Item",

            price:
                Number(
                    item.price || 0
                ),

            image:
                item.image ||
                FALLBACK_IMAGE,

            category:
                item.category ||
                "",

            quantity:
                1

        });

    }


    // ------------------------------------------------------
    // SAVE CART
    // ------------------------------------------------------

    localStorage.setItem(
        "cart",
        JSON.stringify(
            cart
        )
    );


    // ------------------------------------------------------
    // UPDATE COUNT
    // ------------------------------------------------------

    updateCartCount();


    // ------------------------------------------------------
    // SHOW MESSAGE
    // ------------------------------------------------------

    showAddedMessage(
        item.name
    );


    console.log(
        "🛒 Added:",
        item.name
    );

}


// ==========================================================
// CART COUNT
// ==========================================================

function updateCartCount() {

    let cart = [];


    try {

        cart =
            JSON.parse(
                localStorage.getItem(
                    "cart"
                )
            ) || [];

    } catch (error) {

        cart = [];

    }


    const count =
        cart.reduce(
            (
                total,
                item
            ) => {

                return (
                    total +
                    Number(
                        item.quantity || 1
                    )
                );

            },
            0
        );


    if (cartCount) {

        cartCount.innerText =
            count;

    }

}


// ==========================================================
// ADDED MESSAGE
// ==========================================================

function showAddedMessage(
    itemName
) {

    const message =
        document.createElement(
            "div"
        );


    message.innerText =
        `✅ ${itemName} added to cart`;


    message.style.position =
        "fixed";

    message.style.left =
        "50%";

    message.style.bottom =
        "80px";

    message.style.transform =
        "translateX(-50%)";

    message.style.background =
        "#222";

    message.style.color =
        "#fff";

    message.style.padding =
        "12px 20px";

    message.style.borderRadius =
        "8px";

    message.style.zIndex =
        "99999";

    message.style.fontSize =
        "14px";

    message.style.boxShadow =
        "0 5px 20px rgba(0,0,0,0.25)";


    document.body.appendChild(
        message
    );


    setTimeout(
        () => {

            message.remove();

        },
        1800
    );

}


// ==========================================================
// CATEGORY BUTTONS
// ==========================================================

function setupCategoryButtons() {

    const buttons =
        document.querySelectorAll(
            ".category-btn"
        );


    buttons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    selectedCategory =
                        normalizeCategory(
                            button.dataset.category ||
                            button.innerText
                        );


                    // Remove active
                    buttons.forEach(
                        (btn) => {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    // Current active
                    button.classList.add(
                        "active"
                    );


                    renderMenu();

                }
            );

        }
    );

}


// ==========================================================
// SEARCH
// ==========================================================

function setupSearch() {

    if (!searchInput) {

        console.warn(
            "⚠️ Search input not found."
        );

        return;
    }


    searchInput.addEventListener(
        "input",
        () => {

            renderMenu();

        }
    );

}


// ==========================================================
// CART BUTTON
// ==========================================================

function setupCartButton() {

    const cartButton =
        document.getElementById(
            "cartButton"
        );


    if (
        cartButton
    ) {

        cartButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "cart.html";

            }
        );

    }

}


// ==========================================================
// INITIALIZE
// ==========================================================

function init() {

    console.log(
        "🚀 Customer Menu Started"
    );


    updateCartCount();

    setupCategoryButtons();

    setupSearch();

    setupCartButton();

    loadMenu();

}


// ==========================================================
// START
// ==========================================================

init();