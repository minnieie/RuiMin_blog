document.addEventListener("DOMContentLoaded", () => {
    const checkoutForm = document.getElementById("checkout-form");
    const completeCheckoutBtn = document.getElementById("complete-checkout");
    const thankYouMessage = document.getElementById("thank-you-message");

    // Add an element for error messages
    const errorMessageContainer = document.createElement("div");
    errorMessageContainer.style.color = "red";
    checkoutForm.insertBefore(errorMessageContainer, checkoutForm.firstChild);

    // Event listener for the complete checkout button
    completeCheckoutBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        // Clear any previous error messages
        errorMessageContainer.innerHTML = "";

        // Get user inputs
        const email = document.getElementById("email").value;
        const country = document.getElementById("country").value;
        const firstName = document.getElementById("first-name").value;
        const lastName = document.getElementById("last-name").value;
        const address = document.getElementById("address").value;
        const postalCode = document.getElementById("postal-code").value;

        let isValid = true;

        // Input validation
        if (!email) {
            errorMessageContainer.innerHTML += "<p>Please enter your email address.</p>";
            isValid = false;
        }

        if (!firstName) {
            errorMessageContainer.innerHTML += "<p>Please enter your first name.</p>";
            isValid = false;
        }

        if (!lastName) {
            errorMessageContainer.innerHTML += "<p>Please enter your last name.</p>";
            isValid = false;
        }

        if (!address) {
            errorMessageContainer.innerHTML += "<p>Please enter your address.</p>";
            isValid = false;
        }

        if (!postalCode) {
            errorMessageContainer.innerHTML += "<p>Please enter your postal code.</p>";
            isValid = false;
        }

        // Example of additional validation (optional, e.g., email format check)
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (email && !emailPattern.test(email)) {
            errorMessageContainer.innerHTML += "<p>Please enter a valid email address.</p>";
            isValid = false;
        }

        // If all fields are valid, proceed with the submission
        if (isValid) {
     
            checkoutForm.style.display = "none";

            thankYouMessage.style.display = "block";

            checkoutForm.reset();
        
            localStorage.removeItem('cartItems');
        }
    });

    // Function to update the order summary dynamically, including images
    function updateOrderSummary() {
        const orderItems = document.querySelector('#order-items');
        const totalFee = document.querySelector('#total-fee');
        orderItems.innerHTML = ''; // Clear previous items

        let total = 0;
        const cart = JSON.parse(localStorage.getItem('cartItems')) || []; // Ensure cart data is loaded
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('order-item');
            itemElement.innerHTML = `
                <div class="order-item-image">
                    <img src="${item.image}" alt="${item.title}" />
                </div>
                <div class="order-item-details">
                    <p>${item.title} - ${item.quantity} x $${item.price.toFixed(2)}</p>
                    <p><strong>Total: $${(item.quantity * item.price).toFixed(2)}</strong></p>
                </div>
            `;
            orderItems.appendChild(itemElement);
            total += item.quantity * item.price;
        });

        totalFee.textContent = total.toFixed(2); // Show total with 2 decimal places
    }

    // Call the updateOrderSummary function on page load to populate the order details
    window.onload = updateOrderSummary;
});

// Event listener for Express Checkout buttons (optional)
const expressButtons = document.querySelectorAll('.express-btn');
expressButtons.forEach(button => {
    button.addEventListener('click', function () {
        alert(`You chose to pay with ${button.textContent}`);
    });
});

// JavaScript to show "Thank You" message and hide checkout section after completion
document.getElementById('complete-checkout').addEventListener('click', function(event) {
    event.preventDefault();  // Explicitly prevent form submission

    // Validate the form before continuing
    const isValid = validateForm();
    if (isValid) {
        // Hide the checkout and order summary sections
        document.getElementById('checkout-section').style.display = 'none';
        document.getElementById('order-summary-section').style.display = 'none';

        // Show the "Thank You" message
        document.getElementById('thank-you-message').style.display = 'block';
    }
});

// Form validation function
function validateForm() {
    const email = document.getElementById("email").value;
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;
    const address = document.getElementById("address").value;
    const postalCode = document.getElementById("postal-code").value;

    let isValid = true;
    const errorMessageContainer = document.querySelector("#checkout-form div");

    // Clear previous errors
    errorMessageContainer.innerHTML = '';

    if (!email) {
        errorMessageContainer.innerHTML += "<p>Please enter your email address.</p>";
        isValid = false;
    }

    if (!firstName) {
        errorMessageContainer.innerHTML += "<p>Please enter your first name.</p>";
        isValid = false;
    }

    if (!lastName) {
        errorMessageContainer.innerHTML += "<p>Please enter your last name.</p>";
        isValid = false;
    }

    if (!address) {
        errorMessageContainer.innerHTML += "<p>Please enter your address.</p>";
        isValid = false;
    }

    if (!postalCode) {
        errorMessageContainer.innerHTML += "<p>Please enter your postal code.</p>";
        isValid = false;
    }

    // Additional validation for email format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (email && !emailPattern.test(email)) {
        errorMessageContainer.innerHTML += "<p>Please enter a valid email address.</p>";
        isValid = false;
    }

    return isValid;
}
