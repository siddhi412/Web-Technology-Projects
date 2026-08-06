// Variables
var customerName = "Siddhi";
let accountBalance = 50000;
const bankName = "Secure Bank Ltd.";

// Function
function calculateInterest() {

    let principal = Number(document.getElementById("principal").value);

    let rate = 8;
    let time = 2;

    let interest = (principal * rate * time) / 100;

    document.getElementById("result").innerHTML =
        "Interest = ₹" + interest;
}