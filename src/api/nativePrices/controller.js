const db = require("../../db");

const NativePrice = db.NativePrice;

var ObjectId = require('mongodb').ObjectID;

exports.setPrice = (req, res) => {
    var symbol = req.body.symbol;
    var price = req.body.price;
    var chainId = req.body.chainId;

    var newPrice = new NativePrice({
        symbol,
        price,
        chainId
    });

    NativePrice.find({ 
        symbol, chainId
    })
    .then(async (docs) =>{
        if(docs.length>0)
        {
            try {
                await NativePrice.updateOne(
                    {_id: docs[0]._id},
                    {
                        $set: {
                            price
                        },
                        $currentDate: {
                            ends: true,
                        }
                    },
                    { upsert: true }
                );
               return res.send({ code: 0, data:{}, message: "" });
            } catch (err) {
                return res.send({ code: -1, data:{}, message: "" });
            }
        }else{            
            newPrice.save().then((data) => {
                return res.send({ code: 0, data, message:"" });
            }).catch((err) => {
                return res.send({ code: -1, data:{}, message: "" });
            });
        }        
    }).catch((err) => {    
        return res.send({ code: -1, data:{}, message: "" });      
    })
    
}

exports.getAll = (req, res) => {
    NativePrice.find({})
    .then((docs) => {
            return res.send({ code:0, data: docs, message: "" });
    }).catch((err) => {        
        return res.send({ code: -1, data:[], message: "" });   
    });
}

exports.getOne = (req, res) => {
    NativePrice.find({ ...req.body })
    .then((docs) => {
            return res.send({ code:0, data: docs, message: "" });
    }).catch((err) => {        
        return res.send({ code: -1, data:[], message: "" });   
    });
}

exports.deleteOne = (req, res) => {
    NativePrice.deleteOne({ _id: req.body._id }, function (err) {
        if (!err)
            return res.send({ code:0, data:{}, message:"" });
        else
            return res.send({ code:-1, data:{}, message:"" });
    });
}
