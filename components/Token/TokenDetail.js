import { Suspense, useEffect, useState } from 'react'
import { Blurhash } from 'react-blurhash'
import Scrollbars from 'react-custom-scrollbars'
import { useRouter } from 'next/router'

import Button from 'components/Common/Button'
import { IconDots, IconLoader, IconInfo } from 'components/Icons'
import TabInfo from 'components/Tabs/TabInfo'
import TabOwners from 'components/Tabs/TabOwners'

import TokenBuyModal from 'components/Modal/TokenBuyModal'
import { capitalize, parseImgUrl, prettyBalance, abbrNum, prettyTruncate } from 'utils/common'
import TokenMoreModal from '../Modal/TokenMoreModal'
import TokenShareModal from '../Modal/TokenShareModal'
import TokenUpdatePriceModal from '../Modal/TokenUpdatePriceModal'
import TokenBurnModal from '../Modal/TokenBurnModal'
import TokenTransferModal from '../Modal/TokenTransferModal'
import useStore from 'lib/store'
import TabHistory from '../Tabs/TabHistory'
import LoginModal from '../Modal/LoginModal'
import ArtistVerified from '../Common/ArtistVerified'
import ArtistBanned from '../Common/ArtistBanned'
import { useIntl } from 'hooks/useIntl'
import TabOffers from 'components/Tabs/TabOffers'
import PlaceOfferModal from 'components/Modal/PlaceOfferModal'
import TabPublication from 'components/Tabs/TabPublication'
import Media from 'components/Common/Media'
import ReportModal from 'components/Modal/ReportModal'
import Card from 'components/Card/Card'
import Tooltip from 'components/Common/Tooltip'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import TradeNFTModal from 'components/Modal/TradeNFTModal'
import axios from 'axios'
import { Canvas } from '@react-three/fiber'
import { Model1 } from 'components/Model3D/ThreeDModel'
import FileType from 'file-type/browser'
import TabAuction from 'components/Tabs/TabAuction'
import TokenAuctionBidModal from 'components/Modal/TokenAuctionBidModal'
import JSBI from 'jsbi'
import AcceptBidAuctionModal from 'components/Modal/AcceptBidAuctionModal'
import { useToast } from 'hooks/useToast'
import CancelAuctionModal from 'components/Modal/CancelAuctionModal'
import CancelBidModal from 'components/Modal/CancelBidModal'
import { mutate } from 'swr'
import IconLove from 'components/Icons/component/IconLove'
import WalletHelper from 'lib/WalletHelper'
import { trackLikeToken, trackUnlikeToken } from 'lib/ga'

const TokenDetail = ({ token, className, isAuctionEnds }) => {
	const [activeTab, setActiveTab] = useState('info')
	const [showModal, setShowModal] = useState(null)
	const [tokenDisplay, setTokenDisplay] = useState('detail')
	const [isEndedTime, setIsEndedTime] = useState(false)
	const [isLiked, setIsLiked] = useState(false)
	const [defaultLikes, setDefaultLikes] = useState(0)
	const currentUser = useStore((state) => state.currentUser)
	const { localeLn } = useIntl()
	const store = useStore()
	const router = useRouter()
	const [threeDUrl, setThreeDUrl] = useState('')
	const [showLove, setShowLove] = useState(false)
	const [fileType, setFileType] = useState(token?.metadata?.mime_type)
	const toast = useToast()

	useEffect(() => {
		if (token?.total_likes) {
			if (token.likes) {
				setIsLiked(true)
			}

			setDefaultLikes(token?.total_likes)
		}
	}, [JSON.stringify(token)])

	useEffect(() => {
		setActiveTab('info')
	}, [isAuctionEnds])

	const _showInfoUpdatingAuction = () => {
		toast.show({
			text: (
				<div className="text-sm text-white text-justify">
					<p>
						This auction data is being updated, please refresh the page periodically each minute.
					</p>
				</div>
			),
			type: 'updatingAuction',
			duration: null,
		})
	}

	useEffect(() => {
		TabNotification(router.query.tab)
	}, [router.query.tab])

	useEffect(() => {
		if (token?.metadata?.animation_url && token.metadata?.mime_type?.includes('model')) {
			get3DModel(token?.metadata?.animation_url)
		}
		if (token?.metadata?.animation_url && token.metadata?.mime_type?.includes('audio')) {
			getAudio(token?.metadata?.animation_url)
		}
		if (token?.metadata?.animation_url && token.metadata?.mime_type?.includes('iframe')) {
			getIframe()
		}
	}, [])

	useEffect(() => {
		setActiveTab('info')
		setTokenDisplay('detail')
	}, [router.query.tokenId])

	const TabNotification = (tab) => {
		switch (tab) {
			case 'auction':
				setActiveTab('auction')
				break
			case 'owners':
				setActiveTab('owners')
				break
			case 'history':
				setActiveTab('history')
				break
			case 'offers':
				setActiveTab('offers')
				break
			case 'publication':
				setActiveTab('publication')
				break
			default:
				setActiveTab('info')
		}
	}

	const changeActiveTab = (tab) => {
		setActiveTab(tab)
	}

	const tabDetail = (tab) => {
		return (
			<div
				className={`cursor-pointer relative text-center ${
					activeTab === tab
						? 'text-gray-100 border-b-2 border-white font-semibold'
						: 'hover:bg-opacity-15 text-gray-100'
				}`}
				onClick={() => {
					if (tab === 'auction') {
						mutate(`${token.contract_id}::${token.token_series_id}/${token.token_id}`)
					}
					changeActiveTab(tab)
				}}
			>
				<div className="capitalize">{localeLn(capitalize(tab))}</div>
			</div>
		)
	}

	const onDismissModal = () => {
		setShowModal(null)
	}

	const onClickShare = () => {
		setShowModal('share')
	}

	const onClickUpdate = () => {
		setShowModal('updatePrice')
	}

	const onClickBuy = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('buy')
	}

	const onClickTransfer = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('transfer')
	}

	const onClickAcceptBidAuction = () => {
		setShowModal('acceptbidauction')
	}

	const onClickCancelAuction = () => {
		setShowModal('removeauction')
	}

	const onCancelBid = () => {
		setShowModal('cancelbid')
	}

	const onClickBurn = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('burn')
	}

	const onClickAuction = () => {
		mutate(`${token.contract_id}::${token.token_series_id}/${token.token_id}`)
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('placeauction')
	}

	const onClickOffer = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('placeoffer')
	}

	const onClickOfferNFT = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('placeofferNFT')
	}

	const isOwner = () => {
		if (!currentUser) {
			return false
		}
		return currentUser === token.owner_id
	}

	const get3DModel = async (url) => {
		const resp = await axios.get(`${parseImgUrl(url, undefined)}`, {
			responseType: `blob`,
		})
		const fileType = await FileType.fromBlob(resp.data)
		setFileType(fileType?.mime)
		const objectUrl = URL.createObjectURL(resp.data)
		setThreeDUrl(objectUrl)
	}

	const getAudio = async (url) => {
		const resp = await axios.get(`${parseImgUrl(url, undefined)}`, {
			responseType: `blob`,
		})
		const fileType = await FileType.fromBlob(resp.data)
		setFileType(fileType?.mime)
	}

	const getIframe = () => {
		setFileType(token?.metadata?.mime_type)
	}

	const checkUserBid = () => {
		let userBid = []
		token?.bidder_list?.map((item) => {
			if (item.bidder === currentUser) {
				userBid.push(item.bidder)
			}
		})

		return userBid[0]
	}

	const isCurrentBid = (type) => {
		let list = []
		token?.bidder_list?.map((item) => {
			if (type === 'bidder') list.push(item.bidder)
			else if (type === 'time') list.push(item.issued_at)
			else if (type === 'amount') list.push(item.amount)
		})

		return list[list.length - 1]
	}

	const checkNextPriceBid = (type) => {
		if (token?.bidder_list && token?.bidder_list?.length !== 0) {
			const currentBid = JSBI.BigInt(
				token?.bidder_list && token?.bidder_list?.length !== 0
					? isCurrentBid('amount')
					: token?.price
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
				return formatNearAmount(token?.price)
			} else if (type === 'usd') {
				const price = token?.price || token?.lowest_price
				return price.toString()
			}
		}
	}

	const likeToken = async (contract_id, token_series_id, source) => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}

		setIsLiked(true)
		setDefaultLikes(defaultLikes + 1)
		const params = {
			account_id: currentUser,
		}

		const res = await axios.put(
			`${process.env.V2_API_URL}/like/${contract_id}/${token_series_id}`,
			params,
			{
				headers: {
					authorization: await WalletHelper.authToken(),
				},
			}
		)

		mutate(`${token.contract_id}::${token.token_series_id}`)
		mutate(`${token.contract_id}::${token.token_series_id}/${token.token_id}`)
		if (res.status !== 200) {
			setIsLiked(false)
			setDefaultLikes(defaultLikes - 1)
			return
		}

		trackLikeToken(`${contract_id}::${token_series_id}`, source)
	}

	const unlikeToken = async (contract_id, token_series_id, source) => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}

		setIsLiked(false)
		setDefaultLikes(defaultLikes - 1)
		const params = {
			account_id: currentUser,
		}

		const res = await axios.put(
			`${process.env.V2_API_URL}/unlike/${contract_id}/${token_series_id}`,
			params,
			{
				headers: {
					authorization: await WalletHelper.authToken(),
				},
			}
		)

		mutate(`${token.contract_id}::${token.token_series_id}`)
		mutate(`${token.contract_id}::${token.token_series_id}/${token.token_id}`)
		if (res.status !== 200) {
			setIsLiked(true)
			setDefaultLikes(defaultLikes + 1)
			return
		}

		trackUnlikeToken(`${contract_id}::${token_series_id}`, source)
	}

	const onDoubleClickDetail = () => {
		if (currentUser) {
			setShowLove(true)
			!isLiked && likeToken(token.contract_id, token.token_series_id, 'double_click_detail')
			setTimeout(() => setShowLove(false), 1000)
		}
	}

	return (
		<div className={`m-auto rounded-lg overflow-hidden ${className}`}>
			<div className="flex flex-col lg:flex-row h-90vh lg:h-80vh">
				<div className="w-full h-1/2 lg:h-full lg:w-3/5 relative bg-dark-primary-1 ">
					<div className="absolute inset-0 opacity-75">
						{token.metadata.blurhash && (
							<Blurhash
								hash={token.metadata.blurhash || ''}
								width={`100%`}
								height={`100%`}
								resolutionX={32}
								resolutionY={32}
								punch={1}
							/>
						)}
					</div>
					<div className="w-full h-full flex items-center justify-center p-2 lg:p-12 relative">
						{tokenDisplay === 'detail' ? (
							<div className="relative h-full w-full" onDoubleClick={onDoubleClickDetail}>
								{token?.metadata?.animation_url ? (
									<>
										{fileType?.includes('audio') && (
											<div className="max-h-80 md:max-h-52 lg:max-h-96 w-full mx-2 md:mx-0">
												<div className="w-1/2 md:w-full h-full m-auto">
													<Media
														className="rounded-lg overflow-hidden max-h-80 md:max-h-52 lg:max-h-96"
														url={
															token.metadata?.mime_type
																? parseImgUrl(token.metadata.media)
																: token.metadata.media
														}
														videoControls={true}
														videoLoop={true}
														videoMuted={true}
														videoPadding={true}
														mimeType={token?.metadata?.mime_type}
														seeDetails={true}
														isMediaCdn={token?.isMediaCdn}
													/>
												</div>
												<div className="w-full m-auto">
													<div className="my-3 flex items-center justify-center w-full">
														<audio controls className="w-full">
															<source src={parseImgUrl(token?.metadata.animation_url)}></source>
														</audio>
													</div>
												</div>
											</div>
										)}
										{fileType?.includes(`model`) && threeDUrl && (
											<Suspense
												fallback={
													<div className="flex h-full w-full items-center justify-center">
														<IconLoader />
													</div>
												}
											>
												<Canvas>
													<Model1 threeDUrl={threeDUrl} />
												</Canvas>
											</Suspense>
										)}
										{fileType?.includes('iframe') && (
											<iframe
												src={token?.metadata.animation_url}
												sandbox="allow-scripts"
												className="object-contain w-full h-full"
											/>
										)}
										{!fileType && (
											<Media
												className="rounded-lg overflow-hidden"
												url={
													token.metadata?.mime_type
														? parseImgUrl(token.metadata.media)
														: token.metadata.media
												}
												videoControls={true}
												videoLoop={true}
												videoMuted={true}
												videoPadding={true}
												mimeType={token?.metadata?.mime_type}
												seeDetails={true}
												isMediaCdn={token?.isMediaCdn}
												animationUrlforVideo={token?.metadata?.animation_url}
											/>
										)}
									</>
								) : (
									<Media
										className="rounded-lg overflow-hidden"
										url={
											token.metadata?.mime_type
												? parseImgUrl(token.metadata.media)
												: token.metadata.media
										}
										videoControls={true}
										videoLoop={true}
										videoMuted={true}
										videoPadding={false}
										mimeType={token?.metadata?.mime_type}
										seeDetails={true}
										isMediaCdn={token?.isMediaCdn}
										animationUrlforVideo={token?.metadata?.animation_url}
									/>
								)}
								{showLove && (
									<div className="absolute inset-0 flex items-center justify-center z-10">
										<IconLove className="love-container" color="#ffffff" size="20%" />
									</div>
								)}
							</div>
						) : (
							<div className="w-1/2 h-full md:w-full m-auto flex items-center">
								<Card
									imgUrl={parseImgUrl(token.metadata.media, null, {
										width: `600`,
										useOriginal: process.env.APP_ENV === 'production' ? false : true,
										isMediaCdn: token.isMediaCdn,
									})}
									audioUrl={
										token.metadata.mime_type &&
										token.metadata.mime_type.includes('audio') &&
										token.metadata?.animation_url
									}
									threeDUrl={
										token.metadata.mime_type &&
										token.metadata.mime_type.includes('model') &&
										token.metadata.animation_url
									}
									iframeUrl={
										token.metadata.mime_type &&
										token.metadata.mime_type.includes('iframe') &&
										token.metadata.animation_url
									}
									imgBlur={token.metadata.blurhash}
									token={{
										title: token.metadata.title,
										collection: token.metadata.collection || token.contract_id,
										copies: token.metadata.copies,
										creatorId: token.metadata.creator_id || token.contract_id,
										is_creator: token.is_creator,
										mime_type: token.metadata.mime_type,
									}}
								/>
							</div>
						)}
						<div className="absolute top-0 right-0 text-white p-4 text-sm">
							<span
								className={`cursor-pointer ${tokenDisplay === 'detail' ? 'font-bold' : ''}`}
								onClick={() => setTokenDisplay('detail')}
							>
								Detail
							</span>
							<span> / </span>
							<span
								className={`cursor-pointer ${tokenDisplay === 'card' ? 'font-bold' : ''}`}
								onClick={() => setTokenDisplay('card')}
							>
								Card
							</span>
						</div>
					</div>
					<ArtistBanned creatorId={token.metadata.creator_id} />
				</div>
				<div className="h-1/2 lg:h-full flex flex-col w-full lg:w-2/5 lg:max-w-2xl bg-gray-700">
					<div className="hidden justify-between md:p-4 md:pb-2 md:flex z-20">
						<div className="overflow-x-hidden">
							<div className="flex justify-between items-center">
								<p className="text-gray-300 truncate">
									NFT //{' '}
									{token.contract_id === process.env.NFT_CONTRACT_ID
										? `#${token.edition_id} of ${token.metadata.copies}`
										: `#${token.token_id}`}
								</p>
							</div>

							<h1 className="mt-2 text-xl md:text-2xl font-bold text-white tracking-tight pr-4 break-all">
								{prettyTruncate(token.metadata.title, 28)}
							</h1>
							<div className="mt-1 text-white flex">
								<p className="mr-1">{localeLn('by')}</p>
								<ArtistVerified token={token} />
							</div>
						</div>

						<div className="flex flex-col items-end">
							<IconDots
								color="#ffffff"
								className="cursor-pointer mb-1"
								onClick={() => setShowModal('more')}
							/>
							<div className="w-full flex flex-col items-center justify-center">
								<div
									className="cursor-pointer"
									onClick={() => {
										isLiked
											? unlikeToken(token.contract_id, token.token_series_id, 'detail')
											: likeToken(token.contract_id, token.token_series_id, 'detail')
									}}
								>
									<IconLove
										size={17}
										color={isLiked ? '#c51104' : 'transparent'}
										stroke={isLiked ? 'none' : 'white'}
									/>
								</div>
								<p className="text-white text-center text-sm">{abbrNum(defaultLikes ?? 0, 1)}</p>
							</div>
							{token.is_staked && (
								<Tooltip
									id="text-staked"
									show={true}
									text={'The NFT is being staked by the owner'}
									className="font-bold bg-gray-800 text-white"
								>
									<span
										className="bg-white text-primary font-bold rounded-full px-3 py-1 text-sm"
										style={{ boxShadow: `rgb(83 97 255) 0px 0px 5px 1px` }}
									>
										staked
									</span>
								</Tooltip>
							)}
						</div>
					</div>
					<Scrollbars
						className="h-full"
						universal={true}
						renderView={(props) => (
							<div {...props} id="TokenScroll" className="p-4 pt-4 md:pt-0 relative" />
						)}
					>
						<div>
							<div className="flex justify-between md:hidden">
								<div className="overflow-x-hidden">
									<div className="flex justify-between items-center">
										<p className="text-gray-300 truncate">
											NFT //{' '}
											{token.contract_id === process.env.NFT_CONTRACT_ID
												? `#${token.edition_id} of ${token.metadata.copies}`
												: `#${token.token_id}`}
										</p>
									</div>

									<h1 className="mt-2 text-xl md:text-2xl font-bold text-white tracking-tight pr-4 break-all">
										{prettyTruncate(token.metadata.title, 26)}
									</h1>
									<div className="mt-1 text-white flex">
										<p className="mr-1">{localeLn('by')}</p>
										<ArtistVerified token={token} />
									</div>
								</div>

								<div className="flex flex-col items-end">
									<IconDots
										color="#ffffff"
										className="cursor-pointer mb-1"
										onClick={() => setShowModal('more')}
									/>
									<div className="w-full flex flex-col items-center justify-center">
										<div
											className="cursor-pointer"
											onClick={() => {
												isLiked
													? unlikeToken(token.contract_id, token.token_series_id, 'detail')
													: likeToken(token.contract_id, token.token_series_id, 'detail')
											}}
										>
											<IconLove
												size={17}
												color={isLiked ? '#c51104' : 'transparent'}
												stroke={isLiked ? 'none' : 'white'}
											/>
										</div>
										<p className="text-white text-center text-sm">
											{abbrNum(defaultLikes ?? 0, 1)}
										</p>
									</div>
									{token.is_staked && (
										<Tooltip
											id="text-staked"
											show={true}
											text={'The NFT is being staked by the owner'}
											className="font-bold bg-gray-800 text-white"
										>
											<span
												className="bg-white text-primary font-bold rounded-full px-3 py-1 text-sm"
												style={{ boxShadow: `rgb(83 97 255) 0px 0px 5px 1px` }}
											>
												staked
											</span>
										</Tooltip>
									)}
								</div>
							</div>
							<div className="bg-gray-700 md:sticky flex md:top-0 z-30 overflow-x-scroll space-x-4 flex-grow overflow-scroll flex-nowrap disable-scrollbars md:-mb-4">
								{tabDetail('info')}
								{token.is_auction && !isAuctionEnds && tabDetail('auction')}
								{tabDetail('owners')}
								{(!token.is_auction || isAuctionEnds) && tabDetail('offers')}
								{tabDetail('history')}
								{tabDetail('publication')}
							</div>
							{activeTab === 'info' && <TabInfo localToken={token} isNFT={true} />}
							{activeTab === 'auction' && (
								<TabAuction localToken={token} setAuctionEnds={() => setIsEndedTime(true)} />
							)}
							{activeTab === 'owners' && (
								<TabOwners localToken={token} isAuctionEnds={isAuctionEnds} />
							)}
							{activeTab === 'offers' && <TabOffers localToken={token} />}
							{activeTab === 'history' && <TabHistory localToken={token} />}
							{activeTab === 'publication' && <TabPublication localToken={token} />}
						</div>
					</Scrollbars>
					<div className="p-3">
						{token?.is_auction ? (
							<div>
								{token.owner_id === currentUser && !isAuctionEnds && !isEndedTime ? (
									<>
										<div className="flex justify-between items-center gap-2">
											<div className="flex items-baseline space-x-1 md:pl-2">
												<div>
													<p className="font-thin text-white text-xs">
														{token?.bidder_list && token?.bidder_list.length !== 0
															? 'Next Bid'
															: 'First Bid'}
													</p>
													<div className="flex items-center gap-1">
														<div className="truncate text-white text-base font-bold">{`${prettyBalance(
															checkNextPriceBid('near'),
															0,
															4
														)} Ⓝ`}</div>
														{token.price !== '0' && store.nearUsdPrice !== 0 && (
															<div className="text-[9px] text-gray-400 truncate mt-1">
																~ $
																{prettyBalance(
																	JSBI.BigInt(checkNextPriceBid('usd')) * store.nearUsdPrice,
																	24,
																	2
																)}
															</div>
														)}
														{token.price === '0' && token?.is_auction && !isAuctionEnds && (
															<div className="text-[9px] text-gray-400 truncate mt-1">
																~ $
																{prettyBalance(
																	JSBI.BigInt(token?.amount ? token?.amount : token.price) *
																		store.nearUsdPrice,
																	24,
																	2
																)}
															</div>
														)}
													</div>
												</div>
											</div>
											{token?.bidder_list && token?.is_auction && !isAuctionEnds ? (
												<div className="flex">
													{token?.bidder_list.length !== 0 && (
														<Button
															size="md"
															className="px-4 mr-2"
															onClick={onClickAcceptBidAuction}
														>
															Accept Bid
														</Button>
													)}
													<Button
														size="md"
														className="px-2"
														variant="error"
														onClick={onClickCancelAuction}
													>
														Remove Auction
													</Button>
												</div>
											) : (
												<Button
													size="md"
													className="px-4"
													variant="error"
													onClick={onClickCancelAuction}
												>
													Remove Auction
												</Button>
											)}
										</div>
									</>
								) : (
									!isAuctionEnds &&
									!isEndedTime && (
										<div className="flex justify-between items-center gap-2">
											<div className="flex items-baseline space-x-1 md:pl-2">
												<div>
													<p className="font-thin text-white text-xs">
														{token?.bidder_list && token?.bidder_list.length !== 0
															? 'Next Bid'
															: 'First Bid'}
													</p>
													<div className="flex items-center gap-1">
														<div className="truncate text-white text-base font-bold">{`${prettyBalance(
															checkNextPriceBid('near'),
															0,
															4
														)} Ⓝ`}</div>
														{token.price !== '0' && store.nearUsdPrice !== 0 && (
															<div className="text-[9px] text-gray-400 truncate mt-1">
																~ $
																{prettyBalance(
																	JSBI.BigInt(checkNextPriceBid('usd')) * store.nearUsdPrice,
																	24,
																	2
																)}
															</div>
														)}
													</div>
												</div>
											</div>
											<div className="flex">
												{token.owner_id !== currentUser && isCurrentBid('bidder') !== currentUser && (
													<Button size="md" onClick={onClickAuction} className="px-6 mr-2">
														{`Place a Bid`}
													</Button>
												)}
												{token.owner_id !== currentUser && checkUserBid() && (
													<Button size="md" onClick={onCancelBid} isFullWidth variant="error">
														{`Cancel Bid`}
													</Button>
												)}
											</div>
										</div>
									)
								)}
							</div>
						) : token.is_staked && currentUser === token.owner_id ? (
							<div className="flex flex-wrap flex-col">
								<div className="w-full flex-1">
									<Button
										size="md"
										isFullWidth
										onClick={() => {
											window.location.href = 'https://stake.paras.id'
										}}
									>
										{localeLn('Unstake')}
									</Button>
								</div>
							</div>
						) : (
							token.owner_id === currentUser &&
							!isAuctionEnds && (
								<div className="flex flex-wrap space-x-4">
									<div className="w-full flex-1">
										<Button size="md" onClick={() => setShowModal('updatePrice')} isFullWidth>
											{localeLn('UpdateListing')}
										</Button>
									</div>
									<div className="w-full flex-1">
										<Button size="md" onClick={onClickTransfer} isFullWidth>
											{localeLn('Transfer')}
										</Button>
									</div>
								</div>
							)
						)}
						{token.owner_id !== currentUser && token.price && !token.is_auction && (
							<div className="flex space-x-2">
								<Button size="md" className="truncate" onClick={onClickBuy} isFullWidth>
									{`Buy for ${formatNearAmount(token.price)} Ⓝ`}
								</Button>
								<Button size="md" onClick={onClickOffer} isFullWidth variant="secondary">
									{`Place an offer`}
								</Button>
							</div>
						)}
						{token.owner_id !== currentUser && !token.price && (
							<Button size="md" onClick={onClickOffer} isFullWidth variant="secondary">
								{`Place an offer`}
							</Button>
						)}
						{(isAuctionEnds || isEndedTime) && (
							<div className="flex justify-center items-center gap-2 text-white text-center mt-2 rounded-md p-2">
								<div className="flex items-center">
									<h4>Auction Ends..</h4>
									<div className="pl-1" onClick={_showInfoUpdatingAuction}>
										<IconInfo size={16} className="cursor-pointer hover:opacity-80 -mt-1" />
									</div>
								</div>
							</div>
						)}
						{token.token_series_id !== token.token_id && (
							<div
								className="mt-2 text-center text-white cursor-pointer hover:opacity-80 text-sm"
								size="md"
								variant="ghosts"
								onClick={() => router.push(`/token/${token.contract_id}::${token.token_series_id}`)}
							>
								{localeLn('SeeTokenSeries')}
							</div>
						)}
					</div>
				</div>
			</div>
			<TokenMoreModal
				show={showModal === 'more'}
				onClose={onDismissModal}
				listModalItem={[
					{ name: 'Share to...', onClick: onClickShare },
					!isOwner() && !token.is_staked && { name: 'Offer Via NFT', onClick: onClickOfferNFT },
					isOwner() && !token.is_staked && { name: 'Update Listing', onClick: onClickUpdate },
					isOwner() && !token.is_staked && { name: 'Transfer', onClick: onClickTransfer },
					isOwner() && !token.is_staked && { name: 'Burn Card', onClick: onClickBurn },
					{ name: 'Report', onClick: () => setShowModal('report') },
				].filter((x) => x)}
			/>
			<TokenShareModal show={showModal === 'share'} onClose={onDismissModal} tokenData={token} />
			<TokenUpdatePriceModal
				show={showModal === 'updatePrice'}
				onClose={onDismissModal}
				data={token}
			/>
			<TokenBurnModal show={showModal === 'burn'} onClose={onDismissModal} data={token} />
			<TokenBuyModal show={showModal === 'buy'} onClose={onDismissModal} data={token} />
			<TokenTransferModal show={showModal === 'transfer'} onClose={onDismissModal} data={token} />
			<TokenAuctionBidModal
				show={showModal === 'placeauction'}
				data={token}
				onClose={onDismissModal}
				setShowModal={setShowModal}
			/>
			<AcceptBidAuctionModal
				show={showModal === 'acceptbidauction'}
				data={token}
				onClose={onDismissModal}
				setShowModal={setShowModal}
			/>
			<CancelAuctionModal
				show={showModal === 'removeauction'}
				data={token}
				onClose={onDismissModal}
				setShowModal={setShowModal}
			/>
			<CancelBidModal
				show={showModal === 'cancelbid'}
				data={token}
				onClose={onDismissModal}
				setShowModal={setShowModal}
			/>
			<PlaceOfferModal
				show={showModal === 'placeoffer'}
				data={token}
				onClose={onDismissModal}
				setShowModal={setShowModal}
			/>
			<TradeNFTModal
				show={showModal === 'placeofferNFT'}
				data={token}
				onClose={onDismissModal}
				tokenType={`token`}
			/>
			<ReportModal show={showModal === 'report'} data={token} onClose={onDismissModal} />
			<LoginModal show={showModal === 'notLogin'} onClose={onDismissModal} />
		</div>
	)
}

export default TokenDetail
