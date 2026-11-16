function selectFood(foodName) {
    document.getElementById("foodSelect").value = foodName;
    document.getElementById("order").scrollIntoView();
}

document.getElementById("orderForm").addEventListener("submit", function(event) {
    event.preventDefault();
    let name = document.getElementById("name").value;
    let food = document.getElementById("foodSelect").value;
    alert("Thank you " + name + "! Your order for " + food + " has been placed.");
    document.getElementById("orderForm").reset();
});