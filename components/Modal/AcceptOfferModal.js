import { useEffect, useState } from 'react'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import { GAS_FEE_150, GAS_FEE_200, STORAGE_APPROVE_FEE, STORAGE_MINT_FEE } from 'config/constants'
import { IconX } from 'components/Icons'
import { sentryCaptureException } from 'lib/sentry'
import useStore from 'lib/store'
import { useWalletSelector } from 'components/Common/WalletSelector'
import Media from 'components/Common/Media'
import { parseImgUrl, prettyTruncate, prettyBalance } from 'utils/common'
import JSBI from 'jsbi'
import Link from 'next/link'
import IconInfoSecond from 'components/Icons/component/IconInfoSecond'
import cachios from 'cachios'
import { useToast } from 'hooks/useToast'

const AcceptOfferModal = ({ show, onClose, token, data }) => {
	const toast = useToast()
	const store = useStore()
	const { userBalance } = useStore((state) => ({
		userBalance: state.userBalance,
	}))
	const { viewFunction } = useWalletSelector()
	const { signAndSendTransaction } = useWalletSelector()

	const [txFee, setTxFee] = useState(null)
	const [isOwned, setIsOwned] = useState(null)
	const [storageFee, setStorageFee] = useState(STORAGE_APPROVE_FEE)
	const [isAcceptingOffer, setIsAcceptingOffer] = useState(false)

	useEffect(() => {
		getTxFee()
		fetchOwnership()
	}, [])

	const getTxFee = async () => {
		const txFeeContract = await viewFunction({
			methodName: 'get_transaction_fee',
			receiverId: process.env.MARKETPLACE_CONTRACT_ID,
		})
		setTxFee(txFeeContract)
	}

	const fetchOwnership = async () => {
		// check ownership by token
		if (token.token_id) {
			const ownershipResp = await cachios.get(`${process.env.V2_API_URL}/token`, {
				params: {
					token_id: token.token_id,
					contract_id: token.contract_id,
					owner_id: store.userProfile.accountId,
					__limit: 1,
				},
				ttl: 30,
			})
			if (ownershipResp.data.data.results[0]) {
				setIsOwned(`owner::token::${token.token_id}`)
				setStorageFee(STORAGE_APPROVE_FEE)
			}
		}
		// check ownership by series
		else {
			const ownershipResp = await cachios.get(`${process.env.V2_API_URL}/token`, {
				params: {
					token_series_id: token.token_series_id,
					contract_id: token.contract_id,
					owner_id: store.userProfile.accountId,
					__limit: 1,
				},
				ttl: 30,
			})

			const creatorId = token.metadata.creator_id || token.contract_id

			if (ownershipResp.data.data.results[0]) {
				setIsOwned(`owner::series::${ownershipResp.data.data.results[0].token_id}`)
				setStorageFee(STORAGE_APPROVE_FEE)
			} else if (store.userProfile.accountId === creatorId) {
				setIsOwned('creator::series')
				setStorageFee(
					JSBI.add(JSBI.BigInt(STORAGE_APPROVE_FEE), JSBI.BigInt(STORAGE_MINT_FEE)).toString()
				)
			}
		}
	}

	const acceptOffer = async () => {
		try {
			const params = {
				account_id: process.env.MARKETPLACE_CONTRACT_ID,
			}
			setIsAcceptingOffer(true)
			const [userType, offerType, tokenId] = isOwned.split('::')

			if (offerType === 'token') {
				params.token_id = tokenId
				params.msg = JSON.stringify({
					market_type: 'accept_offer',
					buyer_id: data.buyer_id,
					price: data.price,
				})
			} else {
				params.token_series_id = data.token_series_id
				params.msg = JSON.stringify({
					market_type: 'accept_offer_paras_series',
					buyer_id: data.buyer_id,
					price: data.price,
				})
				if (tokenId) {
					params.token_id = tokenId
				}
			}

			let res
			// accept offer

			if (userType === 'owner') {
				res = await signAndSendTransaction({
					receiverId: data.contract_id,
					actions: [
						{
							type: 'FunctionCall',
							params: {
								methodName: `nft_approve`,
								args: params,
								gas: GAS_FEE_150,
								deposit: STORAGE_APPROVE_FEE,
							},
						},
					],
				})
			}
			// batch tx -> mint & accept
			else {
				res = await signAndSendTransaction({
					receiverId: data.contract_id,
					actions: [
						{
							type: 'FunctionCall',
							params: {
								methodName: `nft_mint_and_approve`,
								args: params,
								gas: GAS_FEE_200,
								deposit: JSBI.add(
									JSBI.BigInt(STORAGE_APPROVE_FEE),
									JSBI.BigInt(STORAGE_MINT_FEE)
								).toString(),
							},
						},
					],
				})
			}

			if (res) {
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">{`Successfully accept offer`}</div>
					),
					type: 'success',
					duration: 2500,
				})
			}

			setIsAcceptingOffer(false)
		} catch (err) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						{err.message || 'Something went wrong'}
					</div>
				),
				type: 'error',
				duration: 2500,
			})
			sentryCaptureException(err)
		}
	}

	const calculatePriceDistribution = () => {
		if (JSBI.greaterThan(JSBI.BigInt(data.price), JSBI.BigInt(0))) {
			let fee
			if (txFee?.start_time && new Date() > new Date(txFee?.start_time * 1000)) {
				fee = JSBI.BigInt(txFee?.next_fee || 0)
			} else {
				fee = JSBI.BigInt(txFee?.current_fee || 0)
			}

			const calcRoyalty =
				Object.keys(token.royalty).length > 0
					? JSBI.divide(
							JSBI.multiply(
								JSBI.BigInt(data.price),
								JSBI.BigInt(
									Object.values(token.royalty).reduce((a, b) => {
										return parseInt(a) + parseInt(b)
									}, 0)
								)
							),
							JSBI.BigInt(10000)
					  )
					: JSBI.BigInt(0)

			const calcFee = JSBI.divide(JSBI.multiply(JSBI.BigInt(data.price), fee), JSBI.BigInt(10000))

			const cut = JSBI.add(calcRoyalty, calcFee)

			const calcReceive = JSBI.subtract(JSBI.BigInt(data.price), cut)

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

	if (!show) return null

	return (
		<>
			<Modal isShow={show} closeOnBgClick={false} closeOnEscape={false} close={onClose}>
				<div className="max-w-[504px] w-full bg-neutral-03 text-white rounded-lg mx-auto p-6">
					<div className="relative mb-5">
						<p className="text-sm font-bold text-center">Accept Offer</p>
						<button className="absolute bg-neutral-05 rounded-md right-0 -top-2" onClick={onClose}>
							<IconX className={'ml-1 mt-1'} />
						</button>
					</div>

					<div className="bg-neutral-02 rounded-lg p-4 mb-4">
						<p className="text-xs my-1 p-1">You are about to accept offer from {data.buyer_id}</p>
						<p className="text-sm font-bold p-1">Item</p>
						<div className="border-b border-b-neutral-05 mx-1"></div>

						<div>
							<div className="flex flex-row justify-between items-center p-2">
								<div className="inline-flex items-center w-16">
									<Media
										className="rounded-lg"
										url={parseImgUrl(token?.metadata.media, null, {
											width: `30`,
											useOriginal: process.env.APP_ENV === 'production' ? false : true,
											isMediaCdn: token?.isMediaCdn,
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
											href={`/collection/${token.metadata?.collection_id || token.contract_id}`}
										>
											<a className="text-sm font-bold truncate">
												{prettyTruncate(token.metadata?.collection || token.contract_id, 20)}
											</a>
										</Link>
									</div>
								</div>
							</div>
						</div>

						<div className="flex flex-row justify-between items-center p-2">
							<p className="text-sm text-neutral-10">Offer</p>
							<div className="inline-flex">
								<p className="font-bold text-sm text-neutral-10 truncate">
									{`${prettyBalance(data.price, 24, 4)} Ⓝ`}
								</p>

								{data.price && data.price !== '0' && store.nearUsdPrice !== 0 && (
									<div className="text-[10px] text-gray-400 truncate ml-2">
										(~$
										{prettyBalance(JSBI.BigInt(data.price) * store.nearUsdPrice, 24, 2)})
									</div>
								)}
							</div>
						</div>

						<div className="bg-neutral-04 border border-neutral-05 rounded-xl p-4 mb-4">
							<p className="text-sm font-bold">Accept Offer Summary</p>
							<div className="border-b border-b-neutral-05 mb-4"></div>

							<div className="flex flex-row justify-between items-center my-2">
								<p className="text-sm">Offer</p>
								<div className="inline-flex">
									<p className="text-sm text-neutral-10 truncate">
										{`${prettyBalance(data.price, 24, 4)} Ⓝ`}
									</p>
									{data.price && data.price !== '0' && store.nearUsdPrice !== 0 && (
										<div className="text-[10px] text-gray-400 truncate ml-2">
											(~${prettyBalance(data.price * store.nearUsdPrice, 24, 2)})
										</div>
									)}
								</div>
							</div>

							{token.royalty && Object.keys(token.royalty).length > 0 && (
								<div className="flex flex-row justify-between items-center my-2">
									<p className="text-sm">
										Royalty for Artist
										{Object.values(token.royalty).reduce((a, b) => parseInt(a) + parseInt(b), 0) /
											100}
									</p>
									<div className="inline-flex">
										<p className="text-sm text-neutral-10 truncate">
											{`${prettyBalance(data.price, 24, 4)} Ⓝ`}
										</p>
										{data.price && data.price !== '0' && store.nearUsdPrice !== 0 && (
											<div className="text-[10px] text-gray-400 truncate ml-2">
												(~${prettyBalance(data.price * store.nearUsdPrice, 24, 2)})
											</div>
										)}
									</div>
								</div>
							)}

							<div className="flex flex-row justify-between items-center my-2">
								<p className="text-sm">Fee</p>
								<div className="inline-flex">
									<p className="text-sm text-neutral-10 truncate">
										{calculatePriceDistribution().fee} Ⓝ
									</p>
									{calculatePriceDistribution().fee &&
										calculatePriceDistribution().fee !== '0' &&
										store.nearUsdPrice !== 0 && (
											<div className="text-[10px] text-gray-400 truncate ml-2">
												(~$
												{prettyBalance(calculatePriceDistribution().fee * store.nearUsdPrice, 0, 2)}
												)
											</div>
										)}
								</div>
							</div>

							<div className="flex flex-row justify-between items-center my-2">
								<p className="text-sm">You Will Get</p>
								<div className="inline-flex">
									<p className="text-sm text-neutral-10 truncate">
										{calculatePriceDistribution().receive} Ⓝ
									</p>
									{calculatePriceDistribution().receive &&
										calculatePriceDistribution().receive !== '0' &&
										store.nearUsdPrice !== 0 && (
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
								<p className="text-sm">Storage Fee</p>
								<div className="inline-flex">
									<p className="text-sm text-neutral-10 truncate">
										{formatNearAmount(storageFee)} Ⓝ
									</p>
									{storageFee && store.nearUsdPrice !== 0 && (
										<div className="text-[10px] text-gray-400 truncate ml-2">
											(~$
											{prettyBalance(formatNearAmount(storageFee) * store.nearUsdPrice, 0, 2)})
										</div>
									)}
								</div>
							</div>
							<div className="border-b border-b-neutral-05 mt-4 mb-2"></div>

							<div className="flex flex-row justify-between items-center">
								<p className="text-sm">Total Payment</p>
								<div className="inline-flex">
									<p className="bg-[#1300BA80] text-sm text-neutral-10 font-bold truncate p-1">
										{formatNearAmount(storageFee)} Ⓝ
									</p>
									{storageFee && store.nearUsdPrice !== 0 && (
										<div className="text-[10px] text-gray-400 truncate ml-2">
											(~$
											{prettyBalance(formatNearAmount(storageFee) * store.nearUsdPrice, 0, 2)})
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
								className={'text-sm w-full pl-14 text-center'}
								isDisabled={isAcceptingOffer}
								isLoading={isAcceptingOffer}
								onClick={acceptOffer}
							>
								Accept Offer
							</Button>
						</div>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default AcceptOfferModal
