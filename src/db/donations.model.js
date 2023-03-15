module.exports = (mongoose) => {
    const Donation = mongoose.model(
        "Donation",
        mongoose.Schema(
            {
                campaign:
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref : "Campaign"
                },
                donor: String,  //wallet address
                amount: Number, 
                chainId: String, 
                opReward: {
                    type: Number,
                    default: 0
                }
            },
            { timestamps: true }
        )
    );
    return Donation;
};
