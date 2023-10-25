const express = require('express');
const { fetchHrefs } = require('./linkExtractor');

const app = express();

app.use(express.json());

app.post('/fetch-links', async (req, res) => {
  const { url } = req.body;  // Get the URL from the request body
  if (!url || !validURL(url)) {
    return res.status(400).send({ error: 'Invalid URL' });
  }

  const result = await fetchHrefs(url);
  if (result.status === 'success') {
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
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}
