// ======================================================
// 🍽️ SKY HOUSE CAFE
// FIRESTORE FOOD IMAGE UPDATER
// ======================================================
// Uses the REAL image filenames present in image/food/.
//
// IMPORTANT:
// Firestore image paths are relative to customer/menu.html:
// ../image/food/filename
// ======================================================

import { db } from "../firebase/firebase.js";

import {
    collection,
    getDocs,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


// ======================================================
// EXACT IMAGE FILES AVAILABLE IN THE PROJECT
// ======================================================

const FOOD = "../image/food/";

// Specific item -> exact project image
const imageMap = {

    // TANDOOR / PANEER
    "paneer tikka": FOOD + "paneer-tikka.jpg",
    "achari paneer tikka": FOOD + "paneer-tikka.jpg",
    "malai paneer tikka": FOOD + "paneer-tikka.jpg",

    // MOMOS
    "veg momos steam": FOOD + "momos.jpg",
    "tandoori momos": FOOD + "tandoori momos.jpg.png",
    "fried veg momos": FOOD + "momos.jpg",
    "schezwan momos": FOOD + "momos.jpg",
    "cheese corn momos": FOOD + "momos.jpg",

    // PIZZA
    "margherita pizza": FOOD + "margherita pizza.jpg.png",
    "paneer tikka pizza": FOOD + "paneer-pizza.jpg",
    "baby corn pizza": FOOD + "pizza.jpeg",
    "farmhouse pizza": FOOD + "pizza.jpeg",
    "corn cheese pizza": FOOD + "pizza.jpeg",
    "veg loaded pizza": FOOD + "pizza.jpeg",
    "mushroom pizza": FOOD + "pizza.jpeg",
    "the sky special pizza": FOOD + "pizza.jpeg",

    // PASTA
    "veg white sauce pasta": FOOD + "white sauce pasta.jpg.png",
    "veg red sauce pasta": FOOD + "red-pasta.jpeg",
    "veg pink sauce pasta": FOOD + "pasta.jpeg",
    "cheese pasta": FOOD + "pasta.jpeg",
    "arrabbiata pasta": FOOD + "red-pasta.jpeg",
    "alfredo pasta": FOOD + "white sauce pasta.jpg.png",

    // CHINESE
    "veg noodles": FOOD + "veg noodles.jpg.png",
    "hakka noodles": FOOD + "veg noodles.jpg.png",
    "schezwan noodles": FOOD + "veg noodles.jpg.png",
    "manchurian": FOOD + "crispy corn.jpg",
    "chilli paneer": FOOD + "chilli paneer.jpeg",
    "chilli mushroom": FOOD + "chilli paneer.jpeg",
    "veg spring roll": FOOD + "crispy corn.jpg",
    "crispy corn": FOOD + "crispy corn.jpg",
    "baby corn chilli": FOOD + "crispy corn.jpg",
    "honey chilli potato": FOOD + "crispy corn.jpg",

    // RICE
    "schezwan rice": FOOD + "briyani.jpg",
    "veg fried rice": FOOD + "briyani.jpg",
    "chilli garlic rice": FOOD + "briyani.jpg",
    "curd rice": FOOD + "briyani.jpg",
    "lemon rice": FOOD + "briyani.jpg",
    "kashmiri pulao": FOOD + "briyani.jpg",
    "veg pulao": FOOD + "briyani.jpg",
    "jeera rice": FOOD + "briyani.jpg",
    "steam rice": FOOD + "briyani.jpg",

    // OTHER AVAILABLE FOOD
    "pav bhaji": FOOD + "chole bhature.jpg",
    "chana chilli": FOOD + "crispy corn.jpg",
    "chana roast": FOOD + "crispy corn.jpg",
    "french fries": FOOD + "crispy corn.jpg",
    "cheese balls": FOOD + "crispy corn.jpg",

    // NORTH INDIAN / MAIN COURSE
    "shahi paneer": FOOD + "chilli paneer.jpeg",
    "kadhai paneer": FOOD + "chilli paneer.jpeg",
    "paneer butter masala": FOOD + "chilli paneer.jpeg",
    "paneer lababdar": FOOD + "chilli paneer.jpeg",
    "paneer do pyaza": FOOD + "chilli paneer.jpeg",
    "matar paneer": FOOD + "chilli paneer.jpeg",
    "mushroom masala": FOOD + "chilli paneer.jpeg",
    "mix veg": FOOD + "chole bhature.jpg",
    "veg kolhapuri": FOOD + "chole bhature.jpg",
    "stuffed capsicum": FOOD + "chole bhature.jpg",
    "the sky special": FOOD + "chole bhature.jpg",

    // TANDOOR ITEMS WITHOUT DEDICATED PHOTO
    "chatpata tandoori chaap": FOOD + "paneer-tikka.jpg",
    "afghani chaap": FOOD + "paneer-tikka.jpg",
    "masala chaap": FOOD + "paneer-tikka.jpg",
    "tandoori mushroom": FOOD + "paneer-tikka.jpg",
    "tandoori aloo": FOOD + "paneer-tikka.jpg",
    "crispy harabhara kabab": FOOD + "crispy corn.jpg",

    // SOUTH INDIAN - no dedicated South Indian photos exist
    // in the uploaded project, so use the closest available
    // food photo rather than the Sky House logo.
    "masala dosa": FOOD + "chole bhature.jpg",
    "plain dosa": FOOD + "chole bhature.jpg",
    "cheese dosa": FOOD + "chole bhature.jpg",
    "paneer dosa": FOOD + "chilli paneer.jpeg",
    "idli sambhar": FOOD + "chole bhature.jpg",
    "vada sambhar": FOOD + "chole bhature.jpg",
    "masala uttapam": FOOD + "chole bhature.jpg",

    // BEVERAGES - no beverage photos exist in the project.
    // Use a food photo only as a temporary non-logo fallback.
    "masala tea": FOOD + "pasta.jpeg",
    "cold coffee": FOOD + "pasta.jpeg",
    "cold coffee with ice cream": FOOD + "pasta.jpeg",
    "fresh lime soda": FOOD + "pasta.jpeg",
    "virgin mojito": FOOD + "pasta.jpeg",
    "blue lagoon": FOOD + "pasta.jpeg",
    "mango shake": FOOD + "pasta.jpeg",
    "chocolate shake": FOOD + "pasta.jpeg",
    "oreo shake": FOOD + "pasta.jpeg",
    "strawberry shake": FOOD + "pasta.jpeg"
};


// ======================================================
// NORMALIZE
// ======================================================

function normalize(value) {
    return String(value || "")
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}


// ======================================================
// UPDATE FIRESTORE
// ======================================================

async function updateImages() {

    console.log("========================================");
    console.log("🍽️ SKY HOUSE FOOD IMAGE UPDATE");
    console.log("========================================");

    try {

        const snapshot =
            await getDocs(collection(db, "menu"));

        console.log(
            "📦 Menu documents found:",
            snapshot.size
        );

        let updated = 0;
        let skipped = 0;

        for (const menuDoc of snapshot.docs) {

            const data = menuDoc.data();

            const name = normalize(data.name);

            const image = imageMap[name];

            if (!image) {

                console.warn(
                    "⚠️ No image mapping:",
                    data.name
                );

                skipped++;
                continue;
            }

            await updateDoc(
                doc(db, "menu", menuDoc.id),
                {
                    image: image
                }
            );

            console.log(
                `✅ ${data.name} → ${image}`
            );

            updated++;
        }

        console.log("========================================");
        console.log("🎉 IMAGE UPDATE COMPLETE");
        console.log("✅ Updated:", updated);
        console.log("⏭️ Skipped:", skipped);
        console.log("📦 Total:", snapshot.size);
        console.log("========================================");

        alert(
            `Image Update Complete!\\n\\n` +
            `Updated: ${updated}\\n` +
            `Skipped: ${skipped}\\n` +
            `Total: ${snapshot.size}`
        );

    } catch (error) {

        console.error(
            "❌ Image update failed:",
            error
        );

        alert(
            "❌ Image update failed. Open F12 → Console and check the error."
        );
    }
}


// ======================================================
// START
// ======================================================

updateImages();
