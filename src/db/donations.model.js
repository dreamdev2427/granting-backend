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
                chainId: String
            },
            { timestamps: true }
        )
    );
    return Donation;
};
