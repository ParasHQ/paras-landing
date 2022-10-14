import { useState } from 'react'
import { GAS_FEE, STORAGE_ADD_MARKET_FEE, STORAGE_APPROVE_FEE } from 'config/constants'
import { useToast } from 'hooks/useToast'
import Modal from 'components/Common/Modal'
import { IconX } from 'components/Icons'
import { useForm } from 'react-hook-form'
import ParasRequest from 'lib/ParasRequest'
import { useWalletSelector } from 'components/Common/WalletSelector'
import useStore from 'lib/store'
import JSBI from 'jsbi'
import { sentryCaptureException } from 'lib/sentry'
import { parseImgUrl } from 'utils/common'
import Link from 'next/link'
import Card from 'components/Card/Card'
import { InputText } from 'components/Common/form'
import Button from 'components/Common/Button'
import { checkTokenUrl } from 'utils/common'
import TradingCard from 'components/Trading/TradingCard'

const TokenTradeModal = ({ data, show, onClose }) => {
	const { currentUser, setTransactionRes } = useStore((state) => ({
		currentUser: state.currentUser,
		userBalance: state.userBalance,
		setTransactionRes: state.setTransactionRes,
	}))
	const { signAndSendTransaction, signAndSendTransactions, viewFunction } = useWalletSelector()
	const { errors, register, handleSubmit, watch } = useForm()
	const toast = useToast()

	const [urlToken, setUrlToken] = useState(null)
	const [tradedToken, setTradedToken] = useState([])
	const [isAdding, setIsAdding] = useState(false)

	const onTradeNFT = async () => {
		setIsAdding(true)

		const tokenType = data.token_id ? 'token' : 'tokenSeries'
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
				res = await signAndSendTransaction({
					receiverId: tradedToken[0].split('::')[0],
					actions: [
						{
							type: 'FunctionCall',
							params: {
								methodName: `nft_approve`,
								args: params,
								gas: GAS_FEE,
								deposit: STORAGE_APPROVE_FEE,
							},
						},
					],
				})
				if (res) {
					setIsAdding(false)
					onClose()
					setTransactionRes([res])
				}
			} else {
				const txs = []
				txs.push({
					receiverId: process.env.MARKETPLACE_CONTRACT_ID,
					actions: [
						{
							type: 'FunctionCall',
							params: {
								methodName: 'storage_deposit',
								contractId: process.env.MARKETPLACE_CONTRACT_ID,
								args: depositParams,
								attachedDeposit: STORAGE_ADD_MARKET_FEE,
								gas: GAS_FEE,
							},
						},
					],
				})
				txs.push({
					receiverId: tradedToken[0].split('::')[0],
					actions: [
						{
							type: 'FunctionCall',
							params: {
								methodName: 'nft_approve',
								args: params,
								attachedDeposit: STORAGE_APPROVE_FEE,
								gas: GAS_FEE,
							},
						},
					],
				})
				const res = await signAndSendTransactions({ transactions: txs })
				if (res.error && res.error.includes('reject')) {
					setIsAdding(false)
				} else if (res.response) {
					setIsAdding(false)
					onClose()
					setTransactionRes(res?.response)
				}
			}
		} catch (err) {
			setIsAdding(false)
			sentryCaptureException(err)
		}
	}

	const onAddTradedToken = async () => {
		let _urlToken = urlToken.replace(
			/^((https?|ftp|smtp):\/\/)?(www\.)?(paras\.id|localhost:\d+|marketplace-v2-testnet\.paras\.id|testnet\.paras\.id)\/token\//,
			''
		)
		if (urlToken === '') {
			toast.show({
				text: <div className="font-semibold text-center text-sm">Please fill your Token URL</div>,
				type: 'error',
				duration: 2500,
			})
			setIsAdding(false)
			return
		}

		if (urlToken && !checkTokenUrl(urlToken)) {
			toast.show({
				text: <div className="font-semibold text-center text-sm">Please enter valid Token URL</div>,
				type: 'error',
				duration: 2500,
			})
			setIsAdding(false)
			return
		}
		const [contract_id, token_id] = _urlToken.split('/')
		const _owner = await getOwnerTradedToken(contract_id, token_id)
		if (_owner?.length === 0) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">You are not the owner of the card</div>
				),
				type: 'error',
				duration: 2500,
			})
			setIsAdding(false)
			return
		}
		if (!_owner[0].is_creator) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						The creator of this card is not verified
					</div>
				),
				type: 'error',
				duration: 2500,
			})
			setIsAdding(false)
			return
		}
		setTradedToken([_urlToken])
	}

	const getOwnerTradedToken = async (contractId, tokenId) => {
		const params = {
			contract_id: contractId.split('::')[0],
			token_id: tokenId ?? contractId.split('::')[1],
			owner_id: currentUser,
		}

		const resp = await ParasRequest.get(`${process.env.V2_API_URL}/token`, {
			params: params,
			ttl: 60,
		})
		return resp.data.data.results
	}

	const hasStorageBalance = async () => {
		try {
			const currentStorage = await viewFunction({
				methodName: `storage_balance_of`,
				args: {
					account_id: currentUser,
				},
				receiverId: process.env.MARKETPLACE_CONTRACT_ID,
			})

			const supplyPerOwner = await viewFunction({
				methodName: `get_supply_by_owner_id`,
				args: {
					account_id: currentUser,
				},
				receiverId: process.env.MARKETPLACE_CONTRACT_ID,
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

	return (
		<>
			<Modal isShow={show} closeOnBgClick={false} closeOnEscape={false} close={onClose}>
				<div className="max-w-[504px] w-full bg-neutral-03 text-white rounded-lg mx-auto p-6">
					<div className="relative mb-5">
						<p className="text-sm font-bold text-center">Offer NFT by Trade</p>
						<button className="absolute bg-neutral-05 rounded-md right-0 -top-2" onClick={onClose}>
							<IconX className={'ml-1 mt-1'} />
						</button>
					</div>

					<div className="bg-neutral-02 rounded-lg p-4 mb-4">
						<p className="text-sm font-bold p-1">Add your NFT for Trade</p>
						<div className="border-b border-b-neutral-05 mx-1 mb-4"></div>

						{tradedToken.length > 0 ? (
							<div className="w-48 h-auto text-white mb-4 mx-auto">
								<TradingCard
									contract_token_id={tradedToken[0]}
									setTradedToken={setTradedToken}
									isNewDesign={true}
								/>
							</div>
						) : (
							<div className="flex justify-center items-center w-48 h-72 bg-neutral-04 border border-neutral-05 rounded-lg mx-auto p-1">
								<p className="text-neutral-07 text-xs my-auto">Your card will appear here</p>
							</div>
						)}

						<div>
							<p className="text-neutral-10 text-sm mb-2">NFT Link</p>
							<div className="flex flex-row justify-between">
								<InputText
									name="tradedToken"
									step="any"
									ref={register({
										required: true,
									})}
									className={`${
										errors.tradedToken && 'error'
									} w-full text-sm bg-neutral-04 border border-neutral-06 hover:bg-neutral-05 focus:bg-neutral-04 focus:border-neutral-07 mb-2`}
									placeholder="i.e.: https://paras.id/token/x.paras.near:1|"
									onChange={(e) => {
										if (e.target.value.includes('%'))
											setUrlToken(decodeURIComponent(e.target.value))
										else setUrlToken(e.target.value)
									}}
								/>
								<Button
									variant="second"
									size="sm"
									className={'ml-2 mb-2 py-1 text-xs text-neutral-10'}
									onClick={onAddTradedToken}
								>
									Check
								</Button>
							</div>
							<Link href={`/${currentUser}`}>
								<a className="w-full">
									<p className="text-neutral-10 text-sm underline text-right">
										Check to My Profile
									</p>
								</a>
							</Link>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-x-4">
						<div>
							<Button variant="second" className={'text-sm'} onClick={onClose}>
								Cancel
							</Button>
						</div>
						<div>
							<Button
								variant="primary"
								className={'text-sm w-full pl-12 text-center'}
								type="submit"
								isDisabled={isAdding}
								isLoading={isAdding}
								onClick={onTradeNFT}
							>
								Complete Trade
							</Button>
						</div>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default TokenTradeModal
