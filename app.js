const express = require("express");
const http = require("http");
const { handleSocketLogic } = require("./socketServer");
const dotenv = require('dotenv');
const message = require('./routes/message.js');
const login = require("./routes/auth.js");
const register = require("./routes/register.js");
const logout = require("./routes/logout.js");
const mongoose = require('mongoose');
// const socketIOHandler = require('./socket');
const socketIO = require("socket.io");
dotenv.config();


const app = express();
const server = http.createServer(app);
// const server2 = http.createServer(app);
const io = require("socket.io")(server);
// socketIOHandler(server);

const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGOURI
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
// routes
app.use("/", login);
app.use("/", register);
app.use("/", logout);
app.use('/', message);

handleSocketLogic(io);

// server.listen(PORT, () => {
//   console.log(`Server is running on  http://localhost:${PORT}`);
// });

async function connectToMongo() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // connect app
    server.listen(PORT, () => {
      console.log(`Server is running on  http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

connectToMongo();