import { db } from "../firebase/firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


// =========================================
// VARIABLES
// =========================================

let menu = [];

let editId = null;


// =========================================
// DOM
// =========================================

const nameInput =
    document.getElementById("name");

const priceInput =
    document.getElementById("price");

const categoryInput =
    document.getElementById("category");

const imageInput =
    document.getElementById("image");

const menuTable =
    document.getElementById("menuTable");


// =========================================
// LOAD MENU
// =========================================

async function loadMenu() {

    try {

        menu = [];

        const snapshot =
            await getDocs(
                collection(db, "menu")
            );


        snapshot.forEach((item) => {

            menu.push({

                id: item.id,

                ...item.data()

            });

        });


        displayMenu(menu);


    } catch (error) {

        console.error(
            "Load Menu Error:",
            error
        );

        alert(
            "❌ Menu load nahi ho raha."
        );

    }

}


// =========================================
// ADD / UPDATE ITEM
// =========================================

window.saveItem = async function () {

    const name =
        nameInput.value.trim();

    const price =
        Number(priceInput.value);

    const category =
        categoryInput.value.trim();

    const image =
        imageInput
            ? imageInput.value.trim()
            : "";


    // Validation

    if (
        name === "" ||
        !price ||
        category === ""
    ) {

        alert(
            "⚠️ Please fill Item Name, Price and Category."
        );

        return;

    }


    try {


        // =====================================
        // UPDATE
        // =====================================

        if (editId) {

            await updateDoc(

                doc(
                    db,
                    "menu",
                    editId
                ),

                {

                    name: name,

                    price: price,

                    category: category,

                    image: image

                }

            );


            alert(
                "✅ Item Updated Successfully"
            );

        }


        // =====================================
        // ADD
        // =====================================

        else {

            await addDoc(

                collection(
                    db,
                    "menu"
                ),

                {

                    name: name,

                    price: price,

                    category: category,

                    image: image

                }

            );


            alert(
                "✅ Item Added Successfully"
            );

        }


        clearForm();

        await loadMenu();


    } catch (error) {

        console.error(
            "Save Item Error:",
            error
        );

        alert(
            "❌ Item save nahi hua."
        );

    }

};


// =========================================
// EDIT ITEM
// =========================================

window.editItem = function (index) {

    const item =
        menu[index];


    if (!item) {

        return;

    }


    nameInput.value =
        item.name || "";


    priceInput.value =
        item.price || "";


    categoryInput.value =
        item.category || "";


    if (imageInput) {

        imageInput.value =
            item.image || "";

    }


    editId =
        item.id;


    const saveButton =
        document.getElementById(
            "saveBtn"
        );


    if (saveButton) {

        saveButton.innerText =
            "Update Item";

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

};


// =========================================
// DELETE ITEM
// =========================================

window.deleteItem = async function (index) {

    const item =
        menu[index];


    if (!item) {

        return;

    }


    const confirmDelete =
        confirm(
            `Delete "${item.name}"?`
        );


    if (!confirmDelete) {

        return;

    }


    try {

        await deleteDoc(

            doc(
                db,
                "menu",
                item.id
            )

        );


        alert(
            "🗑️ Item Deleted"
        );


        await loadMenu();


    } catch (error) {

        console.error(
            "Delete Error:",
            error
        );

        alert(
            "❌ Item delete nahi hua."
        );

    }

};


// =========================================
// DISPLAY MENU
// =========================================

function displayMenu(list) {

    if (!menuTable) {

        console.error(
            "menuTable element not found"
        );

        return;

    }


    let table = `

        <tr>

            <th>Image</th>

            <th>Item</th>

            <th>Category</th>

            <th>Price</th>

            <th>Action</th>

        </tr>

    `;


    if (list.length === 0) {

        table += `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:30px;
                    "
                >

                    No Menu Items Found

                </td>

            </tr>

        `;

    }


    list.forEach((item) => {


        let image =
            item.image || "";


        if (
            image.startsWith("/")
        ) {

            image =
                ".." + image;

        }


        table += `

            <tr>

                <td>

                    ${
                        image

                        ?

                        `<img
                            src="${image}"
                            alt="${item.name}"
                            style="
                                width:60px;
                                height:60px;
                                object-fit:cover;
                                border-radius:8px;
                            "
                            onerror="
                                this.style.display='none';
                            "
                        >`

                        :

                        "🍽️"
                    }

                </td>


                <td>
                    ${item.name || "-"}
                </td>


                <td>
                    ${item.category || "-"}
                </td>


                <td>
                    ₹${item.price || 0}
                </td>


                <td>

                    <button
                        onclick="editItem(${menu.indexOf(item)})"
                    >
                        ✏️ Edit
                    </button>


                    <button
                        onclick="deleteItem(${menu.indexOf(item)})"
                    >
                        🗑️ Delete
                    </button>

                </td>

            </tr>

        `;

    });


    menuTable.innerHTML =
        table;

}


// =========================================
// SEARCH
// =========================================

window.searchMenu = function () {

    const search =
        document
            .getElementById("searchMenu")
            ?.value
            .toLowerCase()
            .trim();


    if (!search) {

        displayMenu(menu);

        return;

    }


    const filtered =
        menu.filter((item) => {

            const name =
                String(
                    item.name || ""
                ).toLowerCase();


            const category =
                String(
                    item.category || ""
                ).toLowerCase();


            return (
                name.includes(search) ||
                category.includes(search)
            );

        });


    displayMenu(filtered);

};


// =========================================
// CLEAR FORM
// =========================================

window.clearForm = function () {

    nameInput.value = "";

    priceInput.value = "";

    categoryInput.value = "";


    if (imageInput) {

        imageInput.value = "";

    }


    editId = null;


    const saveButton =
        document.getElementById(
            "saveBtn"
        );


    if (saveButton) {

        saveButton.innerText =
            "Add Item";

    }

};


// =========================================
// INITIALIZE
// =========================================

loadMenu();