const API_BASE = 'http://localhost:3000/api';

let currentPage = 1;
let totalPages = 1;
let totalCount = 0;
const carsPerPage = 50;

// Get filters from URL parameters
function getFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    return {
        manufacturer: params.get('manufacturer') || '',
        fuelType: params.get('fuelType') || '',
        minPrice: params.get('minPrice') || '0',
        maxPrice: params.get('maxPrice') || '100000',
        minYear: params.get('minYear') || '2000',
        maxYear: params.get('maxYear') || '2024'
    };
}

// Display filter summary
function displayFilterSummary(filters) {
    const summary = document.getElementById('filterSummary');
    const badges = [];

    if (filters.manufacturer) {
        badges.push(`<span class="filter-badge">Manufacturer: ${filters.manufacturer}</span>`);
    }
    if (filters.fuelType) {
        badges.push(`<span class="filter-badge">Fuel: ${filters.fuelType}</span>`);
    }
    if (filters.minPrice !== '0' || filters.maxPrice !== '100000') {
        badges.push(`<span class="filter-badge">Price: £${parseInt(filters.minPrice).toLocaleString()} - £${parseInt(filters.maxPrice).toLocaleString()}</span>`);
    }
    if (filters.minYear !== '2000' || filters.maxYear !== '2024') {
        badges.push(`<span class="filter-badge">Year: ${filters.minYear} - ${filters.maxYear}</span>`);
    }

    if (badges.length === 0) {
        summary.innerHTML = '<span class="badge bg-secondary">No filters applied</span>';
    } else {
        summary.innerHTML = badges.join('');
    }
}

// Load cars from API (server-side pagination)
async function loadCars(page = 1) {
    try {
        // Show loading
        document.getElementById('loadingState').style.display = 'block';
        document.getElementById('carsTableContainer').style.display = 'none';
        document.getElementById('noResults').style.display = 'none';

        const filters = getFiltersFromURL();
        displayFilterSummary(filters);

        // Build query string with pagination
        const params = new URLSearchParams();
        if (filters.manufacturer) params.append('manufacturer', filters.manufacturer);
        if (filters.fuelType) params.append('fuelType', filters.fuelType);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.minYear) params.append('minYear', filters.minYear);
        if (filters.maxYear) params.append('maxYear', filters.maxYear);
        params.append('page', page);
        params.append('limit', carsPerPage);

        const response = await fetch(`${API_BASE}/cars?${params.toString()}`);
        const data = await response.json();

        // Hide loading
        document.getElementById('loadingState').style.display = 'none';

        if (data.totalCount === 0) {
            document.getElementById('noResults').style.display = 'block';
        } else {
            currentPage = data.currentPage;
            totalPages = data.totalPages;
            totalCount = data.totalCount;

            document.getElementById('carsTableContainer').style.display = 'block';
            document.getElementById('resultCount').textContent = data.totalCount.toLocaleString();
            displayCars(data.cars);
            setupPagination();
        }
    } catch (error) {
        console.error('Error loading cars:', error);
        document.getElementById('loadingState').innerHTML = `
            <div class="alert alert-danger">
                <h4>Error loading cars</h4>
                <p>${error.message}</p>
            </div>
        `;
    }
}

// Display cars
function displayCars(cars) {
    const tbody = document.getElementById('carsTableBody');
    tbody.innerHTML = cars.map(car => `
        <tr>
            <td><code>${car._id}</code></td>
            <td><strong>${car.manufacturer}</strong></td>
            <td>${car.model}</td>
            <td>${car.YearOfManufacturing}</td>
            <td class="text-success fw-bold">£${car.price.toLocaleString()}</td>
            <td>${car.mileage.toLocaleString()} mi</td>
            <td><span class="badge bg-info">${car.FuelType}</span></td>
            <td>${car.EngineSize}L</td>
            <td>${car.dealer.DealerName}</td>
            <td>${car.dealer.DealerCity}</td>
        </tr>
    `).join('');
}

// Setup pagination (no inline onclick)
function setupPagination() {
    const pagination = document.getElementById('pagination');

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    pagination.innerHTML = ''; // Clear

    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    const prevLink = document.createElement('a');
    prevLink.className = 'page-link';
    prevLink.href = '#';
    prevLink.textContent = 'Previous';
    prevLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage > 1) changePage(currentPage - 1);
    });
    prevLi.appendChild(prevLink);
    pagination.appendChild(prevLi);

    // Calculate page range to show
    let startPage = Math.max(1, currentPage - 4);
    let endPage = Math.min(totalPages, currentPage + 5);

    // First page
    if (startPage > 1) {
        addPageButton(1);
        if (startPage > 2) {
            addEllipsis();
        }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        addPageButton(i);
    }

    // Last page
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            addEllipsis();
        }
        addPageButton(totalPages);
    }

    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    const nextLink = document.createElement('a');
    nextLink.className = 'page-link';
    nextLink.href = '#';
    nextLink.textContent = 'Next';
    nextLink.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPage < totalPages) changePage(currentPage + 1);
    });
    nextLi.appendChild(nextLink);
    pagination.appendChild(nextLi);

    // Helper function to add page button
    function addPageButton(pageNum) {
        const li = document.createElement('li');
        li.className = `page-item ${currentPage === pageNum ? 'active' : ''}`;
        const link = document.createElement('a');
        link.className = 'page-link';
        link.href = '#';
        link.textContent = pageNum;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            changePage(pageNum);
        });
        li.appendChild(link);
        pagination.appendChild(li);
    }

    // Helper function to add ellipsis
    function addEllipsis() {
        const li = document.createElement('li');
        li.className = 'page-item disabled';
        const link = document.createElement('a');
        link.className = 'page-link';
        link.textContent = '...';
        li.appendChild(link);
        pagination.appendChild(li);
    }
}

// Change page
function changePage(page) {
    if (page < 1 || page > totalPages) return;
    loadCars(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    loadCars(1);
});