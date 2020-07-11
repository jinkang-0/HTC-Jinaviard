const express = require("express");
const app = express();

app.use(express.static("public"));

// Serve /index.html when request to /
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// Serve /intro.html when request to /intro
app.get("/intro", (request, response) => {
  response.sendFile(__dirname + "/views/intro.html");
});

// Serve /play.html when request to /play
app.get("/play", (request, response) => {
  response.sendFile(__dirname + "/views/play.html");
});

// Serve /intro.html when request to /ending
app.get("/ending", (request, response) => {
  response.sendFile(__dirname + "/views/intro.html");
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
