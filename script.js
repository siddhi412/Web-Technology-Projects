// Practical 4: Simple DOM Manipulation and Event Handling

// 1. Select an HTML element and change its text.
const changeButton = document.getElementById("changeButton");

changeButton.addEventListener("click", function () {
    document.getElementById("message").textContent =
        "The button was clicked. JavaScript changed this text!";
});


// 2. Change the background colour of a section.
const colorButton = document.getElementById("colorButton");

colorButton.addEventListener("click", function () {
    // querySelector() selects the first section on the page.
    const section = document.querySelectorAll("section")[1];

    section.style.backgroundColor = "#ffccf4";
});


// 3. Respond to mouseover and mouseout events.
const mouseBox = document.getElementById("mouseBox");

mouseBox.addEventListener("mouseover", function () {
    mouseBox.textContent = "Your mouse is inside the box!";
    mouseBox.style.backgroundColor = "#c8f7dc";
});

mouseBox.addEventListener("mouseout", function () {
    mouseBox.textContent = "Move your mouse over this box.";
    mouseBox.style.backgroundColor = "#dce8ff";
});


// 4. Read text entered by the user and display a greeting.
const greetButton = document.getElementById("greetButton");

greetButton.addEventListener("click", function () {
    const name = document.getElementById("nameInput").value;

    if (name.trim() === "") {
        document.getElementById("greeting").textContent =
            "Please enter your name.";
    } else {
        document.getElementById("greeting").textContent =
            "Hello, " + name + "! Welcome to the webpage.";
    }
});


// 5. Create a new list item and add it to the page.
const addButton = document.getElementById("addButton");

addButton.addEventListener("click", function () {
    const itemName = document.getElementById("itemInput").value.trim();

    if (itemName === "") {
        alert("Please enter an item.");
        return;
    }

    // createElement() creates a new HTML <li> element.
    const newItem = document.createElement("li");

    // textContent sets the text inside the new element.
    newItem.textContent = itemName;

    // appendChild() adds the new item to the list.
    document.getElementById("itemList").appendChild(newItem);

    document.getElementById("itemInput").value = "";
});


// 6. Remove the last item from the list.
const removeButton = document.getElementById("removeButton");

removeButton.addEventListener("click", function () {
    const list = document.getElementById("itemList");

    if (list.lastElementChild) {
        // remove() deletes the selected element from the page.
        list.lastElementChild.remove();
    } else {
        alert("There are no items left to remove.");
    }
});