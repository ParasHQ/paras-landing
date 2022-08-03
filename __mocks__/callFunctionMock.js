import { GAS_FEE, GAS_FEE_150 } from 'config/constants'
import { fetchTokenTest } from './serviceMock'

const CONTRACT_ID = process.env.MARKETPLACE_CONTRACT_ID

export const onBuyToken = async () => {
	const params = await fetchTokenTest()

	return {
		contractId: CONTRACT_ID,
		methodName: `buy`,
		args: {
			token_id: params.token_id,
			nft_contract_id: params.contract_id,
			ft_token_id: params.ft_token_id,
			price: params.price,
		},
		gas: GAS_FEE_150,
		deposit: params.price,
	}
}

export const onPlaceBid = async (value) => {
	const params = await fetchTokenTest()

	return {
		receiverId: CONTRACT_ID,
		methodName: 'add_offer',
		args: {
			nft_contract_id: params.contract_id,
			token_id: params.token_id,
			ft_token_id: params.ft_token_id,
			price: value,
		},
		deposit: value,
		gas: GAS_FEE,
	}
}
