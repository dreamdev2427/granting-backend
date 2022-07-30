const db = require("../../db");

const Likes = db.Likes;
const Campaign = db.Campaign;

var ObjectId = require('mongodb').ObjectID;

exports.setLikes = (req, res) => {
    var campaign = req.body.campaign;
    var user = req.body.user;
    var value = req.body.value;
    var chainId = req.body.chainId;

    var newLikes = new Likes({
        campaign: new ObjectId(campaign),
        user,
        value,
        chainId
    });

    Likes.find({ 
        campaign:new ObjectId(campaign), user
    }).populate("campaign")
    .then(async (docs) =>{
        if(docs.length>0)
        {
            try {
                await Likes.updateOne(
                    {_id: docs[0]._id},
                    {
                        $set: {
                            value
                        },
                        $currentDate: {
                            ends: true,
                        }
                    },
                    { upsert: true }
                );
               // return res.send({ code: 0, data:{}, message: "" });
            } catch (err) {
                return res.send({ code: -1, data:{}, message: "" });
            }
        }else{            
            newLikes.save().then((data) => {
                //return res.send({ code: 0, data, message:"" });
            }).catch((err) => {
                return res.send({ code: -1, data:{}, message: "" });
            });
        }        
    }).catch((err) => {    
        return res.send({ code: -1, data:{}, message: "" });      
    })
    
    Campaign.findById(new ObjectId(campaign))
    .then((data) => {
        var likes = Number(data.likes);
        if(value === false) likes -= 1;
        if(value === true) likes += 1;
       
        Campaign.findByIdAndUpdate(new ObjectId(campaign), { likes }).then((data) => {
                return res.send({ code: 0, data: {}, message:"updating succeed" });
            }).catch((err) => {
                console.log("updating raised error : ", err);
                return res.send({ code: -1, data: {}, message: "update error" });
            })
       
    }).catch((error) => {
        console.log("updating raised error : ", error);
        return res.send({ code: -1, data: {}, message: "find error" });
    });
}

exports.getAll = (req, res) => {
    Likes.find({}).populate("campaign")
    .then((docs) => {
            return res.send({ code:0, data: docs, message: "" });
    }).catch((err) => {        
        console.log("Likes doesn't exisit" + err.message);
        return res.send({ code: -1, data:{}, message: "" });   
    });
}

exports.deleteOne = (req, res) => {
    // console.log("Delete likes 0");
    Likes.deleteOne({ _id: req.body._id }, function (err) {
        if (!err)
            return res.send({ code:0, data:{}, message:"" });
        else
            return res.send({ code:-1, data:{}, message:"" });
    });
}

exports.getAllLikedCampaigns = (req, res) => {
    var user = req.body.user;
    var chainId = req.body.chainId;

    Likes.find({ user, chainId, value:true }).populate("campaign")
    .then((docs) => {
            return res.send({ code:0, data: docs, message: "" });
    })
    .catch((err) => {
        console.log("Likes doesn't exisit" + err.message);
        return res.send({ code: -1, data:{}, message: "" });
    })
}
