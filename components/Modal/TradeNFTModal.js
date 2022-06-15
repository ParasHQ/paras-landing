import { useIntl } from 'hooks/useIntl'
import Modal from 'components/Common/Modal'
import Button from 'components/Common/Button'
import { sentryCaptureException } from 'lib/sentry'
import { IconX } from 'components/Icons'
import { useState } from 'react'
import AddTradeNFTUrlModal from './AddTradeNFTUrlModal'
import TradingCard from 'components/Trading/TradingCard'
import useStore from 'lib/store'
import { GAS_FEE, STORAGE_ADD_MARKET_FEE, STORAGE_APPROVE_FEE } from 'config/constants'
import JSBI from 'jsbi'
import { useEffect } from 'react'
import WalletHelper from 'lib/WalletHelper'

const TradeNFTModal = ({ data, show, onClose, tokenType, fromUpdate = false }) => {
	const [showAddURLModal, setShowAddURLModal] = useState(false)
	const [tradedToken, setTradedToken] = useState([])
	const [isTrading, setIsTrading] = useState(false)
	const { currentUser, setTransactionRes } = useStore((state) => ({
		currentUser: state.currentUser,
		userBalance: state.userBalance,
		setTransactionRes: state.setTransactionRes,
	}))

	const { localeLn } = useIntl()
	const [hasTraded] = useState(fromUpdate ? true : false)

	useEffect(() => {
		if (fromUpdate) {
			setTradedToken([
				`${data.contract_id}::${data.buyer_token_id?.split(':')[0]}/${data.buyer_token_id}`,
			])
		}
	}, [show])

	const hasStorageBalance = async () => {
		try {
			const currentStorage = await WalletHelper.viewFunction({
				methodName: `storage_balance_of`,
				args: {
					account_id: currentUser,
				},
				contractId: process.env.MARKETPLACE_CONTRACT_ID,
			})

			const supplyPerOwner = await WalletHelper.viewFunction({
				methodName: `get_supply_by_owner_id`,
				args: {
					account_id: currentUser,
				},
				contractId: process.env.MARKETPLACE_CONTRACT_ID,
			})

			const usedStorage = JSBI.multiply(
				JSBI.BigInt(parseInt(supplyPerOwner) + 1),
				JSBI.BigInt(STORAGE_ADD_MARKET_FEE)
			)

			if (JSBI.greaterThanOrEqual(JSBI.BigInt(currentStorage), usedStorage)) {
				return true
			}
			return false
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	const onTradeNFT = async () => {
		setIsTrading(true)
		const hasDepositStorage = await hasStorageBalance()

		try {
			const depositParams = {
				receiver_id: currentUser,
			}

			const params = {
				account_id: process.env.MARKETPLACE_CONTRACT_ID,
			}

			if (tokenType === 'token') {
				params.token_id = tradedToken[0].split('/')[1]
				params.msg = JSON.stringify({
					market_type: 'add_trade',
					seller_nft_contract_id: data.contract_id,
					seller_token_id: data.token_id,
				})
			} else {
				params.token_id = tradedToken[0].split('/')[1]
				params.msg = JSON.stringify({
					market_type: 'add_trade',
					seller_nft_contract_id: data.contract_id,
					seller_token_series_id: data.token_series_id,
				})
			}
			let res
			if (hasDepositStorage) {
				res = await WalletHelper.signAndSendTransaction({
					receiverId: tradedToken[0].split('::')[0],
					actions: [
						{
							methodName: `nft_approve`,
							args: params,
							gas: GAS_FEE,
							deposit: STORAGE_APPROVE_FEE,
						},
					],
				})
				if (res.error && res.error.includes('reject')) {
					setIsTrading(false)
				} else if (res.response) {
					setIsTrading(false)
					onClose()
					setTransactionRes(res?.response)
				}
			} else {
				const txs = []
				txs.push({
					receiverId: process.env.MARKETPLACE_CONTRACT_ID,
					functionCalls: [
						{
							methodName: 'storage_deposit',
							contractId: process.env.MARKETPLACE_CONTRACT_ID,
							args: depositParams,
							attachedDeposit: STORAGE_ADD_MARKET_FEE,
							gas: GAS_FEE,
						},
					],
				})
				txs.push({
					receiverId: tradedToken[0].split('::')[0],
					functionCalls: [
						{
							methodName: 'nft_approve',
							contractId: tradedToken[0].split('::')[0],
							args: params,
							attachedDeposit: STORAGE_APPROVE_FEE,
							gas: GAS_FEE,
						},
					],
				})
				const res = await WalletHelper.multipleCallFunction(txs)
				if (res.error && res.error.includes('reject')) {
					setIsTrading(false)
				} else if (res.response) {
					setIsTrading(false)
					onClose()
					setTransactionRes(res?.response)
				}
			}
		} catch (err) {
			setIsTrading(false)
			sentryCaptureException(err)
		}
	}

	const onShowAddURLModal = () => {
		setShowAddURLModal(!showAddURLModal)
	}

	return (
		<>
			<Modal isShow={show} close={onClose} closeOnBgClick={false} closeOnEscape={false}>
				<div className="max-w-sm w-full p-4 bg-gray-800  m-auto rounded-md relative">
					<div className="absolute right-0 top-0 pr-4 pt-4">
						<div
							className="cursor-pointer"
							onClick={() => {
								onClose()
								setTradedToken([])
							}}
						>
							<IconX />
						</div>
					</div>
					<div>
						<h1 className="text-2xl font-bold text-white tracking-tight">
							{hasTraded ? 'Update Offer NFT via Trade' : 'Offer NFT via Trade'}
						</h1>
						<div className="mt-4 ">
							<label className="block mb-2 text-white text-center">{localeLn('AddNFTTrade')}</label>
							<div className="w-full flex justify-center items-center">
								{tradedToken.map((tok, idx) => {
									return (
										<div key={`${tok}-${idx}`} className="flex w-6/12 justify-center">
											<TradingCard contract_token_id={tok} setTradedToken={setTradedToken} />
										</div>
									)
								})}
								{tradedToken.length < 1 && (
									<div
										className="flex w-6/12 h-64 items-center justify-center py-20 rounded bg-white bg-opacity-10 text-white cursor-pointer"
										onClick={onShowAddURLModal}
									>
										Add +
									</div>
								)}
							</div>
						</div>
						<Button
							onClick={onTradeNFT}
							className="mt-10"
							isFullWidth
							size="md"
							isLoading={isTrading}
						>
							{hasTraded ? 'Update Trade' : `Trade`}
						</Button>
					</div>
				</div>
			</Modal>
			{showAddURLModal && (
				<AddTradeNFTUrlModal
					setIsShow={setShowAddURLModal}
					onClose={() => {
						setShowAddURLModal(!showAddURLModal)
					}}
					setTradedToken={setTradedToken}
				/>
			)}
		</>
	)
}

export default TradeNFTModal
