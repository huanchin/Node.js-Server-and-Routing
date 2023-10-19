const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");

/*************************Server/ HTTP**************************************/

//to be more efficient, we want to read the data just once instead of reading it each time server get the req
//because we only read the data for once, its better for us to use sync type reading method
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

//create server, callback function is executed each time that a new request hits the server
const server = http.createServer((req, res) => {
  //get the pathname and query from request url
  const { query, pathname } = url.parse(req.url, true);

  //Routing: refers to determining how an application responds to client requests for specific endpoints

  // Overview Page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });


    //map function: map through all the elements(products) in and array(dataObj)
    //join function: creates and returns a new string by concatenating all of the elements in this array, separated by commas or a specified separator string.
    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    // Product Page
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-Type": "text/html" });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html", //this is to inform the browser of the content type: the browser is now expecting some HTML
      "my-own-header": "hello-world", //We can also specify our own made up headers.
    });
    res.end("<h1>404 Page not found!</h1>");
  }
});

//started to listen for incomming request on the local IP and port 8000
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
