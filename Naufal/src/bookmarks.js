const fs = require('fs');
const path = require('path');

// Path to the Bookmarks folder
const bookmarksFolderPath = path.join(__dirname, 'WeatherBookmarks');

function deleteBookmark(city) {
    const file = path.join(bookmarksFolderPath, `${city}.txt`);
    fs.unlink(file, (err) => {
        if (err) {
            console.error('Error deleting bookmark:', err);
            return;
        }
        const bookmarkElement = document.getElementById(`${city}_bookmark`);
        if (bookmarkElement) {
            bookmarkElement.remove(); // Remove the HTML element corresponding to the deleted bookmark
        }
        alert(`${city} bookmark was deleted`);
        readBookmarks(); 
    });
}

// Function to read all bookmark files in the Bookmarks folder
function readBookmarks() {
    fs.readdir(bookmarksFolderPath, (err, files) => {
        if (err) {
            console.error('Error reading bookmarks:', err);
            return;
        }
        const bookmarksContainer = document.getElementById('bookmarksContainer');
        bookmarksContainer.innerHTML = ''; // Clear previous bookmarks

        // Loop through each file in the folder
        files.forEach(file => {
            const filePath = path.join(bookmarksFolderPath, file);
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading bookmark:', err);
                    return;
                }
                const bookmarkData = JSON.parse(data); // Parse JSON data from file
                const bookmarkElement = document.createElement('div');
                bookmarkElement.id = `${bookmarkData.city}_bookmark`; // Assign an ID to the bookmark element
                bookmarkElement.innerHTML = `
                <div id="title">
                    <h2>${bookmarkData.name}</h2>
                    <p><strong>Country:</strong> ${bookmarkData.sys.country}</p>
                    <p><strong>Weather:</strong> ${bookmarkData.weather[0].description}</p>
                    <p><strong>Temperature:</strong> ${bookmarkData.main.temp} K</p>
                    <p><strong>Humidity:</strong> ${bookmarkData.main.humidity}%</p>
                    <p><strong>Coordinates:</strong> ${bookmarkData.coord.lat}, ${bookmarkData.coord.lon}</p>
                    <button onclick="deleteBookmark('${bookmarkData.name}')">Delete</button>
                </div>
                `;

                bookmarksContainer.appendChild(bookmarkElement); // Append bookmark to container
            });
        });
    });
}

// Call the function to read and display bookmarks when the DOM content is loaded
document.addEventListener("DOMContentLoaded", readBookmarks);
