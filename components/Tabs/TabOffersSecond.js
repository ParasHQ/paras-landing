import { useToast } from 'hooks/useToast'
import { flagColor, flagText } from 'constants/flag'
import { trackClickOffers } from 'lib/ga'
import {
	ACCEPT_GAS_FEE,
	GAS_FEE,
	GAS_FEE_150,
	GAS_FEE_200,
	STORAGE_APPROVE_FEE,
	STORAGE_MINT_FEE,
} from 'config/constants'
import { sentryCaptureException } from 'lib/sentry'
import { useState, useEffect } from 'react'
import { useWalletSelector } from 'components/Common/WalletSelector'
import { parseImgUrl, prettyBalance, prettyTruncate, ModalEnum, timeAgo } from 'utils/common'
import Media from 'components/Common/Media'
import Link from 'next/link'
import JSBI from 'jsbi'
import cachios from 'cachios'
import useStore from 'lib/store'
import { useIntl } from 'hooks/useIntl'
import ProfileImageBadge from 'components/Common/ProfileImageBadge'
import Button from 'components/Common/Button'
import IconEmptyOffer from 'components/Icons/component/IconEmptyOffer'
import AcceptOfferModal from 'components/Modal/AcceptOfferModal'
import InfiniteScroll from 'react-infinite-scroll-component'
import IconLoaderSecond from 'components/Icons/component/IconLoaderSecond'
import RejectOfferModal from 'components/Modal/RejectOfferModal'

const FETCH_TOKENS_LIMIT = 12

const TabOffersSecond = ({ localToken }) => {
	const store = useStore()
	const toast = useToast()
	const { localeLn } = useIntl()
	const { signAndSendTransaction } = useWalletSelector()

	const [page, setPage] = useState(0)
	const [offers, setOffers] = useState([])
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)
	const [isOwned, setIsOwned] = useState(false)
	const [activeOffer, setActiveOffer] = useState(null)
	const [showModal, setShowModal] = useState(null)

	useEffect(() => {
		if (localToken.token_series_id) {
			fetchOffers(true)
		}
	}, [localToken])

	useEffect(() => {
		if (offers.length > 0 && store.userProfile.accountId) {
			fetchOwnership()
		}
	}, [offers, store.userProfile])

	const onDismissModal = () => {
		setShowModal(null)
	}

	const acceptOffer = async () => {
		try {
			const params = {
				account_id: process.env.MARKETPLACE_CONTRACT_ID,
			}
			trackClickOffers(localToken.token_id || localToken.token_series_id)
			const [userType, offerType, tokenId] = isOwned.split('::')

			if (offerType === 'token') {
				params.token_id = tokenId
				params.msg = JSON.stringify({
					market_type: 'accept_offer',
					buyer_id: activeOffer.buyer_id,
					price: activeOffer.price,
				})
			} else {
				params.token_series_id = activeOffer.token_series_id
				params.msg = JSON.stringify({
					market_type: 'accept_offer_paras_series',
					buyer_id: activeOffer.buyer_id,
					price: activeOffer.price,
				})
				if (tokenId) {
					params.token_id = tokenId
				}
			}

			let res
			// accept offer
			if (userType === 'owner') {
				res = await signAndSendTransaction({
					receiverId: activeOffer.contract_id,
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
					receiverId: activeOffer.contract_id,
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
				onDismissModal()
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">{`Successfully accept offer`}</div>
					),
					type: 'success',
					duration: 2500,
				})
				setTimeout(() => fetchOffers(true), 2500)
			}
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

	const acceptTrade = async (offerData) => {
		const [, tradeType, tokenId] = isOwned.split('::')
		const params = {
			account_id: process.env.MARKETPLACE_CONTRACT_ID,
		}
		params.token_id = tokenId
		params.msg = JSON.stringify({
			market_type: tradeType === 'token' ? 'accept_trade' : 'accept_trade_paras_series',
			buyer_id: offerData.buyer_id,
			buyer_nft_contract_id: offerData.buyer_nft_contract_id,
			buyer_token_id: offerData.buyer_token_id,
		})

		try {
			const res = await signAndSendTransaction({
				receiverId: offerData.contract_id,
				actions: [
					{
						type: 'FunctionCall',
						params: {
							methodName: `nft_approve`,
							args: params,
							gas: ACCEPT_GAS_FEE,
							deposit: STORAGE_APPROVE_FEE,
						},
					},
				],
			})
			if (res) {
				store.setTransactionRes([res])
			}
			setTimeout(fetchOffers, 2500)
		} catch (err) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						{err.message || localeLn('SomethingWentWrong')}
					</div>
				),
				type: 'error',
				duration: 2500,
			})
		}
	}

	const fetchOffers = async (fromStart = false) => {
		setIsFetching(true)

		const _hasMore = fromStart ? true : hasMore
		const _page = fromStart ? 0 : page
		const _offers = fromStart ? [] : offers

		if (!_hasMore || isFetching) {
			return
		}

		const params = {
			__skip: _page * FETCH_TOKENS_LIMIT,
			__limit: FETCH_TOKENS_LIMIT,
		}

		if (localToken.token_id) {
			params.token_id = localToken.token_id
			params.contract_id = localToken.contract_id
		} else {
			params.token_series_id = localToken.token_series_id
			params.contract_id = localToken.contract_id
		}

		const resp = await cachios.get(`${process.env.V2_API_URL}/offers`, {
			params: params,
			ttl: 30,
			force: fromStart,
		})

		const newData = resp.data.data

		const newOffers = [...(_offers || []), ...newData.results]
		const hasMoretoFetch = newData.results.length < FETCH_TOKENS_LIMIT ? false : true

		setOffers(newOffers)
		setPage(_page + 1)
		setHasMore(hasMoretoFetch)

		setIsFetching(false)
	}

	const fetchOwnership = async () => {
		setIsFetching(true)

		// check ownership by token
		if (localToken.token_id) {
			const ownershipResp = await cachios.get(`${process.env.V2_API_URL}/token`, {
				params: {
					token_id: localToken.token_id,
					contract_id: localToken.contract_id,
					owner_id: store.userProfile.accountId,
					__limit: 1,
				},
				ttl: 30,
			})
			if (ownershipResp.data.data.results[0]) {
				setIsOwned(`owner::token::${localToken.token_id}`)
			}
		}
		// check ownership by series
		else {
			const ownershipResp = await cachios.get(`${process.env.V2_API_URL}/token`, {
				params: {
					token_series_id: localToken.token_series_id,
					contract_id: localToken.contract_id,
					owner_id: store.userProfile.accountId,
					__limit: 1,
				},
				ttl: 30,
			})

			const creatorId = localToken.metadata.creator_id || localToken.contract_id

			if (ownershipResp.data.data.results[0]) {
				setIsOwned(`owner::series::${ownershipResp.data.data.results[0].token_id}`)
			} else if (store.userProfile.accountId === creatorId) {
				setIsOwned('creator::series')
			}
		}

		setIsFetching(false)
	}

	if (!isFetching && offers.length <= 0) {
		return <IconEmptyOffer size={150} className="mx-auto my-16" />
	}

	return (
		<div className="min-h-[326px] bg-neutral-01 border border-neutral-05 rounded-lg p-1">
			<InfiniteScroll
				dataLength={offers.length}
				next={fetchOffers}
				hasMore={hasMore}
				loader={<IconLoaderSecond size={20} />}
			>
				<div className="grid grid-cols-3 py-2 px-4 mt-1">
					<p className="text-xs text-neutral-10">Offered by</p>
					<p className="text-xs text-neutral-10">Price</p>
					<p className="text-xs text-neutral-10">Offer Date</p>
					<div className="col-span-4 border-b border-b-neutral-03 my-1"></div>

					{offers.map((offer) => (
						<>
							<Offer
								key={offer._id}
								offer={offer}
								token={localToken}
								fetchOffer={() => fetchOffers(true)}
								hideButton={!isOwned}
								acceptOffer={acceptOffer}
								acceptTrade={acceptTrade}
								setActiveOffer={setActiveOffer}
								onShowModal={() => {
									setShowModal(ModalEnum.ACCEPT_OFFER)
								}}
								onShowRejectModal={() => {
									setShowModal(ModalEnum.REJECT_OFFER)
								}}
								localToken={localToken}
							/>
						</>
					))}
				</div>
			</InfiniteScroll>

			<AcceptOfferModal
				show={showModal === ModalEnum.ACCEPT_OFFER}
				onClose={() => {
					setActiveOffer(null)
					setShowModal(null)
				}}
				token={localToken}
				data={activeOffer}
			/>

			<RejectOfferModal
				show={showModal === ModalEnum.REJECT_OFFER}
				onClose={() => {
					setActiveOffer(null)
					setShowModal(null)
				}}
				token={localToken}
				data={activeOffer}
			/>
		</div>
	)
}

const Offer = ({
	offer,
	localToken,
	fetchOffer,
	onShowModal,
	onShowRejectModal,
	setActiveOffer,
	hideButton,
	acceptTrade,
}) => {
	const toast = useToast()
	const [profile, setProfile] = useState({})
	const { currentUser } = useStore((state) => ({
		currentUser: state.currentUser,
	}))
	const [isEnableForAccept, setIsEnableForAccept] = useState(true)
	const [tradedTokenData, setTradedTokenData] = useState([])
	const [creatorTradeToken, setCreatorTradeToken] = useState(null)
	const isNFTTraded = offer?.type && offer?.type === 'trade'
	const { localeLn } = useIntl()
	const { signAndSendTransaction } = useWalletSelector()

	useEffect(() => {
		if (offer.buyer_id) {
			fetchBuyerProfile()
		}
	}, [offer.buyer_id])

	useEffect(() => {
		if (offer.type === 'trade') {
			fetchTradeToken()
		}
	}, [])

	useEffect(() => {
		if (!localToken?.token_id && offer.type === 'trade') {
			const checkIsEnabledForAccept = async () => {
				const resp = await cachios.get(`${process.env.V2_API_URL}/token`, {
					params: {
						token_series_id: localToken.token_series_id,
						contract_id: localToken.contract_id,
						owner_id: currentUser,
					},
					ttl: 60,
				})
				resp.data.data.results.length === 0
					? setIsEnableForAccept(false)
					: setIsEnableForAccept(true)
			}
			checkIsEnabledForAccept()
		}
	}, [])

	const fetchBuyerProfile = async () => {
		try {
			const resp = await cachios.get(`${process.env.V2_API_URL}/profiles`, {
				params: {
					accountId: offer.buyer_id,
				},
				ttl: 60,
			})
			const newData = resp.data.data.results[0] || {}
			setProfile(newData)
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	const fetchTradeToken = async () => {
		const params = {
			token_id: offer.buyer_token_id,
			contract_id: offer.buyer_nft_contract_id,
			__limit: 1,
		}
		const resp = await cachios.get(`${process.env.V2_API_URL}/token`, {
			params: params,
			ttl: 30,
		})
		const profileRes = await cachios.get(`${process.env.V2_API_URL}/profiles`, {
			params: {
				accountId: resp.data.data.results[0].metadata.creator_id,
			},
			ttl: 600,
		})
		setCreatorTradeToken(profileRes.data.data.results[0])
		setTradedTokenData(resp.data.data.results[0])
	}

	const deleteOffer = async () => {
		const params = isNFTTraded
			? {
					nft_contract_id: offer.contract_id,
					...(offer.token_id
						? { token_id: offer.token_id }
						: { token_series_id: offer.token_series_id }),
					buyer_nft_contract_id: offer.buyer_nft_contract_id,
					buyer_token_id: offer.buyer_token_id,
			  }
			: {
					nft_contract_id: offer.contract_id,
					...(offer.token_id
						? { token_id: offer.token_id }
						: { token_series_id: offer.token_series_id }),
			  }

		try {
			if (isNFTTraded) {
				const res = await signAndSendTransaction({
					receiverId: process.env.MARKETPLACE_CONTRACT_ID,
					actions: [
						{
							type: 'FunctionCall',
							params: {
								methodName: `delete_trade`,
								args: params,
								gas: GAS_FEE,
								deposit: '1',
							},
						},
					],
				})
				if (res) {
					toast.show({
						text: (
							<div className="font-semibold text-center text-sm">{`Successfully delete trade`}</div>
						),
						type: 'success',
						duration: 2500,
					})
					setTimeout(fetchOffer, 2500)
				}
			} else {
				const res = await signAndSendTransaction({
					receiverId: process.env.MARKETPLACE_CONTRACT_ID,
					actions: [
						{
							type: 'FunctionCall',
							params: {
								methodName: `delete_offer`,
								args: params,
								gas: GAS_FEE,
								deposit: '1',
							},
						},
					],
				})
				if (res) {
					toast.show({
						text: (
							<div className="font-semibold text-center text-sm">{`Successfully delete offer`}</div>
						),
						type: 'success',
						duration: 2500,
					})
					setTimeout(fetchOffer, 2500)
				}
			}
		} catch (error) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						{error.message || localeLn('SomethingWentWrong')}
					</div>
				),
				type: 'error',
				duration: 2500,
			})
			sentryCaptureException(error)
		}
	}

	const onClickNftTradeLink = () => {
		return `/token/${tradedTokenData.contract_id}::${encodeURIComponent(
			tradedTokenData.token_series_id
		)}${tradedTokenData.token_id && `/${encodeURIComponent(tradedTokenData.token_id)}`}`
	}

	return (
		<>
			<div className="inline-flex items-center w-full py-2">
				<ProfileImageBadge
					imgUrl={profile.imgUrl}
					level={profile?.level}
					className="w-8 h-8 rounded-lg"
				/>
				<div className="flex flex-col justify-between items-stretch ml-2">
					<p className="text-xs font-bold mb-2 text-neutral-10">
						<Link href={`/${offer.buyer_id}`}>
							<a className="hover:underline">{prettyTruncate(offer.buyer_id, 10, 'address')}</a>
						</Link>
					</p>
					<Link
						href={`/token/${offer.contract_id}::${encodeURIComponent(offer.token_series_id)}/${
							offer.token_id && encodeURIComponent(offer.token_id)
						}`}
					>
						<a className="text-xs font-thin text-neutral-10 truncate">
							#{prettyTruncate(offer.token_series_id || offer.token_id, 5)}
						</a>
					</Link>
				</div>
			</div>
			{offer.type === 'trade' ? (
				<div className="flex flex-col py-3">
					<Link href={onClickNftTradeLink()}>
						<a>
							<div className="flex flex-col items-center w-24 p-2 cursor-pointer">
								<Media
									className="rounded-lg"
									url={parseImgUrl(tradedTokenData?.metadata?.media, null, {
										width: `50`,
										useOriginal: process.env.APP_ENV === 'production' ? false : true,
										isMediaCdn: tradedTokenData?.isMediaCdn,
									})}
									videoControls={false}
									videoLoop={true}
									videoMuted={true}
									autoPlay={false}
									playVideoButton={false}
								/>
								{offer.type === 'trade' &&
									offer.buyer_id !== currentUser &&
									isEnableForAccept &&
									creatorTradeToken?.flag &&
									(creatorTradeToken?.flag === 'banned' ||
										creatorTradeToken.flag === 'rugpull' ||
										creatorTradeToken.flag === 'hacked' ||
										creatorTradeToken.flag === 'scam') && (
										<div className="mt-4">
											<div className={`flex items-center justify-center w-full`}>
												<p
													className={`text-white text-xs p-1 font-bold w-full mx-auto px-4 text-center rounded-md ${
														flagColor[creatorTradeToken?.flag]
													}`}
												>
													{localeLn(flagText[creatorTradeToken?.flag])}
												</p>
											</div>
										</div>
									)}
							</div>
						</a>
					</Link>
				</div>
			) : (
				<div className="flex flex-col py-3">
					{offer.price ? (
						<p className="text-md text-left text-neutral-10 font-bold">
							{prettyBalance(offer.price, 24, 2)} Ⓝ
						</p>
					) : (
						<div className="line-through text-red-600">
							<p className="text-lg font-bold text-gray-100">{localeLn('SALE')}</p>
						</div>
					)}
				</div>
			)}
			<div className="inline-flex py-4">
				<p className="text-xs text-neutral-10">{timeAgo.format(offer.issued_at)}</p>
				{currentUser === offer.buyer_id && (
					<Button variant={'second'} size={'xs'} onClick={deleteOffer}>
						<p className="text-xs text-neutral-10 p-1">Delete</p>
					</Button>
				)}
				{!hideButton && offer.buyer_id !== currentUser && isEnableForAccept && (
					<div className="inline-flex gap-x-2">
						{offer.token_id && (
							<button
								className="text-xs text-neutral-10 underline"
								onClick={() => {
									setActiveOffer(offer)
									onShowRejectModal()
								}}
							>
								Reject
							</button>
						)}
						<Button
							variant="second"
							size={'xs'}
							onClick={() => {
								isNFTTraded ? acceptTrade(offer) : setActiveOffer(offer)
								onShowModal()
							}}
							hideButton={hideButton}
							className="ml-2"
						>
							<p className="text-xs p-1">Accept</p>
						</Button>
					</div>
				)}
			</div>
			<div className="col-span-4 border-b border-b-neutral-04 mb-2"></div>
		</>
	)
}

export default TabOffersSecond
