document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("subscribe-form");
    const thankYouMessage = document.getElementById("thank-you-message");

    form.addEventListener("submit", (event) => {
        event.preventDefault(); 

        const username = document.getElementById("username").value;  // Get username input
        const email = document.getElementById("email").value;
        const country = document.getElementById("country").value;

        // Hide the form
        form.style.display = "none";

        // Show the thank-you message with the username
        thankYouMessage.textContent = `Thank you ${username} for subscribing to our updates!`;
        thankYouMessage.style.display = "block";

        form.reset();
    });
});

