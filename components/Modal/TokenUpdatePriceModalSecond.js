import { useEffect, useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import LoginModal from './LoginModal'
import { GAS_FEE, STORAGE_MINT_FEE } from 'config/constants'
import { IconX } from 'components/Icons'
import { sentryCaptureException } from 'lib/sentry'
import useStore from 'lib/store'
import { useWalletSelector } from 'components/Common/WalletSelector'
import Media from 'components/Common/Media'
import { parseImgUrl, prettyTruncate, prettyBalance } from 'utils/common'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import { trackRemoveListingTokenSeries, trackUpdateListingTokenSeries } from 'lib/ga'
import JSBI from 'jsbi'
import Link from 'next/link'
import IconInfoSecond from 'components/Icons/component/IconInfoSecond'
import { useForm } from 'react-hook-form'
import { InputText } from 'components/Common/form'

const TokenUpdatePriceModalSecond = ({ data, show, onClose, onSuccess }) => {
	const store = useStore()
	const { errors, register, handleSubmit } = useForm()
	const { viewFunction, signAndSendTransaction } = useWalletSelector()
	const { currentUser, userBalance, setTransactionRes } = useStore((state) => ({
		currentUser: state.currentUser,
		userBalance: state.userBalance,
		setTransactionRes: state.setTransactionRes,
	}))

	const [showLogin, setShowLogin] = useState(false)
	const [txFee, setTxFee] = useState(null)
	const [currentPrice, setCurrentPrice] = useState(0)
	const [isUpdating, setIsUpdating] = useState(false)

	useEffect(() => {
		if (show) {
			getTxFee()
		}
	}, [show])

	const getTxFee = async () => {
		const contractForCall =
			process.env.NFT_CONTRACT_ID === data.contract_id
				? data.contract_id
				: process.env.MARKETPLACE_CONTRACT_ID
		const txFeeContract = await viewFunction({
			methodName: 'get_transaction_fee',
			receiverId: contractForCall,
		})
		setTxFee(txFeeContract)
	}

	const calculatePriceDistribution = () => {
		if (
			currentPrice &&
			JSBI.greaterThan(JSBI.BigInt(parseNearAmount(currentPrice)), JSBI.BigInt(0))
		) {
			let fee
			if (txFee?.start_time && new Date() > new Date(txFee?.start_time * 1000)) {
				fee = JSBI.BigInt(txFee?.next_fee || 0)
			} else {
				fee = JSBI.BigInt(txFee?.current_fee || 0)
			}

			if (data.contract_id === 'comic.paras.near') {
				fee = JSBI.BigInt(500)
			}

			const calcRoyalty =
				Object.values(data.royalty).length > 0
					? JSBI.divide(
							JSBI.multiply(
								JSBI.BigInt(parseNearAmount(currentPrice)),
								JSBI.BigInt(
									Object.values(data.royalty).reduce((a, b) => {
										return parseInt(a) + parseInt(b)
									}, 0)
								)
							),
							JSBI.BigInt(10000)
					  )
					: JSBI.BigInt(0)

			const calcFee = JSBI.divide(
				JSBI.multiply(JSBI.BigInt(parseNearAmount(currentPrice)), fee),
				JSBI.BigInt(10000)
			)

			const cut = JSBI.add(calcRoyalty, calcFee)

			const calcReceive = JSBI.subtract(JSBI.BigInt(parseNearAmount(currentPrice)), cut)

			return {
				receive: formatNearAmount(calcReceive.toString()),
				royalty: formatNearAmount(calcRoyalty.toString()),
				fee: formatNearAmount(calcFee.toString()),
			}
		}
		return {
			receive: 0,
			royalty: 0,
			fee: 0,
		}
	}

	const onUpdatePrice = async () => {
		if (!currentUser) {
			return
		}
		setIsUpdating(true)
		const params = {
			token_series_id: data.token_series_id,
			price: parseNearAmount(currentPrice),
		}

		trackUpdateListingTokenSeries(data.token_series_id)

		try {
			const res = await signAndSendTransaction({
				receiverId: data.contract_id,
				actions: [
					{
						type: 'FunctionCall',
						params: {
							methodName: `nft_set_series_price`,
							args: params,
							gas: GAS_FEE,
							deposit: `1`,
						},
					},
				],
			})

			if (res) {
				onClose()
				setTransactionRes([res])
			}
			setIsUpdating(false)
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	return (
		<>
			<Modal isShow={show} closeOnBgClick={false} closeOnEscape={false} close={onClose}>
				<div className="max-w-[504px] w-full bg-neutral-03 text-white rounded-lg mx-auto p-6">
					<form onSubmit={handleSubmit(() => onUpdatePrice())}>
						<div className="relative mb-5">
							<p className="text-sm font-bold text-center">Update Price</p>
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
												setIsUpdatingwidth: `30`,
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
								<p className="text-sm text-neutral-10">Current Price</p>
								<div className="inline-flex">
									<p className="font-bold text-sm text-neutral-10 truncate">{`${prettyBalance(
										data.price ? formatNearAmount(data.price) : '0',
										0,
										4
									)} Ⓝ`}</p>
									{data?.price && store.nearUsdPrice !== 0 && (
										<div className="text-[10px] text-gray-400 truncate ml-2">
											($
											{prettyBalance(JSBI.BigInt(data.price) * store.nearUsdPrice, 24, 2)})
										</div>
									)}
								</div>
							</div>

							<div className="flex flex-row justify-between items-center p-2">
								<p className="text-sm text-neutral-10">New Price</p>
								<InputText
									name="priceAmount"
									step="any"
									type="number"
									onChange={(e) => setCurrentPrice(e.target.value)}
									ref={register({
										required: true,
										min: 0,
									})}
									className={`${
										errors.priceAmount && 'error'
									} w-2/3 bg-neutral-04 border border-neutral-06 hover:bg-neutral-05 focus:bg-neutral-04 focus:border-neutral-07 text-right text-xs`}
									placeholder="Place your new price here"
								/>
							</div>

							<div className="bg-neutral-04 border border-neutral-05 rounded-xl p-4 mb-4">
								<p className="text-sm font-bold">Update Price Summary</p>
								<div className="border-b border-b-neutral-05 mb-4"></div>

								<div className="flex flex-row justify-between items-center my-2">
									<p className="text-sm">New Price</p>
									<div className="inline-flex">
										<p className="text-sm text-neutral-10 truncate">{currentPrice} Ⓝ</p>
										{store.nearUsdPrice !== 0 && (
											<div className="text-[10px] text-gray-400 truncate ml-2">
												(~${currentPrice * store.nearUsdPrice})
											</div>
										)}
									</div>
								</div>
								<div className="flex flex-row justify-between items-center my-2">
									<p className="text-sm">Receive</p>
									<div className="inline-flex">
										<p className="text-sm text-neutral-10 truncate">
											{calculatePriceDistribution().receive} Ⓝ
										</p>
										{store.nearUsdPrice !== 0 && (
											<div className="text-[10px] text-gray-400 truncate ml-2">
												(~$
												{prettyBalance(
													calculatePriceDistribution().receive * store.nearUsdPrice,
													0,
													2
												)}
												)
											</div>
										)}
									</div>
								</div>
								<div className="flex flex-row justify-between items-center my-2">
									<p className="text-sm">Royalty</p>
									<div className="inline-flex">
										<p className="text-sm text-neutral-10 truncate">
											{calculatePriceDistribution().royalty} Ⓝ
										</p>
										{store.nearUsdPrice !== 0 && (
											<div className="text-[10px] text-gray-400 truncate ml-2">
												(~$
												{prettyBalance(
													calculatePriceDistribution().royalty * store.nearUsdPrice,
													0,
													2
												)}
												)
											</div>
										)}
									</div>
								</div>
								<div className="flex flex-row justify-between items-center my-2">
									<p className="text-sm">Locked Fee</p>
									<div className="inline-flex">
										<p className="text-sm text-neutral-10 truncate">
											{calculatePriceDistribution().fee} Ⓝ
										</p>
										{store.nearUsdPrice !== 0 && (
											<div className="text-[10px] text-gray-400 truncate ml-2">
												(~$
												{prettyBalance(calculatePriceDistribution().fee * store.nearUsdPrice, 0, 2)}
												)
											</div>
										)}
									</div>
								</div>
								<div className="border-b border-b-neutral-05 mt-4 mb-2"></div>

								<div className="flex flex-row justify-between items-center my-2">
									<p className="text-sm">Fee</p>
									<div className="inline-flex">
										<p className="text-sm text-neutral-10 truncate">
											{formatNearAmount(GAS_FEE)} Ⓝ
										</p>
										{store.nearUsdPrice !== 0 && (
											<div className="text-[10px] text-gray-400 truncate ml-2">
												(~$
												{prettyBalance(JSBI.BigInt(GAS_FEE) * store.nearUsdPrice, 24, 4)})
											</div>
										)}
									</div>
								</div>
								<div className="border-b border-b-neutral-05 mt-4 mb-2"></div>

								<div className="flex flex-row justify-between items-center">
									<p className="text-sm">Total Payment</p>
									<div className="inline-flex">
										<p className="bg-[#1300BA80] text-sm text-neutral-10 font-bold truncate p-1">
											{formatNearAmount(GAS_FEE)} Ⓝ
										</p>
										{store.nearUsdPrice !== 0 && (
											<div className="text-[10px] text-gray-400 truncate ml-2">
												(~$
												{prettyBalance(JSBI.BigInt(GAS_FEE) * store.nearUsdPrice, 24, 4)})
											</div>
										)}
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

						<div className="flex flex-row justify-between items-center mb-6">
							<p className="text-sm">Payment Method</p>
							<div className="inline-flex items-center">
								<p className="text-sm text-white">Near Wallet</p>
								<IconInfoSecond size={18} color={'#F9F9F9'} className={'ml-2 mb-1'} />
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
									className={'text-sm w-full pl-[20px] text-center'}
									isDisabled={isUpdating}
									isLoading={isUpdating}
									type="submit"
								>
									Complete Update Price
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

export default TokenUpdatePriceModalSecond
