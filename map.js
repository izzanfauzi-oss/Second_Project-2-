// Emoji mapping (same as encyclopedia.js)
const animalEmojis = {
    "Lion": "🦁", "Elephant": "🐘", "Eagle": "🦅", "Snake": "🐍",
    "Shark": "🦈", "Turtle": "🐢", "Chameleon": "🦎", "Crocodile": "🐊",
    "Frog": "🐸", "Whale": "🐋", "Axolotl": "🐉", "Hellbender": "🦎",
    "Owl": "🦉", "Raven": "🐦‍⬛", "Parrot": "🦜"
};

let animals = [];
let map;
let markersLayer;

// Fetch animal data from your JSON file
fetch('animal.json')
    .then(response => response.json())
    .then(data => {
        animals = data;
        initMap();           // initialize the map
        updateMapMarkers();  // add markers based on current filter
    })
    .catch(error => console.error("Error loading animal data for map:", error));

function initMap() {
    // Create map, center roughly on world view (zoom level 2)
    map = L.map('animal-map').setView([20, 10], 2);
    
    // Add OpenStreetMap tiles (free, no API key needed)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);
    
    // Create a layer group to hold markers (so we can clear and reload)
    markersLayer = L.layerGroup().addTo(map);
}

function updateMapMarkers() {
    // Clear existing markers
    markersLayer.clearLayers();
    
    // Get selected category from dropdown
    const category = document.getElementById('map-category-filter').value;
    
    // Filter animals
    const filteredAnimals = category === 'all' 
        ? animals 
        : animals.filter(animal => animal.category === category);
    
    // Add a marker for each animal that has coordinates
    filteredAnimals.forEach(animal => {
        if (animal.latitude && animal.longitude) {
            // Create a custom marker with emoji icon
            const customIcon = L.divIcon({
                html: `<div style="background-color: white; border-radius: 50%; padding: 8px; font-size: 28px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); text-align: center; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">${animalEmojis[animal.name] || '🐾'}</div>`,
                iconSize: [50, 50],
                className: 'custom-marker'
            });
            
            const marker = L.marker([animal.latitude, animal.longitude], { icon: customIcon }).addTo(markersLayer);
            
            // Bind a popup with animal details
            marker.bindPopup(`
                <b>${animal.name}</b><br>
                Category: ${animal.category}<br>
                Habitat: ${animal.habitat}<br>
                Diet: ${animal.diet}<br>
                <img src="${animal.image}" style="width: 120px; border-radius: 8px; margin-top: 5px;"><br>
                <small>${animal.fact}</small>
            `);
        }
    });
}

// Listen for category filter changes
document.getElementById('map-category-filter').addEventListener('change', updateMapMarkers);