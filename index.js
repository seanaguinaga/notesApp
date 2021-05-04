const { readFile } = require("fs/promises");
const { createServer } = require("http");
const path = require("path");

let getContentType = (filePath) => {
  let extName = path.extname(filePath);
  if (extName === ".js") {
    return "text/javascript";
  }
  if (extName === ".css") {
    return "text/css";
  }
  if (extName === ".png") {
    return "image/png";
  }
  if (extName === ".jpg") {
    return "image/jpg";
  }
};

const server = createServer();

server.on("request", async (request, response) => {
  let filePath = path.join(
    __dirname,
    request.url === "/" ? "index.html" : request.url
  );
  let countentType = getContentType(filePath) || "text/html";
  let emptyPagePath = path.join(__dirname, "404.html");
  try {
    console.log(filePath);
    let file = await readFile(filePath, "utf8");
    await response.writeHead(200, { "Content-type": countentType });
    await response.end(file);
  } catch (error) {
    if (error.code === "ENOENT") {
      let file = await readFile(emptyPagePath, "utf8");
      response.writeHead(200, { "Content-type": countentType });
      response.end(file);
    } else {
      response.writeHead(500);
      response.end("A server error occurred");
    }
  }
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
