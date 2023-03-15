const db = require("../../db");
const axios = require("axios");
const Web3 = require("web3");
const { USD_OP_RERARD_PERCENTAGE } = require("../../../env");

const Donation = db.Donation;
const Campaign = db.Campaign;
const OPTIMISIM_NETWORK_RPC = "https://mainnet.optimism.io";
var web3WS1 = new Web3(OPTIMISIM_NETWORK_RPC);
var ethereumUsdPrice = 0;

var ObjectId = require('mongodb').ObjectID;

exports.createDonation = (req, res) => {
    var campaign = req.body.campaign;
    var amount = req.body.amount;
    var donor = req.body.donor;
    var chainId = req.body.chainId;
    let rewardOPAmount = 0;

    if(chainId === "0xa" || chainId == 10)
    {
        // Donate $3 - 5 to get 0.2 OP Tokens
        // Donate $5 - 10 to get 0.9 OP Tokens
        // Donate $10 - 50 to get 5 OP Tokens
		try{
				// const realAmount = Number(web3WS1.utils.fromWei(nativeValue.toSting(), "ether").toString());
                const usdAmount = amount * ethereumUsdPrice;
                if(usdAmount >= USD_OP_RERARD_PERCENTAGE[0].min && usdAmount < USD_OP_RERARD_PERCENTAGE[0].max)
                {
                  rewardOPAmount = USD_OP_RERARD_PERCENTAGE[0].reward
                }
                if(usdAmount >= USD_OP_RERARD_PERCENTAGE[1].min && usdAmount < USD_OP_RERARD_PERCENTAGE[1].max)
                {
                  rewardOPAmount = USD_OP_RERARD_PERCENTAGE[1].reward
                }
                if(usdAmount >= USD_OP_RERARD_PERCENTAGE[2].min && usdAmount < USD_OP_RERARD_PERCENTAGE[2].max)
                {
                  rewardOPAmount = USD_OP_RERARD_PERCENTAGE[2].reward
                }
                if(usdAmount >= USD_OP_RERARD_PERCENTAGE[3].min && usdAmount < USD_OP_RERARD_PERCENTAGE[3].max)
                {
                  rewardOPAmount = USD_OP_RERARD_PERCENTAGE[3].reward
                }
                if(usdAmount >= USD_OP_RERARD_PERCENTAGE[4].min)
                {
                  rewardOPAmount = USD_OP_RERARD_PERCENTAGE[4].reward
                }                
            }catch(error)
            {
                console.log(error);
            }
    }


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
                let sum = 0;
                for(let idx = 0; idx < docs.length; idx++)
                {
                    sum += Number(docs[idx].amount);
                }
                return res.send({ code:0, data: sum, message: "" });
            }
            else {
                return res.send({ code:0, data: 0, message: "" });
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


const priceFetching_loop = () => {
  setIntervalAsync(async () => {
    try {
      let binanceResponse = await axios.get("https://api.binance.com/api/v3/ticker/price?symbols=%5B%22ETHUSDT%22%5D");
      currentPrices = binanceResponse?.data ? binanceResponse.data : [];
      ethereumUsdPrice =
        currentPrices.find((item) => item.symbol === "ETHUSDT")?.price || 0;

    } catch (error) {}
  }, 3000);
};

priceFetching_loop();