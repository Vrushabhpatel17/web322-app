// store-service.js

// Required Modules
const fs = require('fs');
const path = require('path');

// Global Arrays
let items = [];
let categories = [];

// Function: initialize()
// Reads items.json and categories.json, then assigns the parsed data to the respective arrays
function initialize() {
  return new Promise((resolve, reject) => {
    // Read items.json file
    fs.readFile(path.join(__dirname, 'data', 'items.json'), 'utf8', (err, data) => {
      if (err) {
        reject('Unable to read file: items.json');
        return;
      }
      items = JSON.parse(data); // Assign the parsed JSON data to the items array

      // Read categories.json file after items.json is successfully read
      fs.readFile(path.join(__dirname, 'data', 'categories.json'), 'utf8', (err, data) => {
        if (err) {
          reject('Unable to read file: categories.json');
          return;
        }
        categories = JSON.parse(data); // Assign the parsed JSON data to the categories array

        // Resolve the promise indicating successful initialization
        resolve();
      });
    });
  });
}

// Function: getAllItems()
// Returns a promise that resolves with all items or rejects with an error message
function getAllItems() {
  return new Promise((resolve, reject) => {
    if (items.length > 0) {
      resolve(items);
    } else {
      reject('No results returned');
    }
  });
}

// Function: getPublishedItems()
// Returns a promise that resolves with items whose published property is true or rejects if none are found
function getPublishedItems() {
  return new Promise((resolve, reject) => {
    const publishedItems = items.filter(item => item.published === true);
    if (publishedItems.length > 0) {
      resolve(publishedItems);
    } else {
      reject('No results returned');
    }
  });
}

// Function: getCategories()
// Returns a promise that resolves with all categories or rejects with an error message
function getCategories() {
  return new Promise((resolve, reject) => {
    if (categories.length > 0) {
      resolve(categories);
    } else {
      reject('No results returned');
    }
  });
}

// Function: addItem()
// Adds a new item to the "items" array, setting defaults as needed, and returns a promise
function addItem(itemData) {
  return new Promise((resolve, reject) => {
    // Set default published status if undefined
    itemData.published = itemData.published ? true : false;
    
    // Assign a unique ID based on the current length of the "items" array
    itemData.id = items.length + 1;
    
    // Push the item to the "items" array and resolve with the item data
    items.push(itemData);
    resolve(itemData);
  });
}

// Function: getItemsByCategory()
// Filters items based on a given category and returns a promise
function getItemsByCategory(category) {
  return new Promise((resolve, reject) => {
    const filteredItems = items.filter(item => item.category == category);
    if (filteredItems.length > 0) {
      resolve(filteredItems);
    } else {
      reject("No results returned");
    }
  });
}

// Function: getItemsByMinDate()
// Filters items whose postDate is greater than or equal to minDateStr and returns a promise
function getItemsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    const minDate = new Date(minDateStr);
    const filteredItems = items.filter(item => new Date(item.postDate) >= minDate);
    if (filteredItems.length > 0) {
      resolve(filteredItems);
    } else {
      reject("No results returned");
    }
  });
}

// Function: getItemById()
// Finds an item by its ID and returns a promise
function getItemById(id) {
  return new Promise((resolve, reject) => {
    const item = items.find(item => item.id == id);
    if (item) {
      resolve(item);
    } else {
      reject("No result returned");
    }
  });
}

// Export all the functions to be used in other files like server.js
module.exports = {
  initialize,
  getAllItems,
  getPublishedItems,
  getCategories,
  addItem,           // Exported new addItem function
  getItemsByCategory, // Exported new getItemsByCategory function
  getItemsByMinDate,  // Exported new getItemsByMinDate function
  getItemById         // Exported new getItemById function
};
