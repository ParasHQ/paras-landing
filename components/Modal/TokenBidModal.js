import Modal from 'components/Common/Modal'
import { useState } from 'react'
import Button from 'components/Common/Button'
import LoginModal from './LoginModal'
import { GAS_FEE, STORAGE_ADD_MARKET_FEE } from 'config/constants'
import { IconX } from 'components/Icons'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import useStore from 'lib/store'
import { useWalletSelector } from 'components/Common/WalletSelector'
import Media from 'components/Common/Media'
import { parseImgUrl, prettyTruncate, prettyBalance } from 'utils/common'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import JSBI from 'jsbi'
import Link from 'next/link'
import IconInfoSecond from 'components/Icons/component/IconInfoSecond'
import { useForm } from 'react-hook-form'
import { InputText } from 'components/Common/form'

const TokenBidModal = ({ show, data, onClose, onSuccess }) => {
	const store = useStore()
	const { errors, register, handleSubmit, watch, setValue } = useForm()
	const { signAndSendTransaction, viewFunction } = useWalletSelector()
	const { currentUser, userBalance, setTransactionRes } = useStore((state) => ({
		currentUser: state.currentUser,
		userBalance: state.userBalance,
		setTransactionRes: state.setTransactionRes,
	}))

	const [showLogin, setShowLogin] = useState(false)
	const [isBidding, setIsBidding] = useState(false)
	const [currentBid, setCurrentBid] = useState(0)

	const hasStorageBalance = async () => {
		try {
			const currentStorage = await viewFunction({
				methodName: 'storage_balance_of',
				receiverId: process.env.MARKETPLACE_CONTRACT_ID,
				args: { account_id: currentUser },
			})

			const supplyPerOwner = await viewFunction({
				methodName: 'get_supply_by_owner_id',
				receiverId: process.env.MARKETPLACE_CONTRACT_ID,
				args: { account_id: currentUser },
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

	const onPlaceBid = async ({ bidAmount }) => {
		setIsBidding(true)
		const hasDepositStorage = await hasStorageBalance()

		try {
			const depositParams = { receiver_id: currentUser }

			const params = {
				nft_contract_id: data.contract_id,
				...(data.token_id
					? { token_id: data.token_id }
					: { token_series_id: data.token_series_id }),
				ft_token_id: 'near',
				price: parseNearAmount(bidAmount),
			}

			let res
			if (hasDepositStorage) {
				res = await signAndSendTransaction({
					receiverId: process.env.MARKETPLACE_CONTRACT_ID,
					actions: [
						{
							type: 'FunctionCall',
							params: {
								methodName: 'add_bid',
								args: params,
								deposit: parseNearAmount(bidAmount),
								gas: GAS_FEE,
							},
						},
					],
				})
			} else {
				res = await signAndSendTransaction({
					receiverId: process.env.MARKETPLACE_CONTRACT_ID,
					actions: [
						{
							type: 'FunctionCall',
							params: {
								methodName: 'storage_deposit',
								args: depositParams,
								deposit: STORAGE_ADD_MARKET_FEE,
								gas: GAS_FEE,
							},
						},
						{
							type: 'FunctionCall',
							params: {
								methodName: 'add_bid',
								args: params,
								deposit: parseNearAmount(bidAmount),
								gas: GAS_FEE,
							},
						},
					],
				})
			}
			if (res) {
				onClose()
				setTransactionRes([res])
				onSuccess && onSuccess()
			}
			setIsBidding(false)
		} catch (err) {
			sentryCaptureException(err)
			setIsBidding(false)
		}
	}

	const checkNextPriceBid = (type) => {
		if (data?.bidder_list && data.bidder_list?.length !== 0) {
			const currentBid = JSBI.BigInt(
				data.bidder_list && data.bidder_list?.length !== 0 ? isCurrentBid('amount') : data?.price
			)
			const multiplebid = JSBI.multiply(JSBI.divide(currentBid, JSBI.BigInt(100)), JSBI.BigInt(5))
			const nextBid = JSBI.add(currentBid, multiplebid).toString()
			const nextBidToNear = (nextBid / 10 ** 24).toFixed(2)
			const nextBidToUSD = parseNearAmount(nextBidToNear.toString())
			if (type === 'near') {
				return nextBidToNear
			} else if (type === 'usd') {
				return nextBidToUSD.toString()
			}
		} else {
			if (type === 'near') {
				return data.price ? formatNearAmount(data.price) : '0'
			} else if (type === 'usd') {
				const price = data?.price || data?.lowest_price || '0'
				return price.toString()
			}
		}
	}

	const isCurrentBid = (type) => {
		let list = []
		data?.bidder_list?.map((item) => {
			if (type === 'bidder') list.push(item.bidder)
			else if (type === 'time') list.push(item.issued_at)
			else if (type === 'amount') list.push(item.amount)
		})

		return list[list.length - 1]
	}

	if (!data.is_auction) return null

	return (
		<>
			<Modal isShow={show} closeOnBgClick={false} closeOnEscape={false} close={onClose}>
				<div className="max-w-[504px] w-full bg-neutral-03 text-white rounded-lg mx-auto p-6">
					<form onSubmit={handleSubmit((bidAmount) => onPlaceBid(bidAmount))}>
						<div className="relative mb-5">
							<p className="text-sm font-bold text-center">Place Bid in Auction</p>
							<button className="absolute bg-neutral-05 rounded-md right-0 -top-2">
								<IconX className={'ml-1 mt-1'} />
							</button>
						</div>

						<div className="bg-neutral-02 rounded-lg p-4 mb-4">
							<p className="text-sm font-bold p-1">Item</p>
							<div className="border-b border-b-neutral-05 mx-1"></div>

							<div>
								<div className="flex flex-row justify-between items-center p-2">
									<div className="inline-flex items-center w-16">
										<Media
											className="rounded-lg"
											url={parseImgUrl(data?.metadata.media, null, {
												width: `30`,
												useOriginal: process.env.APP_ENV === 'production' ? false : true,
												isMediaCdn: data?.isMediaCdn,
											})}
											videoControls={false}
											videoLoop={true}
											videoMuted={true}
											autoPlay={false}
											playVideoButton={false}
										/>
										<div className="flex flex-col justify-between items-stretch ml-2">
											<p className="text-xs font-thin mb-2">Collection</p>
											<Link
												href={`/collection/${data.metadata?.collection_id || data.contract_id}`}
											>
												<a className="text-sm font-bold truncate">
													{prettyTruncate(data.metadata?.collection || data.contract_id, 20)}
												</a>
											</Link>
										</div>
									</div>
								</div>
							</div>

							<div className="flex flex-row justify-between items-center p-2">
								<p className="text-sm text-neutral-10">Highest Bid</p>
								<div className="inline-flex">
									<p className="font-bold text-sm text-neutral-10 truncate">{`${
										data.amount
											? prettyBalance(formatNearAmount(data.amount?.$numberDecimal), 0, 4) + ' Ⓝ'
											: 'None'
									} `}</p>
									{data.amount && store.nearUsdPrice !== 0 && (
										<div className="text-[10px] text-gray-400 truncate ml-2">
											(~$
											{prettyBalance(
												JSBI.BigInt(data.amount?.$numberDecimal) * store.nearUsdPrice,
												24,
												2
											)}
											)
										</div>
									)}
								</div>
							</div>

							<div className="flex flex-row justify-between items-center p-2">
								<p className="text-sm text-neutral-10">Minimum Bid</p>
								<div className="inline-flex">
									<p className="font-bold text-sm text-neutral-10 truncate">
										{checkNextPriceBid('near')} Ⓝ
									</p>
									{(data?.price || data?.amount) && store.nearUsdPrice !== 0 && (
										<div className="text-[10px] text-gray-400 truncate ml-2">
											(~$
											{prettyBalance(
												JSBI.BigInt(checkNextPriceBid('usd')) * store.nearUsdPrice,
												24,
												2
											)}
											)
										</div>
									)}
								</div>
							</div>

							<div className="flex flex-row justify-between items-center p-2">
								<p className="text-sm text-neutral-10">Your Bid</p>
								<InputText
									name="bidAmount"
									step="any"
									type="number"
									onChange={(e) => setCurrentBid(e.target.value)}
									ref={register({
										required: true,
										min: checkNextPriceBid('near'),
										max: parseFloat(userBalance.available / 10 ** 24),
									})}
									className={`${
										errors.bidAmount && 'error'
									} w-2/3 bg-neutral-04 border border-neutral-06 hover:bg-neutral-05 focus:bg-neutral-04 focus:border-neutral-05 text-right`}
									placeholder="Place your Bid"
								/>
							</div>
							<div className="text-xs text-right text-red-500 mb-2 mr-2">
								{errors.bidAmount?.type === 'required' && `Bid amount is required`}
								{errors.bidAmount?.type === 'min' && `Minimum ${checkNextPriceBid('near')} Ⓝ`}
								{errors.bidAmount?.type === 'max' && `You don't have enough balance`}
							</div>

							<div className="bg-neutral-04 border border-neutral-05 rounded-xl p-4 mb-4">
								<p className="text-sm font-bold">Bid Summary</p>
								<div className="border-b border-b-neutral-05 mb-4"></div>

								<div className="flex flex-row justify-between items-center my-2">
									<p className="text-sm">Your Bid</p>
									<div className="inline-flex">
										<p className="text-sm text-neutral-10 truncate">
											{prettyBalance(currentBid, 0, 2)} Ⓝ
										</p>
										<div className="text-[10px] text-gray-400 truncate ml-2">
											(~${prettyBalance(currentBid * store.nearUsdPrice, 0, 1)})
										</div>
									</div>
								</div>
								<div className="border-b border-b-neutral-05 mt-4 mb-2"></div>

								<div className="flex flex-row justify-between items-center">
									<p className="text-sm">Total Payment</p>
									<div className="inline-flex">
										<p className="bg-[#1300BA80] text-sm text-neutral-10 font-bold truncate p-1">{`${prettyBalance(
											currentBid + formatNearAmount(STORAGE_ADD_MARKET_FEE),
											0,
											4
										)} Ⓝ`}</p>
										<div className="text-[10px] text-gray-400 truncate ml-2">
											(~$
											{prettyBalance(currentBid * store.nearUsdPrice, 0, 2)})
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="flex flex-row justify-between items-center mb-2">
							<p className="text-sm">Your Balance</p>
							<div className="inline-flex">
								<p className="text-sm text-neutral-10 font-bold truncate p-1">{`${prettyBalance(
									userBalance.available,
									24,
									4
								)} Ⓝ`}</p>
								{userBalance.available && store.nearUsdPrice !== 0 && (
									<div className="text-[10px] text-gray-400 truncate ml-2">
										(~$
										{prettyBalance(JSBI.BigInt(userBalance.available) * store.nearUsdPrice, 24, 2)})
									</div>
								)}
							</div>
						</div>

						<div className="flex flex-row justify-between items-center mb-8">
							<p className="text-sm">Payment Method</p>
							<div className="inline-flex items-center">
								<p className="text-sm text-white">Near Wallet</p>
								<IconInfoSecond size={18} color={'#F9F9F9'} className={'ml-2 mb-1'} />
							</div>
						</div>

						<div className="grid grid-cols-2 gap-x-4">
							<div>
								<Button variant="second" className={'text-sm p-0'} onClick={onClose}>
									Cancel
								</Button>
							</div>
							<div>
								<Button
									variant="primary"
									className={'text-sm w-full pl-14 text-center'}
									isDisabled={isBidding}
									isLoading={isBidding}
									type="submit"
								>
									Complete Bid
								</Button>
							</div>
						</div>
					</form>
				</div>
			</Modal>
			<LoginModal onClose={() => setShowLogin(false)} show={showLogin} />
		</>
	)
}

export default TokenBidModal
