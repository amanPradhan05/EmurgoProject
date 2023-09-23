const express = require("express");
const axios = require("axios");
const NodeCache = require("node-cache");

const app = express();
const port = process.env.PORT || 3000;
const cache = new NodeCache();

// Middleware for JSON parsing
app.use(express.json());

// Define routes here
// Example: Fetching N news articles
app.get("/articles/:count", async (req, res) => {
  const { count } = req.params;
  const cacheKey = `articles-${count}`;

  // Check if data is cached
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    console.log("Data retrieved from cache");
    return res.json(cachedData);
  }

  try {
    const response = await axios.get(
      `https://gnews.io/api/v4/search?q=example&lang=en&country=us&max=10&apikey=cfc9ce8a5a5cc1e04f607d9149845ea3`
    );
    const articles = response.data.articles;

    // Cache the data for future requests
    cache.set(cacheKey, articles, 60 * 60); // Cache for 1 hour (adjust as needed)

    res.json(articles);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching articles." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
