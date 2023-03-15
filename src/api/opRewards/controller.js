const db = require("../../db");

const OpRewards = db.OpRewards;

var ObjectId = require('mongodb').ObjectID;

exports.create = async (req, res) => {
    var wallet = req.body.wallet;
    var amount = req.body.amount;
    var chainId = req.body.chainId;
    var txHash = re.body.txHash;

    var newOpRewards = new OpRewards({
        wallet, amount, chainId, txHash
    });

    newOpRewards.save().then((data) => {
        return res.send({ code: 0, data, message:"" });
    }).catch((err) => {
        console.log("create op reward doc error : ", err);
        return res.send({ code: -1, data, message: "" });
    });

}

exports.getAll = (req, res) => {
    OpRewards.find({}).populate("campaign")
    .then((docs) => {
            return res.send({ code:0, data: docs, message: "" });
    })
    .catch((err) => {        
        console.log("OpRewardss doesn't exisit" + err.message);
        return res.send({ code: -1, data:{}, message: "" });
    })
}

exports.deleteOne = (req, res) => {
    OpRewards.deleteOne({ _id: req.body._id }, function (err) {
        if (!err)
            return res.send({ code: 0, data:{}, message:"" });
        else
            return res.send({ code:-1, data:{}, message: "" });
    });
}

exports.getOpRewardsOfUser = (req, res) => {
    var wallet = req.body.user;
    var chainId = req.body.chainId;

    OpRewards.aggregate([       
        { $match : { chainId : chainId.toString() } } ,
        { $match : { wallet : wallet.toString() } },
		{$group: {_id:"$wallet", amount:{$sum:"$amount"}}}
	])
	.then((docs) => { 
        return res.send({ code: 0, data: docs[0], message:"" });
    }).catch((err) => {
        return res.send({ code:-1, data:0, message: "" });
    });
}

exports.getStatisticPerChain = (req,res) => {    
	OpRewards.aggregate([        
        {
            $project:
               {
                    wallet: 1,
                    chainId: 1,
                    amount: 1,
               }
        },              
        // { $match : { chainId : (req.body.chainId).toString() } } ,
		{$group: {_id:"$wallet", amount:{$sum:"$amount"}}},			
		{
			$sort: {
				amount: -1
			}
		}
	])
	.then((docs) => {
        var result = [];
        for(let idx=0; idx<docs.length; idx++)
        {
            result[idx] = docs[idx]._id;
        }        
        return res.send( result );
    })
    .catch((error) => {
        return res.send({ code: -1, data:[], message: "" });
    });
}
