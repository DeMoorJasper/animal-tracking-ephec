const http = require("http");
const url = require("url");

const PORT = process.env.PORT || 3300;

let server = http.createServer(function(req, res, next) {
  let { pathname } = url.parse(req.url);
  let functionName = pathname.substring(1);

  try {
    let middlewareFunction = null;
    try {
      middlewareFunction = require(`./endpoints/${functionName}/index.js`);
    } catch (e) {
      console.error(e);
      res.statusCode = 404;
      res.end("Function not defined.");
      return;
    }

    console.log("Handle request:", req.url);
    return middlewareFunction(req, res, next);
  } catch (e) {
    console.error(e);

    res.statusCode = 500;
    res.end(e.message);
  }
});

server.listen(PORT);
console.log(`Server Started: http://localhost:${PORT}`);
