const dbConfig = require('./config');
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.Likes = require("./likes.model")(mongoose);
db.Donation = require("./donations.model")(mongoose);
db.Campaign = require("./campaigns.model")(mongoose);
db.NativePrice = require("./nativePrices.model")(mongoose);

module.exports = db;
