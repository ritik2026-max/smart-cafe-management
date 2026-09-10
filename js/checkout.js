function placeOrder(){

let cart = JSON.parse(localStorage.getItem("cart")) || [];

let name = document.getElementById("customerName").value;
let table = document.getElementById("tableNo").value;

if(name=="" || table==""){
    alert("Please fill all details");
    return;
}

let message = `🍽️ New Order

Name : ${name}
Table : ${table}

`;

let total=0;

cart.forEach(item=>{

message += `${item.name} - ₹${item.price}\n`;

total += item.price;

});

message += `\nTotal : ₹${total}`;

let phone="9685989854";   // <-- yahan apna WhatsApp number likhna

window.open(
`https://wa.me/${phone}?text=${encodeURIComponent(message)}`
);

}