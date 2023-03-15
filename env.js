const { formToJSON } = require("axios");

const jwt_enc_key = "THIS IS THE AUTH TOKEN ENCTYPTION KEY";
const admin_address = "0xccccCCCCcccccCCCCCCccc";
const signIn_break_timeout =  24*60*60;   //24*60*60 equals with 24 hours
const upload_path = "/public/uploads/";
const mainnet_http_RPC = "https://api.avax.network/ext/bc/C/rpc";
const testnet_http_RPC =  "https://data-seed-prebsc-1-s2.binance.org:8545/";  //"https://api.avax-test.network/ext/bc/C/rpc";
const UINISWAP_V2_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const ETHEREUM_MAINNET_RPC = "https://ethereum.publicnode.com";
const WETH_ADDRESS_ON_ETHEREUM = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const USDT_ADDRESS_ON_ETHEREUM = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const USD_OP_RERARD_PERCENTAGE = [
	{
		min: 3,
		max: 5,
		reward: 0.2
	},{
		min: 5,
		max: 10,
		reward: 0.9
	},{
		min: 10,
		max: 50,
		reward: 2
	},{
		min: 50,
		max: 100,
		reward: 4
	},{
		min: 100,
		max: 999999999999,
		reward: 4
	},
];



module.exports  =  { 
	WETH_ADDRESS_ON_ETHEREUM,
	USDT_ADDRESS_ON_ETHEREUM,
	ETHEREUM_MAINNET_RPC,
	UINISWAP_V2_ROUTER_ADDRESS,
	USD_OP_RERARD_PERCENTAGE,
	jwt_enc_key, 
	admin_address,
	signIn_break_timeout,
	upload_path,
	mainnet_http_RPC,
	testnet_http_RPC,
};
