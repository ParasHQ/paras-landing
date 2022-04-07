import cachios from 'cachios'
import LinkToProfile from 'components/Common/LinkToProfile'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useIntl } from 'hooks/useIntl'
import useStore from 'lib/store'
import Button from 'components/Common/Button'
import { sentryCaptureException } from 'lib/sentry'
import {
	GAS_FEE,
	ACCEPT_GAS_FEE,
	GAS_FEE_150,
	GAS_FEE_200,
	STORAGE_APPROVE_FEE,
	STORAGE_MINT_FEE,
} from 'config/constants'
import JSBI from 'jsbi'
import { parseImgUrl, prettyBalance, prettyTruncate, timeAgo } from 'utils/common'
import Avatar from 'components/Common/Avatar'
import AcceptBidModal from 'components/Modal/AcceptBidModal'
import WalletHelper from 'lib/WalletHelper'
import { useToast } from 'hooks/useToast'
import Media from 'components/Common/Media'
import { useRouter } from 'next/router'
import { flagColor, flagText } from 'constants/flag'
import BannedConfirmModal from 'components/Modal/BannedConfirmModal'
import Link from 'next/link'
import useToken from 'hooks/useToken'

const FETCH_TOKENS_LIMIT = 12

const Offer = ({
	data,
	onAcceptOffer,
	hideButton,
	fetchOffer,
	localToken,
	setBannedConfirmData,
	setBuyerTokenData,
	acceptTrade,
}) => {
	const router = useRouter()
	const [profile, setProfile] = useState({})
	const { currentUser } = useStore((state) => ({
		currentUser: state.currentUser,
	}))
	const [tradedTokenData, setTradedTokenData] = useState([])
	const [isEnableForAccept, setIsEnableForAccept] = useState(true)
	const [creatorTradeToken, setCreatorTradeToken] = useState(null)
	const toast = useToast()
	const isNFTTraded = data?.type && data?.type === 'trade'
	const { nearUsdPrice } = useStore()
	const { localeLn } = useIntl()

	useEffect(() => {
		if (data.buyer_id) {
			fetchBuyerProfile()
		}
	}, [data.buyer_id])

	useEffect(() => {
		if (data.type === 'trade') {
			fetchTradeToken()
		}
	}, [])

	useEffect(async () => {
		if (!localToken.token_id && data.type === 'trade') {
			const resp = await cachios.get(`${process.env.V2_API_URL}/token`, {
				params: {
					token_series_id: localToken.token_series_id,
					contract_id: localToken.contract_id,
					owner_id: currentUser,
				},
				ttl: 60,
			})
			resp.data.data.results.length === 0 ? setIsEnableForAccept(false) : setIsEnableForAccept(true)
		}
	}, [])

	const fetchBuyerProfile = async () => {
		try {
			const resp = await cachios.get(`${process.env.V2_API_URL}/profiles`, {
				params: {
					accountId: data.buyer_id,
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
			token_id: data.buyer_token_id,
			contract_id: data.buyer_nft_contract_id,
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
					nft_contract_id: data.contract_id,
					...(data.token_id
						? { token_id: data.token_id }
						: { token_series_id: data.token_series_id }),
					buyer_nft_contract_id: data.buyer_nft_contract_id,
					buyer_token_id: data.buyer_token_id,
			  }
			: {
					nft_contract_id: data.contract_id,
					...(data.token_id
						? { token_id: data.token_id }
						: { token_series_id: data.token_series_id }),
			  }

		try {
			if (isNFTTraded) {
				const res = await WalletHelper.callFunction({
					contractId: process.env.MARKETPLACE_CONTRACT_ID,
					methodName: `delete_trade`,
					args: params,
					gas: GAS_FEE,
					deposit: '1',
				})
				if (res.error && res.error.includes('reject')) {
					return
				} else {
					if (res.response.error) {
						toast.show({
							text: (
								<div className="font-semibold text-center text-sm">
									{res.response.error.kind.ExecutionError}
								</div>
							),
							type: 'error',
							duration: 2500,
						})
					} else {
						toast.show({
							text: (
								<div className="font-semibold text-center text-sm">{`Successfully delete trade`}</div>
							),
							type: 'success',
							duration: 2500,
						})
						setTimeout(fetchOffer, 2500)
					}
				}
			} else {
				const res = await WalletHelper.callFunction({
					contractId: process.env.MARKETPLACE_CONTRACT_ID,
					methodName: `delete_offer`,
					args: params,
					gas: GAS_FEE,
					deposit: '1',
				})
				if (res?.response.error) {
					toast.show({
						text: (
							<div className="font-semibold text-center text-sm">
								{res?.response.error.kind.ExecutionError}
							</div>
						),
						type: 'error',
						duration: 2500,
					})
				} else if (res) {
					toast.show({
						text: (
							<div className="font-semibold text-center text-sm">{`Successfully delete offer`}</div>
						),
						type: 'success',
						duration: 2500,
					})
				}
			}
		} catch (error) {
			sentryCaptureException(error)
		}
	}

	const onClickNftTrade = () => {
		router.push(
			`/token/${tradedTokenData.contract_id}::${tradedTokenData.token_series_id}${
				tradedTokenData.token_id && `/${tradedTokenData.token_id}`
			}`
		)
	}

	return (
		<div className="bg-gray-800 mt-3 p-3 rounded-md shadow-md">
			<div className="flex items-center">
				<div className="w-2/3 flex items-center">
					<div className="hidden md:block">
						<Avatar size="md" src={parseImgUrl(profile.imgUrl)} />
					</div>
					<div className="pl-2">
						<div className="overflow-hidden truncate">
							<LinkToProfile accountId={data.buyer_id} />
						</div>
					</div>
				</div>

				<div className="w-1/3 text-right">
					<p className="text-sm text-gray-300">{timeAgo.format(new Date(data.issued_at))}</p>
				</div>
			</div>
			<div className={`flex ${isNFTTraded ? `items-end` : `items-center`} justify-between mt-2`}>
				{data.type === 'trade' ? (
					<div>
						<p className="mb-2">Offer NFT for trade</p>
						<div className="flex items-center">
							<div className="z-20 max-h-40 w-24 cursor-pointer border-4 border-gray-700 rounded-lg">
								<a
									onClick={(e) => {
										e.preventDefault()
										onClickNftTrade()
									}}
								>
									<Media
										className="rounded-lg overflow-hidden"
										url={parseImgUrl(tradedTokenData?.metadata?.media, null, {
											width: `600`,
											useOriginal: process.env.APP_ENV === 'production' ? false : true,
											isMediaCdn: true,
										})}
										seeDetails={true}
									/>
								</a>
							</div>
						</div>
					</div>
				) : (
					<div className="flex items-baseline">
						<p>Offer {formatNearAmount(data.price)} Ⓝ</p>
						{nearUsdPrice !== 0 && (
							<p className="text-xs text-gray-300 truncate ml-1">
								~ ${prettyBalance(JSBI.BigInt(data.price) * nearUsdPrice, 24, 2)}
							</p>
						)}
					</div>
				)}
				{!hideButton && data.buyer_id !== currentUser && isEnableForAccept && (
					<div>
						<Button
							size="sm"
							className="w-full"
							onClick={() => {
								isNFTTraded
									? creatorTradeToken.flag &&
									  (creatorTradeToken.flag === 'banned' ||
											creatorTradeToken.flag === 'rugpull' ||
											creatorTradeToken.flag === 'hacked')
										? (setBannedConfirmData({
												isShowBannedConfirm: true,
												creatorId: creatorTradeToken,
										  }),
										  setBuyerTokenData(data))
										: (acceptTrade(), setBuyerTokenData(data))
									: onAcceptOffer(data)
							}}
							hideButton={hideButton}
						>
							Accept
						</Button>
					</div>
				)}
				{data.buyer_id === currentUser && (
					<div>
						<Button size="sm" className="w-full" onClick={deleteOffer} hideButton={hideButton}>
							Delete
						</Button>
					</div>
				)}
			</div>
			{data.type === 'trade' &&
				data.buyer_id !== currentUser &&
				isEnableForAccept &&
				creatorTradeToken?.flag &&
				(creatorTradeToken?.flag === 'banned' ||
					creatorTradeToken.flag === 'rugpull' ||
					creatorTradeToken.flag === 'hacked') && (
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
	)
}

const TabAuction = ({ localToken }) => {
	const store = useStore()
	const [offers, setOffers] = useState([])
	const [page, setPage] = useState(0)
	const [hasMore, setHasMore] = useState(true)
	const [isFetching, setIsFetching] = useState(false)
	const [isOwned, setIsOwned] = useState(false)
	const [showModal, setShowModal] = useState(null)
	const [activeOffer, setActiveOffer] = useState(null)
	const [storageFee, setStorageFee] = useState(STORAGE_APPROVE_FEE)
	const [isAcceptingOffer, setIsAcceptingOffer] = useState(false)
	const [bannedConfirmData, setBannedConfirmData] = useState({
		isShowBannedConfirm: false,
		creatorId: null,
	})
	const [buyerTokenData, setBuyerTokenData] = useState(null)
	const [days, setDays] = useState()
	const [hours, setHours] = useState()
	const [mins, setMins] = useState()
	const [secs, setSecs] = useState()
	const toast = useToast()
	const { localeLn } = useIntl()

	useEffect(() => {
		if (localToken.token_series_id) {
			fetchOffers()
		}
	}, [localToken])

	useEffect(() => {
		if (offers.length > 0 && store.userProfile.accountId) {
			fetchOwnership()
		}
	}, [offers, store.userProfile])

	const onAcceptOffer = (offer) => {
		setActiveOffer(offer)
		setShowModal('acceptOffer')
	}

	const onDismissModal = () => {
		setShowModal(null)
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
				res = await WalletHelper.callFunction({
					contractId: activeOffer.contract_id,
					methodName: `nft_approve`,
					args: params,
					gas: GAS_FEE_150,
					deposit: STORAGE_APPROVE_FEE,
				})
			}
			// batch tx -> mint & accept
			else {
				res = await WalletHelper.callFunction({
					contractId: activeOffer.contract_id,
					methodName: `nft_mint_and_approve`,
					args: params,
					gas: GAS_FEE_200,
					deposit: JSBI.add(
						JSBI.BigInt(STORAGE_APPROVE_FEE),
						JSBI.BigInt(STORAGE_MINT_FEE)
					).toString(),
				})
			}

			if (res?.response.error) {
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">
							{res?.response.error.kind.ExecutionError}
						</div>
					),
					type: 'error',
					duration: 2500,
				})
			} else if (res) {
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

			setIsAcceptingOffer(false)
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	const acceptTrade = async () => {
		const [, tradeType, tokenId] = isOwned.split('::')
		const params = {
			account_id: process.env.MARKETPLACE_CONTRACT_ID,
		}
		params.token_id = tokenId
		params.msg = JSON.stringify({
			market_type: tradeType === 'token' ? 'accept_trade' : 'accept_trade_paras_series',
			buyer_id: buyerTokenData.buyer_id,
			buyer_nft_contract_id: buyerTokenData.buyer_nft_contract_id,
			buyer_token_id: buyerTokenData.buyer_token_id,
		})

		const res = await WalletHelper.signAndSendTransaction({
			receiverId: buyerTokenData.contract_id,
			actions: [
				{
					methodName: `nft_approve`,
					args: params,
					gas: ACCEPT_GAS_FEE,
					deposit: STORAGE_APPROVE_FEE,
				},
			],
		})
		if (res.error && res.error.includes('reject')) {
			return
		} else {
			if (res.response.error) {
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">
							{res.response.error.kind.ExecutionError}
						</div>
					),
					type: 'error',
					duration: 2500,
				})
			} else {
				if (res.response) {
					store.setTransactionRes(res?.response)
				}
				setTimeout(fetchOffers, 2500)
			}
		}
	}

	const fetchOwnership = async () => {
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
				setStorageFee(STORAGE_APPROVE_FEE)
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
				setStorageFee(STORAGE_APPROVE_FEE)
			} else if (store.userProfile.accountId === creatorId) {
				setIsOwned('creator::series')
				setStorageFee(
					JSBI.add(JSBI.BigInt(STORAGE_APPROVE_FEE), JSBI.BigInt(STORAGE_MINT_FEE)).toString()
				)
			}
		}
	}

	const fetchOffers = async (fromStart = false) => {
		const _hasMore = fromStart ? true : hasMore
		const _page = fromStart ? 0 : page
		const _offers = fromStart ? [] : offers

		if (!_hasMore || isFetching) {
			return
		}

		setIsFetching(true)

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

	useEffect(() => {
		countDownTimeAuction(localToken.ended_at)
	}, [days, hours, mins, secs])

	const convertTimeOfAuction = (date) => {
		const sliceNanoSec = String(date).slice(0, 13)

		if (sliceNanoSec !== 'undefined') {
			return sliceNanoSec
		}
	}

	const countDownTimeAuction = (endedAt) => {
		const endedDate = convertTimeOfAuction(endedAt)

		const x = setInterval(() => {
			const startedDate = new Date().getTime()

			let distance = parseInt(endedDate) - parseInt(startedDate)

			let days = Math.floor(distance / (1000 * 60 * 60 * 24))
			let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
			let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
			let seconds = Math.floor((distance % (1000 * 60)) / 1000)

			setDays(days)
			setHours(hours)
			setMins(minutes)
			setSecs(seconds)

			if (distance < 0) {
				clearInterval(x)
				console.log('EXPIRED')
			}
		}, 1000)
	}

	return (
		<div className="text-white">
			<div className="bg-gray-800 mt-3 p-3 rounded-md shadow-md">
				<p className="text-xs">Auction ends in:</p>
				<div className="text-center">
					<p className="text-base font-bold">
						{days} &nbsp;&nbsp;:&nbsp;&nbsp; {hours} &nbsp;&nbsp;:&nbsp;&nbsp; {mins}{' '}
						&nbsp;&nbsp;:&nbsp;&nbsp; {secs}
					</p>
					<p className="text-xs">
						Days&nbsp;&nbsp;&nbsp;&nbsp; Hours&nbsp;&nbsp;&nbsp;&nbsp; Mins&nbsp;&nbsp;&nbsp;&nbsp;
						Secs
					</p>
				</div>
			</div>
			<CurrentBid initial={localToken} key={localToken.token_id} />
			<p className="text-center mt-2">History Bids</p>
			<InfiniteScroll
				dataLength={offers.length}
				next={fetchOffers}
				hasMore={hasMore}
				scrollableTarget="TokenScroll"
				loader={
					<div className="bg-gray-800 p-3 rounded-md shadow-md">
						<div className="text-white text-center">{localeLn('Loading...')}</div>
					</div>
				}
			>
				{offers.length !== 0 ? (
					offers.map((x) => (
						<div key={x._id}>
							<Offer
								data={x}
								onAcceptOffer={() => onAcceptOffer(x)}
								hideButton={!isOwned}
								fetchOffer={() => fetchOffers(true)}
								localToken={localToken}
								setBannedConfirmData={setBannedConfirmData}
								setBuyerTokenData={setBuyerTokenData}
								acceptTrade={acceptTrade}
							/>
						</div>
					))
				) : (
					<div className="bg-gray-800 p-3 rounded-md shadow-md">
						<div className="text-white text-center">{'No bidder at the moment'}</div>
					</div>
				)}
			</InfiniteScroll>
			{showModal === 'acceptOffer' && (
				<AcceptBidModal
					show={showModal === 'buy'}
					onClose={onDismissModal}
					token={localToken}
					data={activeOffer}
					storageFee={storageFee}
					onSubmitForm={acceptOffer}
					isLoading={isAcceptingOffer}
				/>
			)}
			{bannedConfirmData.isShowBannedConfirm && (
				<BannedConfirmModal
					creatorData={bannedConfirmData.creatorId}
					action={() => acceptTrade()}
					setIsShow={(e) => setBannedConfirmData(e)}
					onClose={onDismissModal}
					isTradeType={true}
				/>
			)}
		</div>
	)
}

const CurrentBid = ({ initial = {} }) => {
	const { token } = useToken({
		key: `${initial.contract_id}::${initial.token_series_id}/${initial.token_id}`,
		initialData: initial,
	})

	const [profile, setProfile] = useState({})
	const { localeLn } = useIntl()

	useEffect(() => {
		if (token.owner_id) {
			fetchOwnerProfile()
		}
	}, [token.owner_id])

	const fetchOwnerProfile = async () => {
		try {
			const resp = await cachios.get(`${process.env.V2_API_URL}/profiles`, {
				params: {
					accountId: token.bidder_list ? isCurrentBid('bidder') : token.owner_id,
				},
				ttl: 60,
			})
			const newData = resp.data.data.results[0] || {}
			setProfile(newData)
		} catch (err) {
			sentryCaptureException(err)
		}
	}

	const startedAtDate = (startedAt) => {
		const sliceNanoSec = String(startedAt).slice(0, 13)

		if (sliceNanoSec !== 'undefined') {
			const toDate = new Date(parseInt(sliceNanoSec)).toUTCString()
			const splitGMT = toDate.split('GMT')[0]
			return splitGMT
		}
	}

	const isCurrentBid = (type) => {
		let data = []
		token?.bidder_list?.map((item) => {
			if (type === 'bidder') data.push(item.bidder)
			else if (type === 'time') data.push(item.issued_at)
		})
		const currentBid = data.reverse()

		return currentBid[0]
	}

	return (
		<div className="bg-gray-800 mt-2 p-3 rounded-md shadow-md">
			<p className="text-right text-[9px]">
				{startedAtDate(token.bidder_list ? isCurrentBid('time') : token.started_at)} UTC
			</p>
			<div className="flex items-center justify-between -mt-2">
				<div className="flex items-center">
					<Link href={`/${token.owner_id}`}>
						<a className="hover:opacity-80">
							<Avatar size="xl" src={parseImgUrl(profile.imgUrl)} className="align-bottom" />
						</a>
					</Link>
					<div>
						{token.owner_id ? (
							<div className="ml-2">
								<Link href={`/${token.owner_id}`}>
									<a className="hover:opacity-80">
										<p className="text-white font-semibold truncate">
											{prettyTruncate(
												token.bidder_list ? isCurrentBid('bidder') : token.owner_id,
												16,
												'address'
											)}
										</p>
									</a>
								</Link>
							</div>
						) : (
							<p className="ml-2 text-white font-semibold">{localeLn('Burned')}</p>
						)}
						{!token.amount ? (
							<p className="ml-2 text-white">
								{localeLn('Starting Bid')}{' '}
								{formatNearAmount(token.price.$numberDecimal || token.price)} Ⓝ
							</p>
						) : (
							<p className="ml-2 text-white">
								{localeLn('On Bid')} {formatNearAmount(token.amount)} Ⓝ
							</p>
						)}
					</div>
				</div>
				<div className="mt-3 mr-9 pl-4 overflow-hidden">
					<div className="text-primary bg-gray-300 rounded-md py-1 px-2 text-xs font-bold">
						Current Bid
					</div>
				</div>
			</div>
		</div>
	)
}

export default TabAuction
