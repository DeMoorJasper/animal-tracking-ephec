const animal = require("@ephec-project/db/animal");
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

    await animal.add(req.body)

    res.end("ok");
  } else {
    try {
      let animals = await animal.getAll();
      res.statusCode = 200;
      res.end(JSON.stringify(animals));
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
