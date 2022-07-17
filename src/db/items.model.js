module.exports = (mongoose) => {
  const Item = mongoose.model(
    "Item",
    mongoose.Schema(
      {
        name: String,
        logoURL: String,
        description: String,
        collection_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Collection"
        },
        size: Number,
        creator: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        property: String,
        royalty: Number,
        price: { type: Number, default: 0 },
        lastPrice: { type: Number, default: 0 },
        type: Number,
        auctionPeriod: Number,
        auctionStarted: Number,
        isSale: { type: Number, default: 0 },     //0: not, 1: Buy now, 2: On Auction 
        metaData: String,

        bids: [
          {
            user_id:
            {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User"
            },
            price: Number,
            Time: String
          }
        ],

        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
          }
        ]
      },
      { timestamps: true }
    )
  );

  return Item;
};
