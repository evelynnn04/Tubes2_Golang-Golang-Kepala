// const http = require('http');
const fs = require('fs');
// const url = require('url');
// const path = require('path');
const express = require("express");
const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));

server.post("/save-data", (req, res) => {
    const linkData = req.body;
    // tryFetch(linkData);
    writeToJSON(linkData);
    console.log(linkData);
    res.writeHead(200, { 'Content-Type': 'text/plain'});
    res.end('Data saved successfully');
});

server.get("/", (req, res) => {
    fs.readFile('index.html', (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('404 Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
});

server.listen(3000, () => {
    console.log("http://127.0.0.1:3000");
});

console.log("Server running...");

function updateFile() {
    const fileInput = document.getElementById('from-field');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
  
    fetch('/update', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').textContent = data.message;
    })
    .catch(error => {
        console.error('Error:', error);
    });
  }
  
  function writeToJSON(newLinkData){
  
    const newDataJSON = JSON.stringify(newLinkData, null, 2);
    const filePath = 'link.json';
  
    fs.writeFile(filePath, newDataJSON, 'utf8', (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log('File "link.json" has been updated successfully.');
      }
    });
  }
  
  
function tryFetch(linkData) {
    console.log("masuk");
    for (const link of [linkData.from, linkData.to]) {
        console.log(link);
        fetch(link)
            .then(response => {
                response.end('Data saved successfully');
                console.log("wklnjhdecyuv")
            })
            .catch(error => {
            console.error('Error:', error);
            });
    }
  }

  