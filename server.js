
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const https = require("https");
const app = express();
const fs = require("fs");
const {HTTP_PORT, HTTPS_PORT} = require("./src/config/server.config");

// parse request of content-type - application/json
app.use(bodyParser.json({ limit: "5mb" }));
app.use(cookieParser());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// specify static path for public share
app.use(express.static(__dirname + "/public"));

// database
const db = require("./src/models");
const Role = db.role;

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Data connection success! Sequelize is ready to use...");
  })
  .catch((err) => {
    console.log("Database connection failure.");
    console.error(err);
  });

db.sequelize.sync({ force: false }).then(() => {
  console.log("Drop and Resync Database with { force: false }");
  // initial();
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to ESIGN backend server." });
});

// routes
require("./src/routes/auth.routes")(app);
require("./src/routes/user.routes")(app);
require("./src/routes/profile.routes")(app);
require("./src/routes/docsign.routes")(app);

// function initial() {
//   Role.create({
//     id: 1,
//     name: "user",
//   });

//   Role.create({
//     id: 2,
//     name: "moderator",
//   });

//   Role.create({
//     id: 3,
//     name: "admin",
//   });
// }

// start HTTP/HTTPS service
const PORT = process.env.PORT || HTTP_PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// const httpsPort = HTTPS_PORT;
// const privateKey = fs.readFileSync("config/cert/private.key");
// const certificate = fs.readFileSync("config/cert/certificate.crt");
// const ca = fs.readFileSync("config/cert/ca_bundle.crt");
// const credentials = {
//   key: privateKey,
//   cert: certificate,
//   ca: ca
// }
// https.createServer(credentials, app)
//   .listen(httpsPort, () => {
//     console.log(`[TFTB] servier is running at port ${httpsPort} as https.`);
//   });
