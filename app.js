const express = require("express");
const http = require("http");
const { handleSocketLogic } = require("./socketServer");
const dotenv = require('dotenv');
const message = require('./routes/message.js');

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
// routes
app.use('/', message);

handleSocketLogic(io);

server.listen(PORT, () => {
  console.log(`Server is running on  http://localhost:${PORT}`);
});
