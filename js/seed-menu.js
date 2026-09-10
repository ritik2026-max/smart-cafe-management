// ======================================================
// 🍽️ THE SKY HOUSE CAFE & RESTAURANT
// FIREBASE MENU SEEDER
// ======================================================
// Total Menu Items: 83
// Pure Vegetarian Menu
//
// IMPORTANT:
// 1. firebase.js को change मत करना
// 2. यह file /js/seed-menu.js में होनी चाहिए
// 3. seed-menu.html /admin/ folder में है
// 4. Admin login के बाद button से seedMenu() call करें
// ======================================================

import { db, auth } from "../firebase/firebase.js";

import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


// ======================================================
// 🍴 COMPLETE 83 ITEM MENU
// ======================================================

const menuItems = [

    // ==================================================
    // STARTERS
    // ==================================================

    {
        name: "Chatpata Tandoori Chaap",
        price: 200,
        category: "tandoor",
        image: ""
    },

    {
        name: "Crispy Harabhara Kabab",
        price: 220,
        category: "starter",
        image: ""
    },

    {
        name: "Paneer Tikka",
        price: 240,
        category: "tandoor",
        image: ""
    },

    {
        name: "Chana Chilli",
        price: 160,
        category: "starter",
        image: ""
    },

    {
        name: "Chana Roast",
        price: 180,
        category: "starter",
        image: ""
    },

    {
        name: "Pav Bhaji",
        price: 100,
        category: "starter",
        image: ""
    },

    {
        name: "Baby Corn Chilli",
        price: 180,
        category: "starter",
        image: ""
    },

    {
        name: "Cheese Balls",
        price: 180,
        category: "starter",
        image: ""
    },

    {
        name: "Veg Spring Roll",
        price: 160,
        category: "starter",
        image: ""
    },

    {
        name: "Crispy Corn",
        price: 180,
        category: "starter",
        image: ""
    },

    {
        name: "Honey Chilli Potato",
        price: 180,
        category: "starter",
        image: ""
    },

    {
        name: "French Fries",
        price: 120,
        category: "starter",
        image: ""
    },


    // ==================================================
    // TANDOOR
    // ==================================================

    {
        name: "Achari Paneer Tikka",
        price: 250,
        category: "tandoor",
        image: ""
    },

    {
        name: "Malai Paneer Tikka",
        price: 260,
        category: "tandoor",
        image: ""
    },

    {
        name: "Afghani Chaap",
        price: 220,
        category: "tandoor",
        image: ""
    },

    {
        name: "Masala Chaap",
        price: 210,
        category: "tandoor",
        image: ""
    },

    {
        name: "Tandoori Mushroom",
        price: 240,
        category: "tandoor",
        image: ""
    },

    {
        name: "Tandoori Aloo",
        price: 180,
        category: "tandoor",
        image: ""
    },


    // ==================================================
    // MOMOS
    // ==================================================

    {
        name: "Veg Momos Steam",
        price: 120,
        category: "momos",
        image: ""
    },

    {
        name: "Tandoori Momos",
        price: 160,
        category: "momos",
        image: ""
    },

    {
        name: "Fried Veg Momos",
        price: 140,
        category: "momos",
        image: ""
    },

    {
        name: "Schezwan Momos",
        price: 150,
        category: "momos",
        image: ""
    },

    {
        name: "Cheese Corn Momos",
        price: 180,
        category: "momos",
        image: ""
    },


    // ==================================================
    // PIZZA
    // ==================================================

    {
        name: "Margherita Pizza",
        price: 160,
        category: "pizza",
        image: ""
    },

    {
        name: "Baby Corn Pizza",
        price: 160,
        category: "pizza",
        image: ""
    },

    {
        name: "Farmhouse Pizza",
        price: 220,
        category: "pizza",
        image: ""
    },

    {
        name: "Paneer Tikka Pizza",
        price: 240,
        category: "pizza",
        image: ""
    },

    {
        name: "Corn Cheese Pizza",
        price: 200,
        category: "pizza",
        image: ""
    },

    {
        name: "Veg Loaded Pizza",
        price: 220,
        category: "pizza",
        image: ""
    },

    {
        name: "Mushroom Pizza",
        price: 220,
        category: "pizza",
        image: ""
    },

    {
        name: "The Sky Special Pizza",
        price: 280,
        category: "pizza",
        image: ""
    },


    // ==================================================
    // PASTA
    // ==================================================

    {
        name: "Veg White Sauce Pasta",
        price: 160,
        category: "pasta",
        image: ""
    },

    {
        name: "Veg Red Sauce Pasta",
        price: 160,
        category: "pasta",
        image: ""
    },

    {
        name: "Veg Pink Sauce Pasta",
        price: 180,
        category: "pasta",
        image: ""
    },

    {
        name: "Cheese Pasta",
        price: 190,
        category: "pasta",
        image: ""
    },

    {
        name: "Arrabbiata Pasta",
        price: 200,
        category: "pasta",
        image: ""
    },

    {
        name: "Alfredo Pasta",
        price: 210,
        category: "pasta",
        image: ""
    },


    // ==================================================
    // CHINESE
    // ==================================================

    {
        name: "Veg Noodles",
        price: 160,
        category: "chinese",
        image: ""
    },

    {
        name: "Hakka Noodles",
        price: 170,
        category: "chinese",
        image: ""
    },

    {
        name: "Schezwan Noodles",
        price: 180,
        category: "chinese",
        image: ""
    },

    {
        name: "Manchurian",
        price: 180,
        category: "chinese",
        image: ""
    },

    {
        name: "Chilli Paneer",
        price: 220,
        category: "chinese",
        image: ""
    },

    {
        name: "Chilli Mushroom",
        price: 220,
        category: "chinese",
        image: ""
    },

    {
        name: "Veg Spring Roll",
        price: 160,
        category: "chinese",
        image: ""
    },

    {
        name: "Schezwan Rice",
        price: 200,
        category: "rice",
        image: ""
    },

    {
        name: "Veg Fried Rice",
        price: 170,
        category: "rice",
        image: ""
    },

    {
        name: "Chilli Garlic Rice",
        price: 190,
        category: "rice",
        image: ""
    },


    // ==================================================
    // RICE
    // ==================================================

    {
        name: "Curd Rice",
        price: 140,
        category: "rice",
        image: ""
    },

    {
        name: "Lemon Rice",
        price: 160,
        category: "rice",
        image: ""
    },

    {
        name: "Kashmiri Pulao",
        price: 220,
        category: "rice",
        image: ""
    },

    {
        name: "Veg Pulao",
        price: 180,
        category: "rice",
        image: ""
    },

    {
        name: "Jeera Rice",
        price: 140,
        category: "rice",
        image: ""
    },

    {
        name: "Steam Rice",
        price: 120,
        category: "rice",
        image: ""
    },


    // ==================================================
    // MAIN COURSE
    // ==================================================

    {
        name: "Stuffed Capsicum",
        price: 200,
        category: "main course",
        image: ""
    },

    {
        name: "Paneer Do Pyaza",
        price: 220,
        category: "main course",
        image: ""
    },

    {
        name: "Mushroom Masala",
        price: 240,
        category: "main course",
        image: ""
    },

    {
        name: "The Sky Special",
        price: 260,
        category: "main course",
        image: ""
    },


    // ==================================================
    // NORTH INDIAN
    // ==================================================

    {
        name: "Shahi Paneer",
        price: 230,
        category: "north indian",
        image: ""
    },

    {
        name: "Kadhai Paneer",
        price: 230,
        category: "north indian",
        image: ""
    },

    {
        name: "Paneer Butter Masala",
        price: 240,
        category: "north indian",
        image: ""
    },

    {
        name: "Paneer Lababdar",
        price: 240,
        category: "north indian",
        image: ""
    },

    {
        name: "Dal Tadka",
        price: 180,
        category: "north indian",
        image: ""
    },

    {
        name: "Dal Makhani",
        price: 200,
        category: "north indian",
        image: ""
    },

    {
        name: "Mix Veg",
        price: 200,
        category: "north indian",
        image: ""
    },

    {
        name: "Veg Kolhapuri",
        price: 220,
        category: "north indian",
        image: ""
    },

    {
        name: "Matar Paneer",
        price: 220,
        category: "north indian",
        image: ""
    },


    // ==================================================
    // SOUTH INDIAN
    // ==================================================

    {
        name: "Masala Dosa",
        price: 140,
        category: "south indian",
        image: ""
    },

    {
        name: "Plain Dosa",
        price: 110,
        category: "south indian",
        image: ""
    },

    {
        name: "Cheese Dosa",
        price: 180,
        category: "south indian",
        image: ""
    },

    {
        name: "Paneer Dosa",
        price: 190,
        category: "south indian",
        image: ""
    },

    {
        name: "Idli Sambhar",
        price: 100,
        category: "south indian",
        image: ""
    },

    {
        name: "Vada Sambhar",
        price: 110,
        category: "south indian",
        image: ""
    },

    {
        name: "Masala Uttapam",
        price: 140,
        category: "south indian",
        image: ""
    },


    // ==================================================
    // BEVERAGES
    // ==================================================

    {
        name: "Masala Tea",
        price: 60,
        category: "beverages",
        image: ""
    },

    {
        name: "Cold Coffee",
        price: 120,
        category: "beverages",
        image: ""
    },

    {
        name: "Cold Coffee With Ice Cream",
        price: 160,
        category: "beverages",
        image: ""
    },

    {
        name: "Fresh Lime Soda",
        price: 90,
        category: "beverages",
        image: ""
    },

    {
        name: "Virgin Mojito",
        price: 140,
        category: "beverages",
        image: ""
    },

    {
        name: "Blue Lagoon",
        price: 150,
        category: "beverages",
        image: ""
    },

    {
        name: "Mango Shake",
        price: 140,
        category: "beverages",
        image: ""
    },

    {
        name: "Chocolate Shake",
        price: 150,
        category: "beverages",
        image: ""
    },

    {
        name: "Oreo Shake",
        price: 160,
        category: "beverages",
        image: ""
    },

    {
        name: "Strawberry Shake",
        price: 150,
        category: "beverages",
        image: ""
    }

];


// ======================================================
// NORMALIZE TEXT
// ======================================================

function normalizeText(value) {

    return String(value || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");

}


// ======================================================
// NORMALIZE CATEGORY
// ======================================================

function normalizeCategory(value) {

    const category = normalizeText(value);

    const categoryMap = {

        "tandoor starter": "tandoor",

        "tandoor": "tandoor",

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

    return categoryMap[category] || category;

}


// ======================================================
// SEED MENU FUNCTION
// ======================================================

async function seedMenu() {

    console.log("========================================");
    console.log("🍽️ SKY HOUSE CAFE MENU SEEDER");
    console.log("========================================");

    // --------------------------------------------------
    // CHECK LOGIN
    // --------------------------------------------------

    if (!auth.currentUser) {

        throw new Error(
            "Admin login नहीं मिला। पहले Admin Login करो और फिर Seeder चलाओ।"
        );

    }

    console.log(
        "👤 Logged in:",
        auth.currentUser.email
    );


    // --------------------------------------------------
    // GET FIRESTORE MENU COLLECTION
    // --------------------------------------------------

    const menuRef = collection(db, "menu");

    console.log("🔄 Reading existing menu...");

    const snapshot = await getDocs(menuRef);

    console.log(
        "📦 Existing Firestore items:",
        snapshot.size
    );


    // --------------------------------------------------
    // CREATE EXISTING ITEM MAP
    // --------------------------------------------------

    const existingItems = new Map();


    snapshot.forEach((snapshotDoc) => {

        const data = snapshotDoc.data();

        const name = normalizeText(data.name);

        const category = normalizeCategory(
            data.category
        );

        const key = `${name}|${category}`;


        existingItems.set(key, {

            id: snapshotDoc.id,

            data: data

        });

    });


    // --------------------------------------------------
    // COUNTERS
    // --------------------------------------------------

    let added = 0;

    let updated = 0;

    let failed = 0;


    // --------------------------------------------------
    // PROCESS ALL MENU ITEMS
    // --------------------------------------------------

    for (let i = 0; i < menuItems.length; i++) {

        const item = menuItems[i];


        try {

            const name = normalizeText(
                item.name
            );

            const category = normalizeCategory(
                item.category
            );


            const key =
                `${name}|${category}`;


            const existing =
                existingItems.get(key);


            // ------------------------------------------
            // DATA TO SAVE
            // ------------------------------------------

            const data = {

                name: item.name,

                price: Number(item.price),

                category: category,

                available: true,

                updatedAt: serverTimestamp()

            };


            // ------------------------------------------
            // IMAGE
            // ------------------------------------------
            // Existing image should NEVER be deleted.
            // ------------------------------------------

            if (
                existing &&
                existing.data &&
                existing.data.image
            ) {

                data.image =
                    existing.data.image;

            } else {

                data.image =
                    item.image || "";

            }


            // ------------------------------------------
            // UPDATE EXISTING
            // ------------------------------------------

            if (existing) {

                await updateDoc(

                    doc(
                        db,
                        "menu",
                        existing.id
                    ),

                    data

                );

                updated++;


                console.log(
                    `🔄 ${i + 1}/${menuItems.length} Updated: ${item.name}`
                );

            }


            // ------------------------------------------
            // ADD NEW
            // ------------------------------------------

            else {

                const newDoc =
                    await addDoc(

                        menuRef,

                        {

                            ...data,

                            createdAt:
                                serverTimestamp()

                        }

                    );


                added++;


                console.log(
                    `✅ ${i + 1}/${menuItems.length} Added: ${item.name}`,
                    newDoc.id
                );

            }

        }

        catch (error) {

            failed++;

            console.error(
                `❌ Failed: ${item.name}`,
                error
            );

        }

    }


    // ==================================================
    // FINAL RESULT
    // ==================================================

    console.log("========================================");

    console.log(
        "🎉 MENU SEED COMPLETE"
    );

    console.log(
        "➕ Added:",
        added
    );

    console.log(
        "🔄 Updated:",
        updated
    );

    console.log(
        "❌ Failed:",
        failed
    );

    console.log(
        "🍽️ Seed Items:",
        menuItems.length
    );

    console.log("========================================");


    // --------------------------------------------------
    // IF SOME ITEMS FAILED
    // --------------------------------------------------

    if (failed > 0) {

        throw new Error(
            `${failed} menu items failed. Console में details देखें।`
        );

    }


    // --------------------------------------------------
    // RETURN RESULT TO seed-menu.html
    // --------------------------------------------------

    return {

        added: added,

        updated: updated,

        failed: failed,

        total: menuItems.length

    };

}


// ======================================================
// EXPORT
// ======================================================

export {

    seedMenu

};