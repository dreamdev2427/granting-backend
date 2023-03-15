const db = require("../../db");
const Web3 = require("web3");
const { USD_OP_RERARD_PERCENTAGE, ETHEREUM_MAINNET_RPC, WETH_ADDRESS_ON_ETHEREUM, USDT_ADDRESS_ON_ETHEREUM, UINISWAP_V2_ROUTER_ADDRESS } = require("../../../env");
const v2RouterABI = require("../../abis/uniswapv2router.json");

const Donation = db.Donation;
const Campaign = db.Campaign;
const web3WS1 = new Web3(ETHEREUM_MAINNET_RPC);
const uniswapV2Rounter = new web3WS1.eth.Contract(v2RouterABI, UINISWAP_V2_ROUTER_ADDRESS);

var ObjectId = require('mongodb').ObjectID;

exports.createDonation = async (req, res) => {
    var campaign = req.body.campaign;
    var amount = req.body.amount;
    var donor = req.body.donor;
    var chainId = req.body.chainId;
    let rewardOPAmount = 0;

    var newDonation = new Donation({
        campaign: new ObjectId(campaign),
        amount,
        donor,
        chainId,
        opReward: rewardOPAmount
    });

    newDonation.save().then((data) => {
        // return res.send({ code: 0, data, message:"" });
    }).catch((err) => {
        console.log("create donation error : ", err);
        // return res.send({ code: -1, data, message: "" });
    });

    Campaign.findById(new ObjectId(campaign))
    .then((data) => {
        var raised = Number(data.raised);
        raised += Number(amount);
       
        Campaign.findByIdAndUpdate(new ObjectId(campaign), { raised }).then((data) => {
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
    Donation.find({}).populate("campaign")
    .then((docs) => {
            return res.send({ code:0, data: docs, message: "" });
    })
    .catch((err) => {        
        console.log("Donations doesn't exisit" + err.message);
        return res.send({ code: -1, data:{}, message: "" });
    })
}

exports.deleteOne = (req, res) => {
    Donation.deleteOne({ _id: req.body._id }, function (err) {
        if (!err)
            return res.send({ code: 0, data:{}, message:"" });
        else
            return res.send({ code:-1, data:{}, message: "" });
    });
}

exports.getDonationCountsOfUser = (req, res) => {
    var donor = req.body.user;
    var chainId = req.body.chainId;

    Donation.find({ donor, chainId}).count().then((data) => { 
        return res.send({ code: 0, data, message:"" });
    }).catch((err) => {
        return res.send({ code:-1, data:0, message: "" });
    });
}

exports.getTotalDonatedAmountsOfUser = (req, res) => {
    var donor = req.body.user;
    var chainId = req.body.chainId;

    Donation.find({donor, chainId}, function (err, docs) {
        if (err) {
            console.log("Donations doesn't exisit" + err.message);
            return res.send({ code: -1, data:{}, message: "" });
        }
        else {
            if(docs.length >0)
            {
                let sum = 0, sumOPs = 0;
                for(let idx = 0; idx < docs.length; idx++)
                {
                    sum += Number(docs[idx].amount);
                }
                return res.send({ code:0, data: sum, message: "" });
            }
            else {
                return res.send({ code:0, data: 0,   message: "" });
            }
        }
    });
}

exports.getDonationsOfUser = (req, res) => {
    var donor = req.body.user;
    var chainId = req.body.chainId;

    Donation.find({donor, chainId}).populate("campaign")
    .then((docs) => {
            if(docs.length >0)
            {
                return res.send({ code:0, data: docs, message: "" });
            }
            else {
                return res.send({ code:0, data: [], message: "" });
            }
    })
    .catch((err) => {        
        console.log("Donations doesn't exisit" + err.message);
        return res.send({ code: -1, data:[], message: "" });
    })
}


exports.getStatisticPerChain = (req,res) => {    
	Donation.aggregate([        
        {
            $project:
               {
                    donor: 1,
                    chainId: 1,
                    amount: 1,
               }
        },              
        // { $match : { chainId : (req.body.chainId).toString() } } ,
		{$group: {_id:"$donor", amount:{$sum:"$amount"}}},			
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
