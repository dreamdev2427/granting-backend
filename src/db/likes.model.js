module.exports = (mongoose) => {
    const Likes = mongoose.model(
        "Likes",
        mongoose.Schema(
            {
                campaign: 
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref : "Campaign"
                },
                user: String,   //wallet address
                value: Boolean, 
                chainId: String
            },
            { timestamps: true }
        )
    );
    return Likes;
};
