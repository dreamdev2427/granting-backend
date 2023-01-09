const md5 = require("md5");
const { adminWallet } = require("./config");

module.exports = (mongoose) => {
    const GeneralOptions = mongoose.model(
        "GeneralOptions",
        mongoose.Schema(
            {
                adminWalletHash: { type: String, default: md5(adminWallet) },  //hash of admin wallet
                showAllGrants: { type: Boolean, default: true },
                allowGrantCreation: { type: Boolean, default: true }
            },
            { timestamps: true }
        )
    );
    return GeneralOptions;
};
