module.exports = (mongoose) => {
    const NativePrices = mongoose.model(
        "NativePrice",
        mongoose.Schema(
            {                
                symbol: String,  //can be "BNB", "xDAi", "MATIC", ...
                price: {type:Number, default:0}, // 
                chainId: String
            },
            { timestamps: true }
        )
    );
    return NativePrices;
};
