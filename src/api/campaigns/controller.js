const db = require("../../db");

const Campaign = db.Campaign;

var ObjectId = require('mongodb').ObjectID;

exports.createCampaign = (req, res) => {
    var name = req.body.name;
    var description = req.body.description;
    var imageURL = req.body.imageURL;
    var minimum = req.body.minimum;
    var target = req.body.target;
    var creator = req.body.creator;
    var category = req.body.category;
    var address = req.body.address;
    var chainId = req.body.chainId;
    var twitterurl = req.body.twitterurl;
    var websiteurl = req.body.websiteurl;
    var telegramurl = req.body.telegramurl;

    var newCampaign = new Campaign({
        name, description, imageURL, minimum, target, creator, category, address, chainId,
        twitterurl, websiteurl, telegramurl
    });

    newCampaign.save().then((data) => {
        return res.send({ code: 0, data, message:"" });
    }).catch((err) => {
        return res.send({ code: -1, data, message: "" });
    });
}

exports.getAll = (req, res) => {
    Campaign.find({...req.body}, function (err, docs) {
    if (err) {
        console.log("Campaign doesn't exisit" + err.message);
        return res.send({ code: -1, data:{}, message: "" });
    }
    else {        
        return res.send({ code:0, data: docs, message: "" });
    }
});
}

exports.getByLimit = (req, res) => {
    Campaign.find({...req.body})
    .skip(req.body.skip)
    .limit(req.body.limit)
    .then(docs => {
        return res.send({ code:0, data: docs, message: "" });    
    })
    .catch(error => {
        console.log("Campaign doesn't exisit" + err.message);
        return res.send({ code: -1, data:{}, message: "" });
    });
}

exports.getCampaignCounts = (req, res) => {
    Campaign.find({}).count()
    .then((data) =>  {
        return res.send({ code:0, data: data, message: "" });
    })
    .catch((error) => {
        return res.send({ code: -1, data:0, message: "" });
    })
}

exports.getOne = (req, res) => {
    Campaign.find({_id:req.body._id}, function (err, docs) {
    if (err) {
        console.log("Campaign doesn't exisit" + err.message);
        return res.send({ code: -1, data:{}, message: "" });
    }
    else {        
        return res.send({ code:0, data: docs, message: "" });
    }
});
}

exports.deleteByAdmin = (req, res) => {
    if(req.body.password == "91315")
    {
        const idArray = req.body.idArray;
        var idQuerys = [];
        for (let idx = 0; idx < idArray.length; idx++) {
            idQuerys.push({ _id: new ObjectId(idArray[idx]) });
        }
        idQuerys.push({ address: "" });
        Campaign.deleteMany({ $or: idQuerys }, function (err) {
            if (!err)
                return res.send({ code: 0, data: {}, message: `deleted  grants successfully` });
            else
                return res.send({ code: -1, data: {}, message: "Error" });
        });
    }
}

exports.deleteOne = (req, res) => {    
    if(req.body.creator && req.body.campainId)
    {
        Campaign.findOne({ _id: new ObjectId(req.body.campainId) }, function (err, docs) {
            // console.log("err : " + err);
            if (err) {
                console.log("Item doesn't exisit" + err.message);
                return res.send({ code: 1, message: "Internal server Error" });
            }
            else {
                if (docs !== null && docs !== undefined) 
                {
                    console.log("[delete] ", docs.creator, req.body.creator);
                    if(docs.creator.toString() === req.body.creator) 
                    {
                        Items.findOneAndDelete({ _id: new ObjectId(req.body.campainId) }).then((data) => {
                            return res.send({ code: 0, data: {}, message: "succeed, deleted" });
                        })
                        .catch((err) => {
                            return res.send({ code: 1, data: {}, message: err });
                            
                        })
                    }
                    else return res.send({ code: 1, data: {}, message: "not a campaign creator" });
                }
                else return res.send({ code:  1, data: {}, message: "Can't find such campaign" });
            }
        });
    }
    
}

exports.getCampaignCountsOfUser = (req, res) => {
    var creator = req.body.user;
    var chainId = req.body.chainId;
    
    Campaign.find({ creator, chainId}).count().then((data) => { 
        return res.send({ code: 0, data, message:"" });
    }).catch((err) => {
        return res.send({ code:-1, data:0, message: "" });
    });    
}

exports.getCampaignsOfUser = (req, res) => {
    var creator = req.body.user;
    var chainId = req.body.chainId;

    Campaign.find({creator, chainId}, function (err, docs) {
        if (err) {
            console.log("Campaign doesn't exisit" + err.message);
            return res.send({ code: -1, data:{}, message: "" });
        }
        else {
            return res.send({ code:0, data: docs, message: "" });
        }
    });
}

exports.update = (req, res) => {    
    var _id = req.body._id;
    var incomeData = req.body;
    delete incomeData._id;
    Campaign.findByIdAndUpdate(
        _id,
        {
            ...incomeData
        },
        { useFindAndModify: false }
    )
        .then((data) => {
            if (!data) {
                return res.send({
                    code:-1,
                    data,
                    message: `Cannot update Campaign with id = ${_id}. Maybe Campaign was not found.`,
                });
            } else return res.send({code:0, data, message: "Campaign was updated successfully" });
        })
        .catch((err) => {
            return res.send({
                code:-1,
                data:{},
                message: "Error updating Campaign with id = " + _id,
            });
        });
}
