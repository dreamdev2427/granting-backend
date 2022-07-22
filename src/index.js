const app = require("./app");
const https = require("https");
const fs = require("fs");
// var server = require('http').createServer(app);
// const port = process.env.PORT || 5000;
// server.listen(port, () => console.log(`Listening on port ${port}..`));

const httpsPort = 443;
const privateKey = fs.readFileSync("src/cert/private.key");
const certificate = fs.readFileSync("src/cert/certificate.crt");
// const ca = fs.readFileSync("config/cert/ca_bundle.crt");
const credentials = {
  key: privateKey,
  cert: certificate,
//   ca: ca
}

https.createServer(credentials, app)
  .listen(httpsPort, () => {
    console.log(`[admin.givestation.org] servier is running at port ${httpsPort} as https.`);
  });

