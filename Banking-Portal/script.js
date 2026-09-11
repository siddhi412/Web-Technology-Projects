// Variables
var bankName = "Secure Bank Ltd.";
let customer = "Regular";
const minIncome = 25000;


// Function to calculate interest
function interest(amount, rate, time) {
    return (amount * rate * time) / 100;
}


// Main function
function calculate() {

    let amount = Number(document.getElementById("amount").value);
    let rate = Number(document.getElementById("rate").value);
    let time = Number(document.getElementById("time").value);
    let income = Number(document.getElementById("income").value);

    let result = "";

    // Arithmetic operator
    let int = interest(amount, rate, time);
    let total = amount + int;

    result += "Bank: " + bankName + "<br>";
    result += "Customer: " + customer + "<br>";
    result += "Interest = ₹" + int + "<br>";
    result += "Total Amount = ₹" + total + "<br>";


    // If-else and logical operators
    if (income >= minIncome && amount <= income * 10) {
        result += "Loan Status: Eligible<br>";
    }
    else {
        result += "Loan Status: Not Eligible<br>";
    }


    // Conditional operator
    let status = income >= minIncome ? "Good Income" : "Low Income";
    result += "Income: " + status + "<br>";


    // Nested if
    if (income >= minIncome) {
        if (amount <= income * 10) {
            result += "Loan condition is satisfied.<br>";
        }
    }


    // Switch statement
    let choice = 1;

    switch (choice) {
        case 1:
            result += "Account Type: Savings<br>";
            break;

        case 2:
            result += "Account Type: Current<br>";
            break;

        default:
            result += "Invalid Account Type<br>";
    }


    // For loop
    result += "<br>Interest for each year:<br>";

    for (let i = 1; i <= time; i++) {
        result += "Year " + i + " = ₹" +
                  interest(amount, rate, i) + "<br>";
    }


    // While loop
    result += "<br>While Loop:<br>";

    let i = 1;

    while (i <= 3) {
        result += "Account Summary " + i + "<br>";
        i++;
    }


    // Do-while loop
    result += "<br>Do-While Loop:<br>";

    let j = 1;

    do {
        result += "Transaction " + j + "<br>";
        j++;
    } while (j <= 3);


    // Display result
    document.getElementById("result").innerHTML = result;
}