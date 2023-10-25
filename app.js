const express = require("express");
const { fetchHrefs } = require("./linkExtractor");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Link Extractor API</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f9f9f9;
                color: #333;
            }
            .container {
                margin: auto;
                padding: 20px;
                max-width: 800px;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            h1 {
                font-size: 24px;
                margin-bottom: 10px;
            }
            code {
                background-color: #f0f0f0;
                padding: 5px;
                border-radius: 4px;
                display: block;
                margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Link Extractor API</h1>
            <p>To extract links from a webpage, make a POST request to the following URL:</p>
            <code>http://linksscraper-env.eba-z4jqg8m2.us-east-1.elasticbeanstalk.com/fetch-links</code>
            <p>Include a request body with the URL from which you want to extract links, like so:</p>
            <code>{
  "url": "https://www.adidas-group.com/en/service/sitemap/"
}</code>
        </div>
    </body>
    </html>
  `);
});

app.post("/fetch-links", async (req, res) => {
  const { url } = req.body; // Get the URL from the request body
  if (!url || !validURL(url)) {
    return res.status(400).send({ error: "Invalid URL" });
  }

  const result = await fetchHrefs(url);
  if (result.status === "success") {
    res.json({ links: result.hrefs });
  } else {
    res.status(500).send({ error: result.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

function validURL(str) {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}
