const md5 = require("md5");
const db = require("../../db");

const GeneralOptions = db.GeneralOptions;

var ObjectId = require('mongodb').ObjectID;

exports.setGeneralOptions = async (req, res) => {
    var wallet = req.body.wallet;
    var showAllGrants = req.body.showAllGrants;
    var allowGrantCreation = req.body.allowGrantCreation;
    
    await GeneralOptions.find({ 
        adminWalletHash: md5(wallet)
    })
    .then(async (docs) =>{
        if(docs.length>0)
        {
            try {
                await GeneralOptions.updateOne(
                    {_id: docs[0]._id},
                    {
                        $set: {
                            ...req.body
                        },
                        $currentDate: {
                            ends: true,
                        }
                    },
                    { upsert: true }
                );
               return res.send({ code: 0, data:{}, message: "Updated" });
            } catch (err) {
                return res.send({ code: -1, data:{}, message: "" });
            }
        }else{         
            return res.send({ code: -1, data:{}, message: "Can not fine default data." });
        }        
    }).catch((err) => {    
        return res.send({ code: -1, data:{}, message: err });      
    })
    
}

exports.getAll = (req, res) => {
    GeneralOptions.find({})
    .then((docs) => {
            return res.send({ code:0, data: docs, message: "" });
    }).catch((err) => {        
        console.log("GeneralOptions doesn't exisit" + err.message);
        return res.send({ code: -1, data:{}, message: "" });   
    });
}
