let videos = [];

fetch('video.json')
  .then(response => response.json())// Convert the response to JSON
  .then(data => {
    videos = data;
    displayVideos(videos);// Display the videos ONLY AFTER they finish loading
  })
  .catch(error => console.error("Error loading video data:", error));

// 2. Grab the HTML elements
const videoContainer = document.getElementById("videoContainer");
const videoSearch = document.getElementById("videoSearch");
const videoCategoryFilter = document.getElementById("videoCategoryFilter");
const videoSortOrder = document.getElementById("videoSortOrder");

// 3. Function to display the videos on the screen
function displayVideos(list) {
  videoContainer.innerHTML = ""; // Clear out the old videos
  
  // 🌟 ADDED: Handles empty search results gracefully
  if (list.length === 0) {
    videoContainer.innerHTML = `
      <div class="no-results-message" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #7f8c8d;">
        <h3>No matching videos found 🎥</h3>
        <p>Try adjusting your search query or changing the category filter!</p>
      </div>
    `;
    return; // Stops the function here so it doesn't try to loop through empty data
  }

  // If there are results, build the cards normally
  list.forEach(video => {
    const card = document.createElement("div");
    card.className = "video-card";
    
    // Custom hover hint reading the video's title
    card.title = `Play educational video: ${video.title}`;
    
    card.innerHTML = `
      <iframe src="${video.url}" title="${video.title}" allowfullscreen></iframe>
      <h3>${video.title}</h3>
      <p class="cat-label">Category: ${video.category}</p>
    `;
    
    videoContainer.appendChild(card);
  });
}

// 4. Function to filter the videos when you type or select a category
function filterVideos() {
  const searchValue = videoSearch.value.toLowerCase();
  const categoryValue = videoCategoryFilter.value;
  
  // 1. Get the current sort selection
  const sortValue = videoSortOrder.value;

  // 2. Filter the videos based on search and category
  let filtered = videos.filter(video => {
    // Note: Adjust 'video.title' if your JSON uses a different key name for the video title
    const matchName = video.title.toLowerCase().includes(searchValue);
    const matchCategory = categoryValue === "all" || video.category === categoryValue;
    return matchName && matchCategory;
  });

  // 🌟 3. NEW SORTING LOGIC: Reorganize the filtered video array alphabetically
  if (sortValue === "asc") {
    // A to Z
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortValue === "desc") {
    // Z to A
    filtered.sort((a, b) => b.title.localeCompare(a.title));
  }

  // 4. Display the results
  displayVideos(filtered);
}

// 5. Tell the inputs to listen for typing and clicking
videoSearch.addEventListener("input", filterVideos);
videoCategoryFilter.addEventListener("change", filterVideos);
if (sortOrder) sortOrder.addEventListener("change", filterVideos);