// ============================================================
// 1. GLOBALS: Emojis, Carousel, Audio, and Map Trackers
// ============================================================
const animalEmojis = {
  "Lion": "🦁", "Elephant": "🐘", "Eagle": "🦅", "Snake": "🐍",
  "Shark": "🦈", "Turtle": "🐢", "Chameleon": "🦎", "Crocodile": "🐊",
  "Frog": "🐸", "Whale": "🐋", "Axolotl": "🐉", "Hellbender": "🦎",
  "Owl": "🦉", "Raven": "🐦‍⬛", "Parrot": "🦜"
};

let animals = [];           

// Carousel & Audio Trackers
let currentImageArray = [];
let currentImageIndex = 0;
let currentAnimalName = "";
let currentAudio = null;

// Map Trackers
let currentMap = null;      
let currentMarker = null;   

// ============================================================
// 2. FETCH DATA
// ============================================================
fetch('animal.json')
  .then(response => response.json()) 
  .then(data => {
    animals = data;                    
    displayAnimals(animals);           
  })
  .catch(error => console.error("Error loading animal data:", error));

const container = document.getElementById("animalContainer");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");
const dietFilter = document.getElementById("dietFilter");
const habitatFilter = document.getElementById("habitatFilter");
const sortOrder = document.getElementById("sortOrder"); // From the old code

// ============================================================
// 3. DISPLAY CARDS (With Empty State & Tooltips)
// ============================================================
function displayAnimals(list) {
  container.innerHTML = ""; 
  
  // Feature: Handles invalid or empty search input gracefully 
  if (list.length === 0) {
    container.innerHTML = `
      <div class="no-results-message" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #7f8c8d;">
        <h3>No matching animals found 🐾</h3>
        <p>Try adjusting your search query or removing some filters!</p>
      </div>
    `;
    return; 
  }

  list.forEach(animal => {
    const card = document.createElement("div");
    card.className = "card";
    card.title = `Click to view detailed information about the ${animal.name}`; // OKU Tooltip
    
    const emoji = animalEmojis[animal.name] || "🐾"; 
    
    card.innerHTML = `
      <div class="card-content">
        <h3>${emoji} ${animal.name}</h3>
        <p>${animal.category}</p>
      </div>
    `;
    
    card.onclick = () => showDetails(animal);
    container.appendChild(card);
  });
}

// ============================================================
// 4. SHOW DETAILS (The Grand Central Station)
// ============================================================
function showDetails(animal) {
  // A. Set Basic Text
  document.getElementById("detailName").innerText = animal.name;
  document.getElementById("detailCategory").innerText = animal.category;
  document.getElementById("detailHabitat").innerText = animal.habitat;
  document.getElementById("detailDiet").innerText = animal.diet;
  document.getElementById("detailFact").innerText = animal.fact;
  document.getElementById("detailScientific").innerText = `${animal.scientific_name}`;
  document.getElementById("detailSpecies").innerText = `${animal.type_of_species}`;

  // B. Initialize the Image Carousel
  currentAnimalName = animal.name;
  currentImageIndex = 0; 
  if (Array.isArray(animal.image)) {
    currentImageArray = animal.image;
  } else if (animal.image) {
    currentImageArray = [animal.image];
  } else {
    currentImageArray = []; 
  }
  updateCarouselDisplay();

  // C. Initialize the Audio Player
  const soundBtn = document.getElementById("playSoundBtn");
  if (soundBtn) {
    if (animal.audio) {
      soundBtn.style.display = "inline-flex"; 
      soundBtn.onclick = () => playAnimalSound(animal.audio);
    } else {
      soundBtn.style.display = "none"; 
    }
  }

  // D. Initialize the Map Setup
  const rightPanel = document.getElementById("detailsMapPanel");
  if (rightPanel) rightPanel.style.display = "none"; // Hide map by default
  
  if (currentMap) {
    currentMap.remove(); // Clean up old memory
    currentMap = null;
  }
  
  const showMapBtn = document.getElementById("showMapBtn");
  if (showMapBtn) {
    showMapBtn.onclick = () => toggleMap(animal);   
    showMapBtn.innerHTML = "🗺️ Show Map";           
  }

  // E. Finally, show the pop-up
  document.getElementById("detailsBox").style.display = "flex";
}

// ============================================================
// 5. NEW: LEAFLET MAP FUNCTIONS
// ============================================================
function toggleMap(animal) {
  const rightPanel = document.getElementById("detailsMapPanel");
  const isVisible = (rightPanel.style.display === "flex" || rightPanel.style.display === "block");
  
  if (isVisible) {
    rightPanel.style.display = "none";
    document.getElementById("showMapBtn").innerHTML = "🗺️ Show Map";
    if (currentMap) {
      currentMap.remove();    
      currentMap = null;
    }
  } else {
    rightPanel.style.display = "block";
    document.getElementById("showMapBtn").innerHTML = "🗺️ Hide Map";
    loadMapForAnimal(animal);   
  }
}

function loadMapForAnimal(animal) {
  const lat = animal.latitude;
  const lng = animal.longitude;
  
  if (!lat || !lng) {
    document.getElementById("mapLocationName").innerHTML = "❌ Location data not available for this animal.";
    return;
  }
  
  document.getElementById("mapLocationName").innerHTML = `${animal.name} lives near ${lat.toFixed(2)}, ${lng.toFixed(2)}`;
  
  const mapDiv = document.getElementById("miniMap");
  if (currentMap) currentMap.remove();
  
  currentMap = L.map(mapDiv).setView([lat, lng], 6);
  
  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
  }).addTo(currentMap);
  
  const emoji = animalEmojis[animal.name] || "🐾";
  const customIcon = L.divIcon({
    html: `<div style="background-color: white; border-radius: 50%; padding: 5px; font-size: 24px; box-shadow: 0 2px 5px rgba(0,0,0,0.2); text-align: center;">${emoji}</div>`,
    iconSize: [40, 40],
    className: 'mini-marker'
  });
  
  currentMarker = L.marker([lat, lng], { icon: customIcon }).addTo(currentMap);
  currentMarker.bindPopup(`<b>${animal.name}</b>`).openPopup();
}

// ============================================================
// 6. OLD: CAROUSEL & AUDIO FUNCTIONS
// ============================================================
function updateCarouselDisplay() {
  const detailImg = document.getElementById("detailImage");
  const prevBtn = document.getElementById("prevImageBtn");
  const nextBtn = document.getElementById("nextImageBtn");

  if (currentImageArray.length > 0) {
    detailImg.src = currentImageArray[currentImageIndex];
    detailImg.alt = `Photograph ${currentImageIndex + 1} of ${currentImageArray.length} for ${currentAnimalName}`;
  }

  if (prevBtn && nextBtn) {
    if (currentImageArray.length <= 1) {
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
    } else {
      prevBtn.style.display = "flex";
      nextBtn.style.display = "flex";
    }
  }
}

function changeImage(direction) {
  currentImageIndex += direction;
  if (currentImageIndex >= currentImageArray.length) {
    currentImageIndex = 0;
  } else if (currentImageIndex < 0) {
    currentImageIndex = currentImageArray.length - 1;
  }
  updateCarouselDisplay();
}

function playAnimalSound(audioPath) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  currentAudio = new Audio(audioPath);
  currentAudio.play();
}

function closeDetails() {
  document.getElementById("detailsBox").style.display = "none";
  document.getElementById("detailsMapPanel").style.display = "none";
  
  // Stop Audio
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  // Clear Map
  if (currentMap) {
    currentMap.remove();
    currentMap = null;
  }
  
  const mapBtn = document.getElementById("showMapBtn");
  if(mapBtn) mapBtn.innerHTML = "🗺️ Show Map";
}

// ============================================================
// 7. FILTERING & SORTING (Combined Logic)
// ============================================================
function filterAnimals() {
  const searchValue = searchInput.value.toLowerCase();
  const categoryValue = categoryFilter.value;
  const dietValue = dietFilter.value;
  const habitatValue = habitatFilter.value;
  
  // Safely check if sortOrder exists in the HTML
  const sortValue = sortOrder ? sortOrder.value : "none"; 

  let filtered = animals.filter(animal => {
    const matchName = animal.name.toLowerCase().startsWith(searchValue);
    const matchCategory = categoryValue === "all" || animal.category === categoryValue;
    const matchDiet = dietValue === "all" || animal.diet === dietValue;
    const matchHabitat = habitatValue === "all" || animal.habitat === habitatValue;
    return matchName && matchCategory && matchDiet && matchHabitat;
  });

  // Alphabetical Sorting
  if (sortValue === "asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortValue === "desc") {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  }

  displayAnimals(filtered);
}

// Attach Event Listeners
searchInput.addEventListener("input", filterAnimals);
categoryFilter.addEventListener("change", filterAnimals);
dietFilter.addEventListener("change", filterAnimals);
habitatFilter.addEventListener("change", filterAnimals);
if(sortOrder) sortOrder.addEventListener("change", filterAnimals);