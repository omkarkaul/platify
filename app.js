const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname+'/assets')); // providing static assets to web server

app.get('/', (req, res) => {
    console.log('serving root');
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/search', (req, res) => {
    console.log('serving search');
    res.sendFile(path.join(__dirname+'/pages/search.html'));
});

app.get('/about', (req, res) => {
    console.log('serving about');
    res.sendFile(path.join(__dirname+'/pages/about.html'));
});

app.get('*', (req, res) => {
    console.log('serving root via catch-all route');
    res.sendFile(path.join(__dirname+'/pages/404.html'));
});

app.listen(3000, () => {
    console.log('listening on 3000')
});