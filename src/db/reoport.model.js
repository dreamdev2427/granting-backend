module.exports = (mongoose) => {
    const Report = mongoose.model(
        "Report",
        mongoose.Schema(
            {
                content: String,
                report_type: Number, //0: nft item report , 1: person report
                target_id: mongoose.Schema.Type.ObjectId
            },
            { timestamps: true }
        )
    );
    return Report;
};
