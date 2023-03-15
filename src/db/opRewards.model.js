module.exports = (mongoose) => {
  const OpRewards = mongoose.model(
    "OpRewards",
    mongoose.Schema(
      {
        wallet: String,
        txHash: { type: String, unique: true },
        chainId:{ type: Number, default: "10" }, 
        amount: { type: Number, default: 0 }
      },
      { timestamps: true }
    )
  );

  return OpRewards;
};
