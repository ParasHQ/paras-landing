import { useEffect, useState } from 'react'
import { Blurhash } from 'react-blurhash'
import Scrollbars from 'react-custom-scrollbars'
import { useRouter } from 'next/router'

import Button from 'components/Common/Button'
import { IconDots } from 'components/Icons'
import TabInfo from 'components/Tabs/TabInfo'
import TabOwners from 'components/Tabs/TabOwners'

import TokenBuyModal from 'components/Modal/TokenBuyModal'
import { capitalize, parseImgUrl, prettyBalance } from 'utils/common'
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
import PlaceBidModal from 'components/Modal/PlaceBidModal'
import TabPublication from 'components/Tabs/TabPublication'
import Media from 'components/Common/Media'
import ReportModal from 'components/Modal/ReportModal'
import Card from 'components/Card/Card'
import Tooltip from 'components/Common/Tooltip'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'
import TradeNFTModal from 'components/Modal/TradeNFTModal'
import TabAuction from 'components/Tabs/TabAuction'
import TokenAuctionBidModal from 'components/Modal/TokenAuctionBidModal'
import JSBI from 'jsbi'
import AcceptBidAuctionModal from 'components/Modal/AcceptBidAuctionModal'
import { useToast } from 'hooks/useToast'
import CancelAuctionModal from 'components/Modal/CancelAuctionModal'
import CancelBidModal from 'components/Modal/CancelBidModal'
import { mutate } from 'swr'

const TokenDetail = ({ token, className, isAuctionEnds }) => {
	const [activeTab, setActiveTab] = useState('info')
	const [showModal, setShowModal] = useState(null)
	const [tokenDisplay, setTokenDisplay] = useState('detail')
	const [isEndedTime, setIsEndedTime] = useState(false)
	const currentUser = useStore((state) => state.currentUser)
	const { localeLn } = useIntl()
	const store = useStore()
	const router = useRouter()
	const toast = useToast()

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
							<>
								{token?.metadata?.animation_url ? (
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
									/>
								)}
							</>
						) : (
							<div className="w-1/2 h-full md:w-full m-auto flex items-center">
								<Card
									imgUrl={parseImgUrl(token.metadata.media, null, {
										width: `600`,
										useOriginal: process.env.APP_ENV === 'production' ? false : true,
										isMediaCdn: token.isMediaCdn,
									})}
									audioUrl={token.metadata?.animation_url}
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
					<Scrollbars
						className="h-full"
						universal={true}
						renderView={(props) => <div {...props} id="activityListScroll" className="p-4" />}
					>
						<div>
							<div className="flex justify-between">
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
										{token.metadata.title}
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
							<div className="flex mt-3 overflow-x-scroll space-x-4 flex-grow relative overflow-scroll flex-nowrap disable-scrollbars md:-mb-4">
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
										<svg
											className="cursor-pointer hover:opacity-80 -mt-1"
											width="16"
											height="16"
											viewBox="0 0 16 16"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8ZM14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8ZM7 10V9.5C7 8.28237 7.42356 7.68233 8.4 6.95C8.92356 6.55733 9 6.44904 9 6C9 5.44772 8.55229 5 8 5C7.44772 5 7 5.44772 7 6H5C5 4.34315 6.34315 3 8 3C9.65685 3 11 4.34315 11 6C11 7.21763 10.5764 7.81767 9.6 8.55C9.07644 8.94267 9 9.05096 9 9.5V10H7ZM9.00066 11.9983C9.00066 12.5506 8.55279 12.9983 8.00033 12.9983C7.44786 12.9983 7 12.5506 7 11.9983C7 11.4461 7.44786 10.9983 8.00033 10.9983C8.55279 10.9983 9.00066 11.4461 9.00066 11.9983Z"
												fill="rgb(243, 244, 246)"
											/>
										</svg>
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
			<PlaceBidModal
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
