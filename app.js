const destinations = [
    {
        name: "Paris",
        description: "The city of light and love, known for the Eiffel Tower and rich cultural history.",
        image: "media/paris.jpg"
    },
    {
        name: "Tokyo",
        description: "A bustling metropolis blending the modern and the traditional.",
        image: "media/tokyo.jpg"
    },
    {
        name: "Bali",
        description: "A tropical paradise offering beautiful beaches and a serene atmosphere.",
        image: "media/bali.jpg"
    }
];

// Function to render destination cards
function displayDestinations() {
    const grid = document.querySelector(".recommendation-grid");
    destinations.forEach(destination => {
        const card = `
            <div class="destination-card">
                <img src="${destination.image}" alt="${destination.name}">
                <h3>${destination.name}</h3>
                <p>${destination.description}</p>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// Call the function to display destinations on page load
document.addEventListener("DOMContentLoaded", displayDestinations);

document.getElementById('search-btn').addEventListener('click', function () {
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    const filteredDestinations = destinations.filter(destination =>
        destination.name.toLowerCase().includes(searchQuery) ||
        destination.description.toLowerCase().includes(searchQuery)
    );
    document.querySelector(".recommendation-grid").innerHTML = ''; // Clear existing content
    filteredDestinations.forEach(destination => {
        const card = `
            <div class="destination-card">
                <img src="${destination.image}" alt="${destination.name}">
                <h3>${destination.name}</h3>
                <p>${destination.description}</p>
            </div>
        `;
        document.querySelector(".recommendation-grid").innerHTML += card;
    });
});
