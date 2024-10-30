/*********************************************************************************
WEB322 – Assignment 03
I declare that this assignment is my own work in accordance with Seneca Academic Policy.
No part of this assignment has been copied manually or electronically from any other source.

Name: vrushabhkumar patel
Student ID: 122714223
Date: 2024-09-29
********************************************************************************/ 

const express = require('express');
const path = require('path');
const storeService = require('./store-service'); // Import the store-service module

const app = express();
const PORT = process.env.PORT || 8080;

// Importing required modules for file handling and Cloudinary integration
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Configure Cloudinary with account details
cloudinary.config({
    cloud_name: 'Your Cloud Name',  // Replace with your actual Cloudinary cloud name
    api_key: 'Your API Key',        // Replace with your actual Cloudinary API key
    api_secret: 'Your API Secret',  // Replace with your actual Cloudinary API secret
    secure: true
});

// Initialize multer for handling file uploads
const upload = multer();

// Serve static files from the "public" folder
app.use(express.static('public'));

// Redirect the root ("/") to "/about"
app.get('/', (req, res) => {
  res.redirect('/about');
});

// Serve the "/about" page
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/about.html'));
});

// "/shop" route - return all published items
app.get('/shop', (req, res) => {
  storeService.getPublishedItems()
    .then(data => res.json(data))  // Send the published items as a JSON response
    .catch(err => res.status(500).json({ message: err }));
});

// "/items" route - return all items
app.get('/items', (req, res) => {
  storeService.getAllItems()
    .then(data => res.json(data))  // Send all items as a JSON response
    .catch(err => res.status(500).json({ message: err }));
});

// "/categories" route - return all categories
app.get('/categories', (req, res) => {
  storeService.getCategories()
    .then(data => res.json(data))  // Send all categories as a JSON response
    .catch(err => res.status(500).json({ message: err }));
});

// Route to serve the "addItem.html" form
app.get('/items/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/addItem.html'));
});

// POST route to handle adding a new item with an optional image upload
app.post('/items/add', upload.single("featureImage"), (req, res) => {
  if (req.file) {
      // Helper function to upload the image to Cloudinary
      let streamUpload = (req) => {
          return new Promise((resolve, reject) => {
              let stream = cloudinary.uploader.upload_stream((error, result) => {
                  if (result) resolve(result);
                  else reject(error);
              });
              streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
      };

      async function upload(req) {
          let result = await streamUpload(req);
          return result;
      }

      upload(req).then((uploaded) => {
          processItem(uploaded.url);  // Process item with uploaded image URL
      }).catch((err) => {
          res.status(500).send("Error uploading image");
      });
  } else {
      processItem("");  // Process item without an image URL
  }

  function processItem(imageUrl) {
      req.body.featureImage = imageUrl;
      storeService.addItem(req.body)
          .then(() => res.redirect('/items'))
          .catch(err => res.status(500).send("Error adding item"));
  }
});

// Handle unmatched routes - custom 404 response
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

// Start the server only if initialize() is successful
storeService.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Express http server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error(`Failed to initialize data: ${err}`);
  });
