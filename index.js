require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// creating arrays to hold the urls and shorten urls
let original_url = [];
let short_url = [];

// The post API endpoint
app.post('/api/shorturl', function(req, res) {
  // getting the url submitted
  const url = req.body.url;
  const foundIndex = original_url.indexOf(url);

  // checking if an invalid url was passed
  if (!url.includes("https://") && !url.includes("http://")) {
    return res.json({ error: "Invalid url" });
  }
  if (foundIndex < 0) {
    original_url.push(url);
    short_url.push(short_url.length)

    return res.json({
        original_url: url,
        short_url: short_url.length - 1
    });
  };
  return res.json({
    original_url: url,
    short_url: short_url[foundIndex]
  }); 

});

app.get('/api/shorturl/:shorturl', (req, res) => {
  const shorturl = parseInt(req.params.shorturl);
    const foundIndex = short_url.indexOf(shorturl);

    if (foundIndex < 0) {
        return res.json({
            "error": "No short URL found for the given input"
        });
    }
    res.redirect(original_url[foundIndex]);
})

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
