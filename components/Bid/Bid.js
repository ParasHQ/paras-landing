import JSBI from 'jsbi'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import AcceptBidModal from 'components/Modal/AcceptBidModal'
import Card from 'components/Card/Card'

import PlaceOfferModal from 'components/Modal/PlaceOfferModal'
import useStore from 'lib/store'
import { parseImgUrl, prettyBalance, prettyTruncate, timeAgo } from 'utils/common'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'
import TokenSeriesDetailModal from '../TokenSeries/TokenSeriesDetailModal'
import cachios from 'cachios'
import {
	GAS_FEE,
	ACCEPT_GAS_FEE,
	GAS_FEE_150,
	GAS_FEE_200,
	STORAGE_APPROVE_FEE,
	STORAGE_MINT_FEE,
} from 'config/constants'
import CancelBid from 'components/Modal/CancelBid'
import TokenDetailModal from 'components/Token/TokenDetailModal'
import WalletHelper from 'lib/WalletHelper'
import { useToast } from 'hooks/useToast'
import TradingCard from 'components/Trading/TradingCard'
import TradeNFTModal from 'components/Modal/TradeNFTModal'
import ReactCardFlip from 'react-card-flip'
import { flagColor, flagText } from 'constants/flag'
import BannedConfirmModal from 'components/Modal/BannedConfirmModal'

const Bid = ({ data, type, freshFetch }) => {
	const store = useStore()
	const router = useRouter()
	const [token, setToken] = useState(null)
	const [showModal, setShowModal] = useState('')
	const [isEnableForAccept, setIsEnableForAccept] = useState(true)
	const isNFTTraded = data?.type && data?.type === 'trade'

	const [isOwned, setIsOwned] = useState(false)
	const [storageFee, setStorageFee] = useState(STORAGE_APPROVE_FEE)
	const toast = useToast()
	const [bannedConfirmData, setBannedConfirmData] = useState({
		isShowBannedConfirm: false,
		creator: null,
		isFlagged: false,
	})
	const [creatorTradeToken, setCreatorTradeToken] = useState(null)
	const [tradedToken, setTradedToken] = useState([
		isNFTTraded
			? `${type === 'myBids' ? data.contract_id : data.buyer_nft_contract_id}::${
					type === 'myBids'
						? data.token_id
							? data.token_id.split(':')[0]
							: data.token_series_id
						: data.buyer_token_id.split(':')[0]
			  }${
					data.token_id
						? `/${type === 'myBids' ? data.token_id ?? data.token_series_id : data.buyer_token_id}`
						: ``
			  }`
			: [],
	])
	const [tradedTokenData, setTradedTokenData] = useState(null)
	const [isFlipped, setIsFlipped] = useState(true)

	const { localeLn } = useIntl()

	useEffect(() => {
		fetchTokenData()
	}, [data])

	useEffect(() => {
		// check user ownership
		if (type === 'receivedBids' && token) {
			fetchOwnership()
		}
	}, [token])

	const fetchTokenData = async () => {
		if (data.token_id) {
			if (isNFTTraded) {
				const tokenData = await cachios.get(`${process.env.V2_API_URL}/token`, {
					params: {
						token_id: type === 'myBids' ? data.buyer_token_id : data.token_id,
						contract_id: type === 'myBids' ? data.buyer_nft_contract_id : data.contract_id,
						__limit: 1,
					},
					ttl: 30,
				})
				const tokenDataTrade = await cachios.get(`${process.env.V2_API_URL}/token`, {
					params: {
						token_id: type === 'myBids' ? data.token_id : data.buyer_token_id,
						contract_id: type === 'myBids' ? data.contract_id : data.buyer_nft_contract_id,
						__limit: 1,
					},
					ttl: 30,
				})
				const profileRes = await cachios.get(`${process.env.V2_API_URL}/profiles`, {
					params: {
						accountId: tokenDataTrade.data.data.results[0].metadata.creator_id,
					},
					ttl: 600,
				})
				setCreatorTradeToken(profileRes.data.data.results[0])
				if (tokenData.data.data.results[0] && tokenDataTrade.data.data.results[0]) {
					setToken(tokenData.data.data.results[0])
					setTradedTokenData(tokenDataTrade.data.data.results[0])
				}
			} else {
				const tokenData = await cachios.get(`${process.env.V2_API_URL}/token`, {
					params: {
						token_id: data.token_id,
						contract_id: data.contract_id,
						__limit: 1,
					},
					ttl: 30,
				})
				if (tokenData.data.data.results[0]) {
					setToken(tokenData.data.data.results[0])
				}
			}
		} else {
			if (isNFTTraded) {
				const tokenData = await cachios.get(
					`${process.env.V2_API_URL}/${type === 'myBids' ? `token` : `token-series`}`,
					{
						params: {
							[type === 'myBids' ? `token_id` : `token_series_id`]:
								type === 'myBids' ? data.buyer_token_id : data.token_series_id,
							contract_id: type === 'myBids' ? data.buyer_nft_contract_id : data.contract_id,
							__limit: 1,
						},
						ttl: 30,
					}
				)
				const tokenDataTrade = await cachios.get(
					`${process.env.V2_API_URL}/${type === 'myBids' ? `token-series` : `token`}`,
					{
						params: {
							[type === 'myBids' ? `token_series_id` : `token_id`]:
								type === 'myBids' ? data.token_series_id : data.buyer_token_id,
							contract_id: type === 'myBids' ? data.contract_id : data.buyer_nft_contract_id,
							__limit: 1,
						},
						ttl: 30,
					}
				)
				const profileRes = await cachios.get(`${process.env.V2_API_URL}/profiles`, {
					params: {
						accountId: tokenDataTrade.data.data.results[0].metadata.creator_id,
					},
					ttl: 600,
				})
				setCreatorTradeToken(profileRes.data.data.results[0])
				if (!tokenData.data.data.results[0].token_id && isNFTTraded) {
					const resp = await cachios.get(`${process.env.V2_API_URL}/token`, {
						params: {
							token_series_id: tokenData.data.data.results[0].token_series_id,
							contract_id: tokenData.data.data.results[0].contract_id,
							owner_id: store.currentUser,
						},
						ttl: 60,
					})
					resp.data.data.results.length === 0
						? setIsEnableForAccept(false)
						: setIsEnableForAccept(true)
				}
				if (tokenDataTrade.data.data.results[0] && tokenDataTrade.data.data.results[0]) {
					setToken(tokenData.data.data.results[0])
					setTradedTokenData(tokenDataTrade.data.data.results[0])
				}
			} else {
				const tokenData = await cachios.get(`${process.env.V2_API_URL}/token-series`, {
					params: {
						token_series_id: data.token_series_id,
						contract_id: data.contract_id,
						__limit: 1,
					},
					ttl: 30,
				})
				if (tokenData.data.data.results[0]) {
					setToken(tokenData.data.data.results[0])
				}
			}
		}
	}

	const fetchOwnership = async () => {
		// check ownership by token
		if (data.token_id) {
			const ownershipResp = await cachios.get(`${process.env.V2_API_URL}/token`, {
				params: {
					token_id: data.token_id,
					contract_id: data.contract_id,
					owner_id: store.userProfile.accountId,
					__limit: 1,
				},
				ttl: 30,
			})
			if (ownershipResp.data.data.results[0]) {
				setIsOwned(`owner::token::${data.token_id}`)
				setStorageFee(STORAGE_APPROVE_FEE)
			}
		}
		// check ownership by series
		else {
			const ownershipResp = await cachios.get(`${process.env.V2_API_URL}/token`, {
				params: {
					token_series_id: data.token_series_id,
					contract_id: data.contract_id,
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
				res = await WalletHelper.callFunction({
					contractId: data.contract_id,
					methodName: `nft_approve`,
					args: params,
					gas: GAS_FEE_150,
					deposit: STORAGE_APPROVE_FEE,
				})
			}
			// batch tx -> mint & accept
			else {
				res = await WalletHelper.callFunction({
					contractId: data.contract_id,
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
							{res.response.error.kind.ExecutionError}
						</div>
					),
					type: 'error',
					duration: 2500,
				})
			} else if (res) {
				setShowModal('')
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">{`Successfully accept offer`}</div>
					),
					type: 'success',
					duration: 2500,
				})
				setTimeout(freshFetch, 2500)
			}
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
			buyer_id: data.buyer_id,
			buyer_nft_contract_id: data.buyer_nft_contract_id,
			buyer_token_id: data.buyer_token_id,
		})

		const res = await WalletHelper.signAndSendTransaction({
			receiverId: data.contract_id,
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
				setTimeout(freshFetch, 2500)
			}
		}
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
					if (res.error) {
						toast.show({
							text: <div className="font-semibold text-center text-sm">{res.error}</div>,
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
						setTimeout(freshFetch, 2500)
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
					setShowModal('')
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

	if (!token) return null

	return (
		<>
			<TokenSeriesDetailModal tokens={[token]} />
			<TokenDetailModal tokens={[token]} />
			<TokenSeriesDetailModal tokens={[tradedTokenData]} />
			<TokenDetailModal tokens={[tradedTokenData]} />
			{showModal === 'updateTrade' && (
				<TradeNFTModal
					show={showModal === 'updateTrade'}
					data={data}
					onClose={() => {
						setShowModal('')
					}}
					tokenType={`token`}
					fromUpdate={true}
				/>
			)}
			{showModal === 'acceptBid' && (
				<AcceptBidModal
					data={data}
					onClose={() => setShowModal('')}
					token={token}
					storageFee={storageFee}
					onSubmitForm={acceptOffer}
				/>
			)}
			{showModal === 'updateBid' && (
				<PlaceOfferModal
					show={showModal === 'updateBid'}
					data={token}
					onSuccess={() => setTimeout(freshFetch, 2500)}
					onClose={() => setShowModal('')}
				/>
			)}
			{showModal === 'cancelBid' && (
				<CancelBid
					onClose={() => setShowModal('')}
					show={showModal === 'cancelBid'}
					onDelete={deleteOffer}
				/>
			)}
			<div
				className={`${
					!isEnableForAccept && `hidden`
				} border-2 border-dashed my-4 p-4 md:py-6 md:px-8 md:h-80 rounded-md border-gray-800`}
			>
				<div className={`flex flex-col md:flex-row ${isNFTTraded && `relative`}`}>
					<div
						className={`hidden md:block w-40 h-full ${
							data.type &&
							data.type === 'trade' &&
							`${
								isFlipped
									? `transition-all scale-100 z-30`
									: `transition-all scale-90 z-20 ml-5 mt-2`
							}`
						}`}
					>
						<Card
							imgUrl={parseImgUrl(token.metadata.media, null, {
								width: `600`,
								useOriginal: process.env.APP_ENV === 'production' ? false : true,
								isMediaCdn: token.isMediaCdn,
							})}
							onClick={() => {
								isNFTTraded
									? setIsFlipped(!isFlipped)
									: router.push(
											{
												pathname: router.pathname,
												query: {
													...router.query,
													tokenSeriesId: token.token_series_id,
													tokenId: token.token_id,
													contractId: token.contract_id,
												},
											},
											token.token_id
												? `/token/${token.contract_id}::${token.token_series_id}/${token.token_id}`
												: `/token/${token.contract_id}::${token.token_series_id}`,
											{
												shallow: true,
												scroll: false,
											}
									  )
							}}
							imgBlur={token.metadata.blurhash}
							token={{
								title: token.metadata.title,
								collection: token.metadata.collection || token.contract_id,
								copies: token.metadata.copies,
								creatorId: token.metadata.creator_id || token.contract_id,
								is_creator: token.is_creator,
							}}
						/>
					</div>
					{isNFTTraded && (
						<div
							className={`hidden md:block absolute w-40 h-full ${
								!isFlipped
									? `transition-all scale-100 z-30`
									: `transition-all scale-90 z-20 ml-5 mt-5`
							}`}
							onClick={() => {
								setIsFlipped(!isFlipped)
							}}
						>
							{tradedToken.map((tok, idx) => {
								return (
									<TradingCard
										key={`${tok}-${idx}`}
										tokenType={`token`}
										contract_token_id={tok}
										setTradedToken={setTradedToken}
										afterCreate={true}
									/>
								)
							})}
						</div>
					)}
					<div className="block md:hidden w-40 h-full mx-auto">
						{isNFTTraded ? (
							<ReactCardFlip isFlipped={isFlipped} flipDirection={`vertical`}>
								<div className="cursor-pointer">
									<Card
										imgUrl={parseImgUrl(token.metadata.media, null, {
											width: `600`,
											useOriginal: process.env.APP_ENV === 'production' ? false : true,
											isMediaCdn: token.isMediaCdn,
										})}
										onClick={() => setIsFlipped(!isFlipped)}
										imgBlur={token.metadata.blurhash}
										token={{
											title: token.metadata.title,
											collection: token.metadata.collection || token.contract_id,
											copies: token.metadata.copies,
											creatorId: token.metadata.creator_id || token.contract_id,
											is_creator: token.is_creator,
										}}
									/>
								</div>
								<div className="cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
									{tradedToken.map((tok, idx) => {
										return (
											<TradingCard
												key={`${tok}-${idx}`}
												tokenType={`token`}
												contract_token_id={tok}
												setTradedToken={setTradedToken}
												afterCreate={true}
											/>
										)
									})}
								</div>
							</ReactCardFlip>
						) : (
							<Card
								imgUrl={parseImgUrl(token.metadata.media, null, {
									width: `600`,
									useOriginal: process.env.APP_ENV === 'production' ? false : true,
									isMediaCdn: token.isMediaCdn,
								})}
								imgBlur={token.metadata.blurhash}
								token={{
									title: token.metadata.title,
									collection: token.metadata.collection || token.contract_id,
									copies: token.metadata.copies,
									creatorId: token.metadata.creator_id || token.contract_id,
									is_creator: token.is_creator,
								}}
								onClick={() => {
									router.push(
										{
											pathname: router.pathname,
											query: {
												...router.query,
												tokenSeriesId: token.token_series_id,
												tokenId: token.token_id,
												contractId: token.contract_id,
											},
										},
										token.token_id
											? `/token/${token.contract_id}::${token.token_series_id}/${token.token_id}`
											: `/token/${token.contract_id}::${token.token_series_id}`,
										{
											shallow: true,
											scroll: false,
										}
									)
								}}
							/>
						)}
					</div>
					<div
						className={`flex-1 items-start md:items-center mt-8 md:mt-0 md:flex ml-4 ${
							isNFTTraded ? `md:ml-10` : `md:ml-6`
						} justify-between items-center`}
					>
						<div className="text-gray-100 truncate cursor-pointer">
							{isNFTTraded ? (
								<>
									<div className="text-base mb-3">
										Offer NFT via Trade {data.token_series_id && `- Series`}
									</div>
									<Link
										href={{
											pathname: router.pathname,
											query: {
												...router.query,
												tokenSeriesId: token.token_series_id,
												tokenId: token.token_id,
												contractId: token.contract_id,
											},
										}}
										as={
											token.token_id
												? `/token/${token.contract_id}::${token.token_series_id}/${token.token_id}`
												: `/token/${token.contract_id}::${token.token_series_id}`
										}
										scroll={false}
										shallow
									>
										<div className="font-bold text-2xl flex flex-wrap items-center">
											<span className="mr-2">{prettyTruncate(token?.metadata?.title, 25)}</span>
											<div className="px-3 py-1 bg-primary opacity-75 text-white text-sm font-light rounded-full">
												yours
											</div>
										</div>
									</Link>
									<div className="flex my-3">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="icon icon-tabler icon-tabler-switch-vertical"
											width={25}
											height={25}
											viewBox="0 0 24 24"
											strokeWidth="1.5"
											stroke="#fff"
											fill="none"
											strokeLinecap="round"
											strokeLinejoin="round"
										>
											<path stroke="none" d="M0 0h24v24H0z" fill="none" />
											<polyline points="3 8 7 4 11 8" />
											<line x1={7} y1={4} x2={7} y2={13} />
											<polyline points="13 16 17 20 21 16" />
											<line x1={17} y1={10} x2={17} y2={20} />
										</svg>
									</div>
									<Link
										href={{
											pathname: router.pathname,
											query: {
												...router.query,
												tokenSeriesId: tradedTokenData?.token_series_id,
												tokenId: tradedTokenData?.token_id,
												contractId: tradedTokenData?.contract_id,
											},
										}}
										as={
											tradedTokenData?.token_id
												? `/token/${tradedTokenData?.contract_id}::${tradedTokenData?.token_series_id}/${tradedTokenData?.token_id}`
												: `/token/${tradedTokenData?.contract_id}::${tradedTokenData?.token_series_id}`
										}
										scroll={false}
										shallow
									>
										<div className="font-bold text-2xl">
											{prettyTruncate(tradedTokenData?.metadata?.title, 25)}
										</div>
									</Link>
									<p className="mt-2 text-sm opacity-50 mb-6 md:mb-0">
										{token && timeAgo.format(data.issued_at)}
									</p>
								</>
							) : (
								<>
									<Link
										href={{
											pathname: router.pathname,
											query: {
												...router.query,
												tokenSeriesId: token.token_series_id,
												tokenId: token.token_id,
												contractId: token.contract_id,
											},
										}}
										as={
											token.token_id
												? `/token/${token.contract_id}::${token.token_series_id}/${token.token_id}`
												: `/token/${token.contract_id}::${token.token_series_id}`
										}
										scroll={false}
										shallow
									>
										<div className="font-bold text-2xl">
											{prettyTruncate(token?.metadata?.title, 25)}
										</div>
									</Link>
									<p className="opacity-75">{prettyTruncate(token?.metadata?.collection, 30)}</p>
									<div className="mt-4 mb-6">
										{store.currentUser !== data.buyer_id
											? `You received ${prettyBalance(data.price, 24, 4)} Ⓝ offer from ${
													data.buyer_id
											  }`
											: `You offer ${prettyBalance(data.price, 24, 4)} Ⓝ`}
									</div>
									<p className="mt-2 text-sm opacity-50 mb-6 md:mb-0">
										{token && timeAgo.format(data.issued_at)}
									</p>
								</>
							)}
						</div>
						<div className="flex flex-col items-center">
							{store.currentUser !== data.buyer_id ? (
								<button
									onClick={() => {
										isNFTTraded
											? setBannedConfirmData({
													isShowBannedConfirm: true,
													creator: creatorTradeToken,
													isFlagged:
														creatorTradeToken.flag &&
														(creatorTradeToken.flag === 'banned' ||
															creatorTradeToken.flag === 'rugpull' ||
															creatorTradeToken.flag === 'hacked' ||
															creatorTradeToken.flag === 'scam')
															? true
															: false,
											  })
											: setShowModal('acceptBid')
									}}
									className="font-semibold w-32 rounded-md border-2 border-primary bg-primary text-white mb-2"
								>
									{localeLn('Accept')}
								</button>
							) : (
								<>
									{data?.type !== 'trade' && (
										<button
											onClick={() => setShowModal(isNFTTraded ? `updateTrade` : `updateBid`)}
											className="font-semibold w-32 rounded-md border-2 border-primary bg-primary text-white mb-2"
										>
											{localeLn('Update')}
										</button>
									)}
									<button
										className="font-semibold w-32 rounded-md border-2 bg-red-600 text-white border-red-600 mb-2"
										onClick={() => setShowModal('cancelBid')}
									>
										{localeLn('Cancel')}
									</button>
								</>
							)}
						</div>
					</div>
				</div>
				{isNFTTraded &&
					store.currentUser !== data.buyer_id &&
					creatorTradeToken?.flag &&
					(creatorTradeToken?.flag === 'banned' ||
						creatorTradeToken.flag === 'rugpull' ||
						creatorTradeToken.flag === 'hacked' ||
						creatorTradeToken.flag === 'scam') && (
						<div className="mt-8">
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
			{bannedConfirmData.isShowBannedConfirm && (
				<BannedConfirmModal
					creatorData={bannedConfirmData.creator}
					action={() => acceptTrade()}
					setIsShow={(e) => setBannedConfirmData(e)}
					onClose={() => setBannedConfirmData({ ...bannedConfirmData, isShowBannedConfirm: false })}
					isTradeType={true}
					isFlagged={bannedConfirmData.isFlagged}
					tradedTokenData={tradedTokenData}
				/>
			)}
		</>
	)
}

export default Bid
