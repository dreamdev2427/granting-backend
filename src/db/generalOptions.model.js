const md5 = require("md5");

module.exports = (mongoose) => {
    const GeneralOptions = mongoose.model(
        "GeneralOptions",
        mongoose.Schema(
            {
                adminWalletHash: { type: String, default: "" },  //hash of admin wallet
                showAllGrants: { type: Boolean, default: true },
                allowGrantCreation: { type: Boolean, default: true }
            },
            { timestamps: true }
        )
    );
    return GeneralOptions;
};
