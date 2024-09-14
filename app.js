document.addEventListener('DOMContentLoaded', () => {
    const recommendationGrid = document.getElementById('recommendation-grid');
    const loading = document.getElementById('loading');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const filterButtons = document.querySelectorAll('#filters .filter-btn');
    const filterAll = document.getElementById('filter-all');
    const pagination = document.getElementById('pagination'); // Get Pagination container

    const dataList = document.getElementById('destinations');

    let page = 0;
    const pageSize = 6; // Number of items per page
    let currentFilter = 'all'; // Default filter
    let totalPages = 0;

    async function fetchPlaces() {
        try {
            const response = await fetch('famousPlaces.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch places:', error);
            return { cities: [], beaches: [], temples: [] };
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

    function filterPlaces(places) {
        if (currentFilter === 'all') return places;
        return places.filter(place => place.category === currentFilter); // Fix: Ensure filtering by category
    }

    function searchPlaces(places, query) {
        if (!query) return places;
        return places.filter(place => place.name.toLowerCase().includes(query.toLowerCase()));
    }

    function loadPlacesByPage(page) {
        fetchPlaces().then(data => {
            let places = [...data.places];

            // Apply filtering
            places = filterPlaces(places);

            // Apply search query if present
            const query = searchInput.value.trim();
            places = searchPlaces(places, query);

            const startIndex = page * pageSize;
            const endIndex = startIndex + pageSize;
            const pagePlaces = places.slice(startIndex, endIndex);

            recommendationGrid.innerHTML = ''; // Clear previous results
            pagePlaces.forEach(place => {
                const placeItem = createPlaceItem(place);
                recommendationGrid.appendChild(placeItem);
            });

            // Set up pagination
            totalPages = Math.ceil(places.length / pageSize);
            renderPagination(totalPages);

            // Show or hide loading indicator
            loading.style.display = pagePlaces.length === 0 ? 'none' : 'block';
        });
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

    // Initial load
    loadPlacesByPage(page);
});


