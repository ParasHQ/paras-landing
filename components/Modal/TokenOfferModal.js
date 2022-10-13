import { useEffect, useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import LoginModal from './LoginModal'
import { GAS_FEE, STORAGE_ADD_MARKET_FEE } from 'config/constants'
import { IconX } from 'components/Icons'
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
import { trackClickPlaceOffer, trackOfferToken, trackOfferTokenImpression } from 'lib/ga'
import { InputText } from 'components/Common/form'
import cachios from 'cachios'
import TokenTradeModal from './TokenTradeModal'

const TokenOfferModal = ({ show, onClose, data, offerAmount, onSuccess, tokenType = `token` }) => {
	const store = useStore()
	const { errors, register, handleSubmit, watch, setValue } = useForm({
		defaultValues: {
			offerAmount,
		},
	})
	const { signAndSendTransaction, viewFunction } = useWalletSelector()
	const { currentUser, userBalance, setTransactionRes } = useStore((state) => ({
		currentUser: state.currentUser,
		userBalance: state.userBalance,
		setTransactionRes: state.setTransactionRes,
	}))

	const [showTradeModal, setShowTradeModal] = useState(false)
	const [isOffering, setIsOffering] = useState(false)
	const [showLogin, setShowLogin] = useState(false)
	const [highestOffer, setHighestOffer] = useState(null)
	const [currentOffer, setCurrentOffer] = useState(0)

	useEffect(() => {
		if (show) {
			fetchHighestOffer()
			trackOfferTokenImpression(data.token_id)
		}
	}, [show])

	const fetchHighestOffer = async () => {
		try {
			const res = await cachios.get(`${process.env.V2_API_URL}/offers`, {
				params: {
					contract_id: data.contract_id,
					token_id: data.token_id,
					token_series_id: data.token_series_id,
					__sort: 'price::-1',
				},
			})

			const newOffer = res.data.data.results
			if (newOffer && newOffer.length > 0) {
				const highest = newOffer[newOffer.length - 1].price
				setHighestOffer(highest)
			}
		} catch (err) {
			sentryCaptureException(err)
		}
	}

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

	const onPlaceOffer = async ({ offerAmount }) => {
		setIsOffering(true)
		const hasDepositStorage = await hasStorageBalance()

		trackOfferToken(data.token_id)
		trackClickPlaceOffer(data.token_id)

		try {
			const depositParams = { receiver_id: currentUser }

			const params = {
				nft_contract_id: data.contract_id,
				...(data.token_id
					? { token_id: data.token_id }
					: { token_series_id: data.token_series_id }),
				ft_token_id: 'near',
				price: parseNearAmount(offerAmount),
			}

			let res
			if (hasDepositStorage) {
				res = await signAndSendTransaction({
					receiverId: process.env.MARKETPLACE_CONTRACT_ID,
					actions: [
						{
							type: 'FunctionCall',
							params: {
								methodName: 'add_offer',
								args: params,
								deposit: parseNearAmount(offerAmount),
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
								methodName: 'add_offer',
								args: params,
								deposit: parseNearAmount(offerAmount),
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
			setIsOffering(false)
		} catch (err) {
			sentryCaptureException(err)
			setIsOffering(false)
		}
	}

	return (
		<>
			<Modal isShow={show} closeOnBgClick={false} closeOnEscape={false} close={onClose}>
				<div className="max-w-[504px] w-full bg-neutral-03 text-white rounded-lg mx-auto p-6">
					<form onSubmit={handleSubmit((bidQuantity) => onPlaceOffer(bidQuantity))}>
						<div className="relative mb-5">
							<p className="text-sm font-bold text-center">Make Offer</p>
							<button
								className="absolute bg-neutral-05 rounded-md right-0 -top-2"
								onClick={onClose}
							>
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
								<p className="text-sm text-neutral-10">Top Offer</p>
								<div className="inline-flex">
									{highestOffer && highestOffer.length > 0 ? (
										<>
											<p className="font-bold text-sm text-neutral-10 truncate">{`${prettyBalance(
												highestOffer,
												0,
												4
											)} Ⓝ`}</p>

											{highestOffer && store.nearUsdPrice !== 0 && (
												<div className="text-[10px] text-gray-400 truncate ml-2">
													(~$
													{prettyBalance(JSBI.BigInt(highestOffer) * store.nearUsdPrice, 24, 2)})
												</div>
											)}
										</>
									) : (
										<p className="font-bold text-sm text-neutral-10 truncate">None</p>
									)}
								</div>
							</div>

							<div className="flex flex-row justify-between items-center p-2">
								<p className="text-sm text-neutral-10">Your Price Offer</p>
								<InputText
									name="offerAmount"
									type="number"
									step="any"
									onChange={(e) => setCurrentOffer(e.target.value)}
									ref={register({
										required: true,
										min: 0.01,
										max: parseFloat(userBalance.available / 10 ** 24),
									})}
									className={`${
										errors.offerAmount && 'error'
									} w-2/3 bg-neutral-04 border border-neutral-06 hover:bg-neutral-05 focus:bg-neutral-04 focus:border-neutral-07 text-right`}
									placeholder="Place your Offer"
								/>
							</div>

							<div className="bg-neutral-04 border border-neutral-05 rounded-xl p-4 mb-4">
								<p className="text-sm font-bold">Offer Summary</p>
								<div className="border-b border-b-neutral-05 mb-4"></div>

								<div className="flex flex-row justify-between items-center my-2">
									<p className="text-sm">Your Offer</p>
									<div className="inline-flex">
										<p className="text-sm text-neutral-10 truncate">{currentOffer} Ⓝ</p>
										<div className="text-[10px] text-gray-400 truncate ml-2">
											(~${prettyBalance(currentOffer * store.nearUsdPrice, 24, 2)})
										</div>
									</div>
								</div>
								<div className="border-b border-b-neutral-05 mt-4 mb-2"></div>

								<div className="flex flex-row justify-between items-center">
									<p className="text-sm">Total Payment</p>
									<div className="inline-flex">
										<p className="bg-[#1300BA80] text-sm text-neutral-10 font-bold truncate p-1">
											{currentOffer} Ⓝ
										</p>
										{store.nearUsdPrice !== 0 && (
											<div className="text-[10px] text-gray-400 truncate ml-2">
												(~${currentOffer * store.nearUsdPrice})
											</div>
										)}
									</div>
								</div>
							</div>
						</div>

						<div className="mt-2 text-sm text-red-500 text-center">
							{errors.offerAmount?.type === 'required' && `Offer amount is required`}
							{errors.offerAmount?.type === 'min' && `Minimum 0.01 Ⓝ`}
							{errors.offerAmount?.type === 'max' && `You don't have enough balance`}
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

						<div className="flex flex-row justify-between items-center">
							<p className="text-sm">Payment Method</p>
							<div className="inline-flex items-center">
								<p className="text-sm text-white">Near Wallet</p>
								<IconInfoSecond size={18} color={'#F9F9F9'} className={'ml-2 mb-1'} />
							</div>
						</div>

						<div className="w-full flex flex-row ">
							<div className="w-full border-b border-neutral-05 mb-2 mr-2"></div>
							<p className="text-sm font-medium">or</p>
							<div className="w-full border-b border-neutral-05 mb-2 ml-2"></div>
						</div>

						<button
							className="w-full flex flex-row justify-center items-center mb-6"
							onClick={() => setShowTradeModal(true)}
						>
							<p className="text-4xl">+</p>
							<p className="text-sm underline">Add Your NFT for Trade</p>
						</button>

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
									isDisabled={isOffering}
									isLoading={isOffering}
									type="submit"
								>
									Complete Offer
								</Button>
							</div>
						</div>
					</form>
				</div>
			</Modal>

			<TokenTradeModal show={showTradeModal} data={data} onClose={() => setShowTradeModal(false)} />
			<LoginModal onClose={() => setShowLogin(false)} show={showLogin} />
		</>
	)
}

export default TokenOfferModal
