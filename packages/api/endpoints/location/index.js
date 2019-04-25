const location = require("@ephec-project/db/location");
const bodyParser = require("body-parser");

const API_KEY = "q9834t812gr0891gr091br089g190rbhq98gr509qbg890gr9g";

const bodyParserInstance = bodyParser.json();

async function middleware(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "POST") {
    if (req.headers.api_key !== API_KEY) {
      res.statusCode = 401;
      res.end(
        JSON.stringify({
          type: "error",
          message: "Invalid API Key"
        })
      );
      return;
    }

    console.log(req.body);

    res.end("ok");
  } else {
    try {
      let locations = await location.getAll();
      res.statusCode = 200;
      res.end(JSON.stringify(locations));
    } catch (e) {
      console.error(e);
      res.statusCode = 500;
      res.end(
        JSON.stringify({
          type: "error",
          message: "An error occured"
        })
      );
    }
  }
}

module.exports = (req, res) => {
  bodyParserInstance(req, res, () => middleware(req, res));
};
