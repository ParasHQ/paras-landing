import axios from 'axios'

const BASE_API = process.env.V2_API_URL

export const fetchTokenTest = async () => {
	try {
		const resp = await axios.get(`${BASE_API}/token`, {
			params: {
				contract_id: 'x.paras.near',
				token_series_id: '230098',
				token_id: '230098:1',
				lookup_token: true,
			},
		})
		const token = resp.data.data.results[0]

		const url = resp.config.url
		const contractId = token.contract_id
		const tokenId = token.token_id
		const ftTokenId = token.ft_token_id
		const price = token.price
		const hasPrice = token.has_price

		if (!token.has_price) return 'This token is not for sale.'

		return {
			url,
			contract_id: contractId,
			token_id: tokenId,
			ft_token_id: ftTokenId,
			price,
			has_price: hasPrice,
			result: token,
		}
	} catch (err) {
		// eslint-disable-next-line no-console
		console.log('error message: ', err)
		return []
	}
}
