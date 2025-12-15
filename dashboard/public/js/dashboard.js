const API_BASE = 'http://localhost:3000/api';

let priceChart, fuelChart, featuresChart, dealerChart, serviceChart;

let currentFilters = {
    manufacturer: '',
    fuelType: '',
    minPrice: 0,
    maxPrice: 100000,
    minYear: 2000,
    maxYear: 2024
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard loading...');
    loadFilterOptions();
    loadAllCharts();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    
    // NEW: View Cars button
    document.getElementById('viewCars').addEventListener('click', () => {
        const params = new URLSearchParams();
        if (currentFilters.manufacturer) params.append('manufacturer', currentFilters.manufacturer);
        if (currentFilters.fuelType) params.append('fuelType', currentFilters.fuelType);
        if (currentFilters.minPrice > 0) params.append('minPrice', currentFilters.minPrice);
        if (currentFilters.maxPrice < 100000) params.append('maxPrice', currentFilters.maxPrice);
        if (currentFilters.minYear > 2000) params.append('minYear', currentFilters.minYear);
        if (currentFilters.maxYear < 2024) params.append('maxYear', currentFilters.maxYear);
        
        window.location.href = `view.html?${params.toString()}`;
    });
}

async function loadFilterOptions() {
    try {
        const manufacturers = await fetch(`${API_BASE}/manufacturers`).then(r => r.json());
        const manufacturerSelect = document.getElementById('manufacturerFilter');
        manufacturers.forEach(mfr => {
            const option = document.createElement('option');
            option.value = mfr;
            option.textContent = mfr;
            manufacturerSelect.appendChild(option);
        });

        const fuelTypes = await fetch(`${API_BASE}/fuel-types`).then(r => r.json());
        const fuelSelect = document.getElementById('fuelTypeFilter');
        fuelTypes.forEach(fuel => {
            const option = document.createElement('option');
            option.value = fuel;
            option.textContent = fuel;
            fuelSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading filter options:', error);
    }
}

function applyFilters() {
    currentFilters = {
        manufacturer: document.getElementById('manufacturerFilter').value,
        fuelType: document.getElementById('fuelTypeFilter').value,
        minPrice: parseInt(document.getElementById('minPrice').value) || 0,
        maxPrice: parseInt(document.getElementById('maxPrice').value) || 100000,
        minYear: parseInt(document.getElementById('minYear').value) || 2000,
        maxYear: parseInt(document.getElementById('maxYear').value) || 2024
    };

    document.getElementById('filterStatus').textContent = '🔄 Applying filters...';
    loadAllCharts().then(() => {
        document.getElementById('filterStatus').textContent = '✅ Filters applied!';
        setTimeout(() => {
            document.getElementById('filterStatus').textContent = '';
        }, 2000);
    });
}

function resetFilters() {
    currentFilters = {
        manufacturer: '',
        fuelType: '',
        minPrice: 0,
        maxPrice: 100000,
        minYear: 2000,
        maxYear: 2024
    };

    document.getElementById('manufacturerFilter').value = '';
    document.getElementById('fuelTypeFilter').value = '';
    document.getElementById('minPrice').value = 0;
    document.getElementById('maxPrice').value = 100000;
    document.getElementById('minYear').value = 2000;
    document.getElementById('maxYear').value = 2024;
    document.getElementById('filterStatus').textContent = '🔄 Resetting...';
    
    loadAllCharts().then(() => {
        document.getElementById('filterStatus').textContent = '';
    });
}

function buildQueryString() {
    const params = new URLSearchParams();
    if (currentFilters.manufacturer) params.append('manufacturer', currentFilters.manufacturer);
    if (currentFilters.fuelType) params.append('fuelType', currentFilters.fuelType);
    if (currentFilters.minPrice > 0) params.append('minPrice', currentFilters.minPrice);
    if (currentFilters.maxPrice < 100000) params.append('maxPrice', currentFilters.maxPrice);
    if (currentFilters.minYear > 2000) params.append('minYear', currentFilters.minYear);
    if (currentFilters.maxYear < 2024) params.append('maxYear', currentFilters.maxYear);
    return params.toString();
}

async function loadAllCharts() {
    await loadStats();
    await Promise.all([
        loadPriceByManufacturer(),
        loadFuelTypeDistribution(),
        loadFeaturePopularity(),
        loadDealerDistribution(),
        loadServiceHistory()
    ]);
}

async function loadStats() {
    try {
        const queryString = buildQueryString();
        const response = await fetch(`${API_BASE}/stats?${queryString}`);
        const data = await response.json();
        
        document.getElementById('totalCars').textContent = data.totalCars.toLocaleString();
        document.getElementById('totalManufacturers').textContent = data.totalManufacturers;
        document.getElementById('totalFuelTypes').textContent = data.fuelTypes.length;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadPriceByManufacturer() {
    try {
        const queryString = buildQueryString();
        const response = await fetch(`${API_BASE}/price-by-manufacturer?${queryString}`);
        const data = await response.json();
        
        const labels = data.map(item => item._id);
        const prices = data.map(item => Math.round(item.avgPrice));
        
        if (priceChart) priceChart.destroy();
        
        const ctx = document.getElementById('priceChart').getContext('2d');
        priceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average Price (£)',
                    data: prices,
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '£' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading price data:', error);
    }
}

async function loadFuelTypeDistribution() {
    try {
        const queryString = buildQueryString();
        const response = await fetch(`${API_BASE}/fuel-type-distribution?${queryString}`);
        const data = await response.json();
        
        const labels = data.map(item => item._id);
        const counts = data.map(item => item.count);
        
        if (fuelChart) fuelChart.destroy();
        
        const ctx = document.getElementById('fuelChart').getContext('2d');
        fuelChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: counts,
                    backgroundColor: [
                        '#ef4444',
                        '#3b82f6',
                        '#eab308',
                        '#22c55e',
                        '#a855f7'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'right' }
                }
            }
        });
    } catch (error) {
        console.error('Error loading fuel data:', error);
    }
}

async function loadFeaturePopularity() {
    try {
        const queryString = buildQueryString();
        const response = await fetch(`${API_BASE}/feature-popularity?${queryString}`);
        const data = await response.json();
        
        const labels = data.map(item => item._id);
        const counts = data.map(item => item.count);
        
        if (featuresChart) featuresChart.destroy();
        
        const ctx = document.getElementById('featuresChart').getContext('2d');
        featuresChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: counts,
                    backgroundColor: [
                        '#ef4444', '#3b82f6', '#eab308', '#22c55e', '#a855f7',
                        '#f97316', '#06b6d4', '#84cc16', '#ec4899', '#14b8a6'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'right' }
                }
            }
        });
    } catch (error) {
        console.error('Error loading features data:', error);
    }
}

async function loadDealerDistribution() {
    try {
        const queryString = buildQueryString();
        const response = await fetch(`${API_BASE}/dealer-distribution?${queryString}`);
        const data = await response.json();
        
        const labels = data.map(item => item._id);
        const counts = data.map(item => item.count);
        
        if (dealerChart) dealerChart.destroy();
        
        const ctx = document.getElementById('dealerChart').getContext('2d');
        dealerChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Cars',
                    data: counts,
                    backgroundColor: '#14b8a6',
                    borderColor: '#0d9488',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { beginAtZero: true }
                }
            }
        });
    } catch (error) {
        console.error('Error loading dealer data:', error);
    }
}

async function loadServiceHistory() {
    try {
        const queryString = buildQueryString();
        const response = await fetch(`${API_BASE}/service-history?${queryString}`);
        const data = await response.json();
        
        const labels = data.map(item => `${item._id} Services`);
        const counts = data.map(item => item.count);
        
        if (serviceChart) serviceChart.destroy();
        
        const ctx = document.getElementById('serviceChart').getContext('2d');
        serviceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of Cars',
                    data: counts,
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderColor: '#ef4444',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    } catch (error) {
        console.error('Error loading service history:', error);
    }
}
