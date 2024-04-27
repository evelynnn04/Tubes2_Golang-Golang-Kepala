const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const express = require("express");
const { Console } = require('console');
const server = express();

server.use(express.json());
// server.use(cors());
server.use(express.urlencoded({ extended: true }));
// server.use(express.static('public'));


server.get('/path/to/d3.min.js', (req, res) => {
    fs.readFile('path/to/d3.min.js', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('404 Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': 'application/javascript' });
        res.end(data);
      }
    });
  });

server.post("/save-data", async (req, res) => {
    const linkData = req.body;
    console.log(linkData);
    try {
        var resCode;
        resCode = await tryFetch(linkData);
        console.log(resCode);
        if (resCode == 200){
            writeToJSON(linkData);  
            console.log(linkData);
        }
        res.writeHead(200, { 'Content-Type': 'text/plain'});
        res.end('Data saved successfully');
    } catch (error) {
        console.error("Error in save-data route:", error);
        res.status(500).send("Error saving data"); 
    } 
});

server.get("/home", (req, res) => {
    fs.readFile('../client/index.html', (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('404 Not Found');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
});

server.listen(5173, () => {
    console.log("http://127.0.0.1:5173");
});

console.log("Server running...");
  
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
  
  
  async function tryFetch(linkData) {
    console.log(linkData);
    var resCode = 200;
    const fetchPromises = [];
    for (const link of [linkData.from, linkData.to]) {
      fetchPromises.push(fetch(link)
        .then(response => {
            if (response.status != 200){
                resCode = -1;
            }
        })
        .catch(error => {
        }));
    }
    await Promise.all(fetchPromises);
    return resCode;
  }
  