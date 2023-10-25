const axios = require("axios");
const cheerio = require("cheerio");

async function fetchHrefs(url) {
  try {
    const response = await axios.get(url);
    if (response.status !== 200) {
      return {
        status: "error",
        message: `Unexpected status code: ${response.status}`,
      };
    }

    const html = response.data;
    const $ = cheerio.load(html);
    const hrefs = $("a[href]").map((_, link) => $(link).attr("href")).get();

    return {
      status: "success",
      hrefs: hrefs,
    };
  } catch (error) {
    return {
      status: "error",
      message: `An error occurred: ${error.message}`,
    };
  }
}

module.exports = {
  fetchHrefs,
};