const app = require("./app");
const https = require("https");
const fs = require("fs");
const CAMPAIGN_ABI = require("./abis/campaign.json");
const db = require("./db");
const Web3 = require("web3");
const v2RouterABI = require("./abis/uniswapv2router.json");
const {setIntervalAsync} = require("set-interval-async/dynamic");
const { USD_OP_RERARD_PERCENTAGE, UINISWAP_V2_ROUTER_ADDRESS, ETHEREUM_MAINNET_RPC } = require("../env");
const Campaign = db.Campaign;

// var server = require('http').createServer(app);
// const port = process.env.PORT || 5000;
// server.listen(port, () => console.log(`Listening on port ${port}..`));

const httpsPort = 443;
const privateKey = fs.readFileSync("src/cert/private.key");
const certificate = fs.readFileSync("src/cert/certificate.crt");
// const ca = fs.readFileSync("config/cert/ca_bundle.crt");
const credentials = {
  key: privateKey,
  cert: certificate,
//   ca: ca
}

https.createServer(credentials, app)
  .listen(httpsPort, () => {
    console.log(`[admin.givestation.org] servier is running at port ${httpsPort} as https.`);
  });
  
const OPTIMISIM_NETWORK_RPC = "https://mainnet.optimism.io";
const web3Opti = new Web3(OPTIMISIM_NETWORK_RPC);
const web3ETH = new Web3(ETHEREUM_MAINNET_RPC);
const uniswapV2Rounter = new web3ETH.eth.Contract(v2RouterABI, UINISWAP_V2_ROUTER_ADDRESS);
var scanBlockNumber1 = 0;
var maxBlockNumber1 = 0;
var ethereumUsdPrice = 0;

const getBlockNumber_on_optimism = () => {
	web3Opti.eth.getBlockNumber()
		.then((number) => {
			if (maxBlockNumber1 < number) {
				maxBlockNumber1 = number;
				if (scanBlockNumber1 == 0) {
					scanBlockNumber1 = number;
				}
				//   console.log("max block number", number);
			}
		}).catch((error) => {
			console.log("get blocknumber error");
		});
	setTimeout(getBlockNumber_on_optimism, 3000);
}

const getData_on_optimism = async () => {

	let curMaxBlock = maxBlockNumber1;
	if (scanBlockNumber1 != 0 && scanBlockNumber1 < curMaxBlock) {
		// console.log('scanFrom : ', scanBlockNumber1, " scanTo : ", curMaxBlock);
		try {
			await Donation_monitor_on_optimism(scanBlockNumber1, curMaxBlock);
			scanBlockNumber1 = curMaxBlock + 1;
		} catch (e) {
		}
	}
	setTimeout(getData_on_optimism, 6000);
}
  
const Donation_monitor_on_optimism = async (blockNumber, toBlockNumber) => {
	try 
	{    
    var keywordQuerys = [];
    keywordQuerys.push({ chainId: "10" });
    keywordQuerys.push({ chainId: "0xa" });
		await Campaign.find({ $or: keywordQuerys })
		.then(async (docs) => {
			var donationPromises = [];
			for(let idx=0; idx<docs.length; idx ++)
			{
				try{
					// console.log("monitoring docs[idx].groupid  ===> ", docs[idx].groupid, docs[idx].pooladdress);
					var campaignContract = new web3Opti.eth.Contract(CAMPAIGN_ABI, docs[idx].address);
					donationPromises.push(campaignContract.getPastEvents("ContributeEvent", { fromBlock: blockNumber, toBlock: toBlockNumber }));
				}catch(error){
					console.log(`Donation_monitor_on_optimism ${docs[idx].address}  : `, error.message);
					Campaign.deleteOne({_id: docs[idx]._id }).then(() => { return; }).catch(() => { return });
				}
			}
			await Promise.all(donationPromises)
			.then( async (donationEventslist) =>
			{
				console.log("donationEventslist.length ==> ", donationEventslist.length);
				for(let idx1 = 0; idx1 < donationEventslist.length; idx1 ++)
				{
					const EventlistOfMultipleTokens = donationEventslist[idx1];
					if (EventlistOfMultipleTokens.length > 0) 
					{
						let i;
						for (i = 0; i < EventlistOfMultipleTokens.length; i++) 
						{
							let data = EventlistOfMultipleTokens[i];	
							let objTemp = data.returnValues;
												
							const txHash = data.transactionHash;
							const caller = objTemp.addr;
							const nativeValue = objTemp.value;

// Donate $3 - 5 to get 0.2 OP Tokens
// Donate $5 - 10 to get 0.9 OP Tokens
// Donate $10 - 50 to get 5 OP Tokens
							try{
								
				const weiAmount = web3Opti.utils.toWei(amount.toString(), "ether").toString();
                const usdMweiAmount = await uniswapV2Rounter.methods.getAmountsOut(weiAmount, [WETH_ADDRESS_ON_ETHEREUM,USDT_ADDRESS_ON_ETHEREUM]).call();                
                const usdAmount = Number(web3Opti.utils.fromWei(usdMweiAmount.toString(), "mwei").toString());
                console.log(`ETH : ${amount} ===> USD ${usdAmount}`);
                let rewardOPAmount = 0;
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
								continue;
							}
						}
					} else {
						continue;
					}
				}
			})
			.catch((error) => {
				console.log(error);
			})			
		})
		.catch((error) => {
			console.log(error);
			return;
		})		
	} catch (error) {
		console.log("Something went wrong 1: " + error.message)
	}
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