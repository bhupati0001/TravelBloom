document.addEventListener('DOMContentLoaded', () => {
    const recommendationGrid = document.getElementById('recommendation-grid');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const clearBtn = document.getElementById('clear-btn'); // New Clear button
    const filterButtons = document.querySelectorAll('#filters .filter-btn');
    const filterAll = document.getElementById('filter-all');
    const pagination = document.getElementById('pagination');

    let page = 0;
    const pageSize = 6; // Number of items per page
    let currentFilter = 'all'; // Default filter
    let totalPages = 0;
    let places = [];

    async function fetchPlaces() {
        try {
            const response = await fetch('famousPlaces.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            places = data.places; // Store places globally
            return places;
        } catch (error) {
            console.error('Failed to fetch places:', error);
            return [];
        }
    }

    function createPlaceItem(place) {
        const placeItem = document.createElement('div');
        placeItem.className = 'place-item';

        placeItem.innerHTML = `
            <img src="${place.image}" alt="${place.name}">
            <h3>${place.name}</h3>
            <p>${place.description}</p>
        `;
        return placeItem;
    }

    function filterPlaces() {
        if (currentFilter === 'all') return places;
        return places.filter(place => place.category === currentFilter);
    }

    function searchPlaces(query) {
        if (!query) return filterPlaces();
        return filterPlaces().filter(place => place.name.toLowerCase().includes(query.toLowerCase()));
    }

    async function loadPlacesByPage(page) {
        await fetchPlaces(); // Ensure places are fetched
        const query = searchInput.value.trim();
        const filteredAndSearchedPlaces = searchPlaces(query);

        const startIndex = page * pageSize;
        const endIndex = startIndex + pageSize;
        const pagePlaces = filteredAndSearchedPlaces.slice(startIndex, endIndex);

        recommendationGrid.innerHTML = ''; // Clear previous results
        pagePlaces.forEach(place => {
            const placeItem = createPlaceItem(place);
            recommendationGrid.appendChild(placeItem);
        });

        // Set up pagination
        totalPages = Math.ceil(filteredAndSearchedPlaces.length / pageSize);
        renderPagination(totalPages);

        // Display recommendations
        displayRecommendations(); // Call to display recommendations
    }

    function renderPagination(totalPages) {
        pagination.innerHTML = ''; // Clear previous pagination buttons
        for (let i = 0; i < totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i + 1;
            pageButton.className = 'pagination-btn';
            if (i === page) {
                pageButton.classList.add('active'); // Highlight current page
            }
            pageButton.addEventListener('click', () => {
                page = i;
                loadPlacesByPage(page);
            });
            pagination.appendChild(pageButton);
        }
    }

    // Event listeners for filters and search
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentFilter = button.getAttribute('data-category');
            page = 0;
            loadPlacesByPage(page); // Reload places based on the current filter
        });
    });

    filterAll.addEventListener('click', () => {
        currentFilter = 'all';
        page = 0;
        loadPlacesByPage(page); // Reload places with no filter
    });

    searchBtn.addEventListener('click', () => {
        page = 0;
        loadPlacesByPage(page); // Reload places based on search input
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = ''; // Clear the search input
        page = 0; // Reset to the first page
        loadPlacesByPage(page); // Reload places with no search filter
    });

    // Random recommendations based on category
    function getRandomPlaces(category, count) {
        const filteredPlaces = places.filter(place => place.category === category);
        if (filteredPlaces.length === 0) return [];
        const shuffled = filteredPlaces.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function displayRecommendations() {
        const recommendationCities = document.getElementById('recommended-cities');
        const recommendationMountains = document.getElementById('recommended-mountains');
        const recommendationBeaches = document.getElementById('recommended-beaches');
        const recommendationTemples = document.getElementById('recommended-temples');

        // Clear previous recommendations
        recommendationCities.innerHTML = '';
        recommendationMountains.innerHTML = '';
        recommendationBeaches.innerHTML = '';
        recommendationTemples.innerHTML = '';

        const recommendedCities = getRandomPlaces('cities', 2);
        const recommendedBeaches = getRandomPlaces('beaches', 2);
        const recommendedMountains = getRandomPlaces('mountains', 2);
        const recommendedTemples = getRandomPlaces('temples', 2);

        const addRecommendations = (element, places) => {
            places.forEach(place => {
                if (place) {
                    const card = document.createElement('div');
                    card.className = 'recommendation-card';

                    card.innerHTML = `
                        <img src="${place.image}" alt="${place.name}">
                        <div class="info">
                            <h3>${place.name}</h3>
                            <p>${place.description}</p>
                        </div>
                    `;

                    element.appendChild(card);
                }
            });
        };

        addRecommendations(recommendationCities, recommendedCities);
        addRecommendations(recommendationBeaches, recommendedBeaches);
        addRecommendations(recommendationMountains, recommendedMountains);
        addRecommendations(recommendationTemples, recommendedTemples);
    }

    // Initial load
    loadPlacesByPage(page);
});
