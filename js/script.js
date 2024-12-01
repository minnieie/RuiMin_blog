let cart = JSON.parse(localStorage.getItem('cartItems')) || []; // Load cart items from localStorage (or initialize as empty array)
let totalPrice = 0; // Total price of items in cart

// Function to show product detail popup
function showProductDetail(title, price, imageSrc) {
    console.log("Showing product detail for:", title);
    document.getElementById("popupTitle").textContent = title;
    document.getElementById("popupPrice").textContent = `$${price.toFixed(2)}`;
    document.getElementById("popupImage").src = imageSrc;
    document.getElementById("productDetailPopup").style.display = "block";
    document.getElementById("overlay").style.display = "block";
}

// Function to close product detail popup
function closePopup() {
    document.getElementById("productDetailPopup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
}

// Function to dynamically attach click events to product items
function attachProductDetailListeners() {
    const productItems = document.querySelectorAll('.product-item'); // Adjust selector to your HTML
    productItems.forEach(item => {
        item.addEventListener('click', function () {
            const title = this.getAttribute('data-title');
            const price = parseFloat(this.getAttribute('data-price'));
            const imageSrc = this.getAttribute('data-image');

            if (title && !isNaN(price) && imageSrc) {
                showProductDetail(title, price, imageSrc);
            } else {
                console.error('Product details are missing or invalid.');
            }
        });
    });
}

// Function to show cart confirmation popup
function showCartConfirmation() {
    const cartConfirmationPopup = document.getElementById("cartConfirmationPopup");
    const cartItemList = document.getElementById("cartItemList");

    cartItemList.innerHTML = ''; // Clear the cart item list
    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.title}" />
            <div class="cart-item-info">
                <h3>${item.title}</h3>
                <p>$${item.price.toFixed(2)}</p>
                <div class="quantity">
                    <button class="quantity-btn" onclick="changeQuantity('${item.title}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeQuantity('${item.title}', 1)">+</button>
                </div>
                <button class="remove-item" onclick="removeItem('${item.title}')">Remove</button>
            </div>
        `;
        cartItemList.appendChild(cartItem);
    });

    // Recalculate total price
    totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    document.getElementById("totalPrice").textContent = totalPrice.toFixed(2);

    updateCartIcon(); // Update the cart icon count

    // Make the cart confirmation popup visible
    cartConfirmationPopup.classList.add("show");

    // Optionally hide the store section (for mobile views)
    document.querySelector(".store-section").style.display = "none"; 
}

// Function to change item quantity
function changeQuantity(title, change) {
    let item = cart.find(item => item.title === title);
    if (item) {
        item.quantity += change;
        if (item.quantity < 1) item.quantity = 1; // Prevent quantity from being less than 1
        localStorage.setItem('cartItems', JSON.stringify(cart)); 
    }

    // Re-render cart after quantity change
    showCartConfirmation();
}

// Function to remove item from cart
function removeItem(title) {
    cart = cart.filter(item => item.title !== title);
    localStorage.setItem('cartItems', JSON.stringify(cart));
    showCartConfirmation();
}

// Function to close cart popup
function closeCartPopup() {
    document.getElementById("cartConfirmationPopup").classList.remove("show");

    // Show the store section again (for mobile views)
    document.querySelector(".store-section").style.display = "block";
}

// Function to update cart icon count
function updateCartIcon() {
    const cartCount = document.getElementById("cart-count");
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = itemCount;
}

// Add event listener for "Add to Cart" button
document.getElementById("addToCartButton").addEventListener("click", function () {
    const title = document.getElementById("popupTitle").textContent;
    const price = parseFloat(document.getElementById("popupPrice").textContent.replace('$', ''));
    const imageSrc = document.getElementById("popupImage").src;

    if (!title || !price || !imageSrc) {
        console.error("Product details are incomplete.");
        return;
    }

    let existingProduct = cart.find(item => item.title === title);
    if (existingProduct) {
        existingProduct.quantity += 1; // If product exists, increase quantity
    } else {
        cart.push({ title, price, image: imageSrc, quantity: 1 }); // Add new product to cart
    }

    localStorage.setItem('cartItems', JSON.stringify(cart)); // Save updated cart to localStorage
    showCartConfirmation(); // Re-render cart with updated data
    closePopup();
});

// Event listener for "Continue Shopping" button
document.getElementById("continueShoppingButton").addEventListener("click", closeCartPopup);

// Event listener for "Go to Cart" button
document.getElementById("goToCartButton").addEventListener("click", function () {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items to the cart before checking out.");
    } else {
        window.location.href = "cart.html"; 
    }
});

// Function to load cart items on the cart page
function loadCartItems() {
    const orderItemsContainer = document.getElementById('order-items');
    const totalFeeContainer = document.getElementById('total-fee');
    let totalFee = 0;

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        itemDiv.innerHTML = `
            <p>${item.title} (x${item.quantity})</p>
            <p>$${item.price * item.quantity}</p>
        `;
        orderItemsContainer.appendChild(itemDiv);
        totalFee += item.price * item.quantity;
    });

    totalFeeContainer.textContent = totalFee.toFixed(2);
}

// Update cart icon and attach event listeners on every page load
window.onload = function () {
    updateCartIcon();
    attachProductDetailListeners();

    // Ensure popup is hidden on load
    document.getElementById("productDetailPopup").style.display = "none";
    document.getElementById("overlay").style.display = "none";
};
