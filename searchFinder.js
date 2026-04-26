const animals = [
  { name: "Lion", category: "Mammal", habitat: "Savannah", diet: "Carnivore" },
  { name: "Elephant", category: "Mammal", habitat: "Forest", diet: "Herbivore" },
  { name: "Eagle", category: "Bird", habitat: "Mountains", diet: "Carnivore" },
  { name: "Snake", category: "Reptile", habitat: "Jungle", diet: "Carnivore" }
];

const container = document.getElementById("animalContainer");
const searchInput = document.getElementById("search");
const categoryFilter = document.getElementById("categoryFilter");

function displayAnimals(list) {
  container.innerHTML = "";
  list.forEach(animal => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${animal.name}</h3><p>${animal.category}</p>`;

    card.onclick = () => showDetails(animal);

    container.appendChild(card);
  });
}

function showDetails(animal) {
  document.getElementById("detailName").innerText = animal.name;
  document.getElementById("detailCategory").innerText = animal.category;
  document.getElementById("detailHabitat").innerText = animal.habitat;
  document.getElementById("detailDiet").innerText = animal.diet;

  document.getElementById("detailsBox").style.display = "flex";
}

function closeDetails() {
  document.getElementById("detailsBox").style.display = "none";
}

function filterAnimals() {
  const searchValue = searchInput.value.toLowerCase();
  const categoryValue = categoryFilter.value;

  const filtered = animals.filter(animal => {
    const matchName = animal.name.toLowerCase().startsWith(searchValue);
    const matchCategory = categoryValue === "all" || animal.category === categoryValue;

    return matchName && matchCategory;
  });

  displayAnimals(filtered);
}

searchInput.addEventListener("input", filterAnimals);
categoryFilter.addEventListener("change", filterAnimals);

// Initial display
displayAnimals(animals);

// --- Splash Screen Logic ---
const overlay = document.getElementById('intro-overlay');

overlay.addEventListener('click', function() {
    // Swipe it up
    overlay.classList.add('swipe-up');
    
    // Unlock the scrolling for the encyclopedia
    document.body.classList.add('allow-scroll');
});