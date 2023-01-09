module.exports = (mongoose) => {
  const Campaign = mongoose.model(
    "Campaign",
    mongoose.Schema(
      {
        name: String,
        description: String,
        imageURL: String,
        creator: String,  //wallet address
        chainId: String,
        twitterurl: String,
        websiteurl: String,
        telegramurl: String,
        minimum: { type: Number, default: 0 },
        target: { type: Number, default: 0 },
        category: { type: String, default: "" },
        address: String,
        verified: { type: Boolean, default: false },
        raised: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        hide: { type: Boolean, default: false },
        lock: { type: Boolean, default: false },
        schema_version: { type: String, default: "2" }
      },
      { timestamps: true }
    )
  );

  return Campaign;
};
