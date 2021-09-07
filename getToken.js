const axios = require('axios')

const fetchToken = async (tokenUrl) => {
	try {
		const tokenUrlSplitted = tokenUrl.split('/').slice(3).join('/')

		if (tokenUrlSplitted) {
			const resp = await axios.get(
				`https://api-v2-mainnet.paras.id/${tokenUrlSplitted}`
			)

			const data = resp.data

			// return either series metadata or nft
			if (data.owner_id) {
				// return as NFT
				// {
				//   "_id": "6136ec9925373a3135688f3b",
				//   "contract_id": "x.paras.near",
				//   "token_id": "10035:3",
				//   "owner_id": "riqi.near",
				//   "token_series_id": "10035",
				//   "edition_id": "3",
				//   "metadata": {
				//     "title": "Vitamin A #3",
				//     "description": "Good old vitamin A from carrots. The name was inspired from kakarot/goku. The legend is true.",
				//     "media": "https://ipfs.fleek.co/ipfs/bafybeieglgwdcddp2lu5yx4sb3krkelzfxrzj4s77ey7knplosfe7hwpjy",
				//     "media_hash": null,
				//     "copies": 100,
				//     "issued_at": "1630989460026156750",
				//     "expires_at": null,
				//     "starts_at": null,
				//     "updated_at": null,
				//     "extra": null,
				//     "reference": "https://ipfs.fleek.co/ipfs/bafybeievzue22dha5z7ne4l42z2vgh7lsnhw7w3jscrpobg7e6qmdks3qu",
				//     "reference_hash": null,
				//     "collection": "Humble Funkle",
				//     "collection_id": "humble-funkle-by-irfinear",
				//     "creator_id": "irfi.near",
				//     "blurhash": "UFO0b+8J7hCP0JD4HsWR47x_xwtk1t+b#9xV"
				//   },
				//   "royalty": {
				//     "irfi.near": "100"
				//   },
				//   "price": null
				// }
			} else {
				// return as series
				// {
				//   "_id": "6136c8af356454f15cb3c3b2",
				//   "contract_id": "x.paras.near",
				//   "token_series_id": "10035",
				//   "creator_id": "irfi.near",
				//   "price": {
				//     "$numberDecimal": "500000000000000000000000"
				//   },
				//   "royalty": {
				//     "irfi.near": 100
				//   },
				//   "metadata": {
				//     "title": "Vitamin A",
				//     "description": "Good old vitamin A from carrots. The name was inspired from kakarot/goku. The legend is true.",
				//     "media": "https://ipfs.fleek.co/ipfs/bafybeieglgwdcddp2lu5yx4sb3krkelzfxrzj4s77ey7knplosfe7hwpjy",
				//     "media_hash": null,
				//     "copies": 100,
				//     "issued_at": null,
				//     "expires_at": null,
				//     "starts_at": null,
				//     "updated_at": null,
				//     "extra": null,
				//     "reference": "https://ipfs.fleek.co/ipfs/bafybeievzue22dha5z7ne4l42z2vgh7lsnhw7w3jscrpobg7e6qmdks3qu",
				//     "reference_hash": null,
				//     "collection": "Humble Funkle",
				//     "collection_id": "humble-funkle-by-irfinear",
				//     "creator_id": "irfi.near",
				//     "blurhash": "UFO0b+8J7hCP0JD4HsWR47x_xwtk1t+b#9xV"
				//   },
				//   "in_circulation": 3,
				//   "updated_at": 1630989460026,
				//   "lowest_price": {
				//     "$numberDecimal": "500000000000000000000000"
				//   },
				//   "total_mint": 3
				// }
			}

			console.log(data)
		} else {
			throw new Error('Invalid Token URL')
		}
	} catch (err) {
		console.log(err)
	}
}

const tokenUrl = `https://v2-testflight.paras.id/token/x.paras.near::10035/10035:3`

fetchToken(tokenUrl)
