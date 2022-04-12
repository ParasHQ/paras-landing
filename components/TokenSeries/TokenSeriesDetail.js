import { useEffect, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { formatNearAmount } from 'near-api-js/lib/utils/format'

import Button from 'components/Common/Button'
import { IconDots } from 'components/Icons'
import TabInfo from 'components/Tabs/TabInfo'
import TabOwners from 'components/Tabs/TabOwners'

import { capitalize, parseImgUrl, prettyBalance } from 'utils/common'
import TokenSeriesTransferBuyer from '../Modal/TokenSeriesTransferBuyer'
import TokenSeriesUpdatePriceModal from '../Modal/TokenSeriesUpdatePriceModal'
import TokenSeriesBuyModal from '../Modal/TokenSeriesBuyModal'
import TokenMoreModal from '../Modal/TokenMoreModal'
import TokenSeriesMintModal from '../Modal/TokenSeriesMintModal'
import TokenShareModal from '../Modal/TokenShareModal'
import useStore from 'lib/store'
import TabHistory from '../Tabs/TabHistory'
import TokenSeriesBurnModal from '../Modal/TokenSeriesBurnModal'
import { Blurhash } from 'react-blurhash'
import LoginModal from '../Modal/LoginModal'
import ArtistVerified from '../Common/ArtistVerified'
import ArtistBanned from '../Common/ArtistBanned'
import Media from '../Common/Media'
import { useIntl } from 'hooks/useIntl'
import TabOffers from 'components/Tabs/TabOffers'
import PlaceBidModal from 'components/Modal/PlaceBidModal'
import TabPublication from 'components/Tabs/TabPublication'
import ReportModal from 'components/Modal/ReportModal'
import Card from 'components/Card/Card'
import { useRouter } from 'next/router'
import TradeNFTModal from 'components/Modal/TradeNFTModal'
import TabAuction from 'components/Tabs/TabAuction'
import JSBI from 'jsbi'
import TokenAuctionBidModal from 'components/Modal/TokenAuctionBidModal'
import { useToast } from 'hooks/useToast'

const TokenSeriesDetail = ({ token, className, isAuctionEnds }) => {
	const [activeTab, setActiveTab] = useState('info')
	const [showModal, setShowModal] = useState('creatorTransfer')
	const currentUser = useStore((state) => state.currentUser)
	const { localeLn } = useIntl()
	const changeActiveTab = (tab) => {
		setActiveTab(tab)
	}
	const [tokenDisplay, setTokenDisplay] = useState('detail')
	const [isEnableTrade, setIsEnableTrade] = useState(true)

	const price = token.token?.amount ? token.token?.amount : token.lowest_price || token.price

	useEffect(() => {
		if (!process.env.WHITELIST_CONTRACT_ID.split(';').includes(token?.contract_id)) {
			setIsEnableTrade(false)
		}
	}, [])

	const store = useStore()
	const router = useRouter()
	const toast = useToast()

	const isShowButton =
		token.contract_id === process.env.NFT_CONTRACT_ID ||
		process.env.WHITELIST_CONTRACT_ID.split(',').includes(token.contract_id)

	const disableOfferContract = (process.env.DISABLE_OFFER_CONTRACT_ID || '')
		.split(',')
		.includes(token.contract_id)

	const _showInfoUpdatingAuction = () => {
		toast.show({
			text: (
				<div className="text-sm text-white">
					<p>This auction data is being updated, please refresh the page periodically</p>
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

	const tabDetail = (tab) => {
		return (
			<div
				className={`cursor-pointer relative text-center ${
					activeTab === tab
						? 'text-gray-100 border-b-2 border-white font-semibold'
						: 'hover:bg-opacity-15 text-gray-100'
				}`}
				onClick={() => changeActiveTab(tab)}
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

	const onClickUpdatePrice = () => {
		setShowModal('updatePrice')
	}

	const onClickAuction = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('placeauction')
	}

	const onClickBuy = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('confirmBuy')
	}

	const onClickMint = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('confirmMint')
	}

	const onClickDecreaseCopies = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('decreaseCopies')
	}

	const onClickBuyerTransfer = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('buyerTransfer')
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

	const isCreator = () => {
		if (!currentUser) {
			return false
		}
		return (
			currentUser === token.metadata.creator_id ||
			(!token.metadata.creator_id && currentUser === token.contract_id)
		)
	}

	const checkNextPriceBid = () => {
		const currentBid = Number(token.token?.amount ? token.token?.amount : price)
		const multipleBid = (currentBid / 100) * 5
		const nextBid = currentBid + multipleBid
		const totalNextBid = prettyBalance(nextBid, 24, 2)
		return totalNextBid
	}

	const isCurrentBid = () => {
		let bidder = []
		token?.token?.bidder_list?.map((item) => {
			bidder.push(item.bidder)
		})
		const currentBid = bidder.reverse()

		return currentBid[0]
	}

	const tokenSeriesButton = () => {
		// For external contract
		if (!isShowButton) {
			return (
				<Button size="md" onClick={() => changeActiveTab('owners')} isFullWidth>
					{localeLn('CheckOwners')}
				</Button>
			)
		}

		if (token.is_non_mintable || token.total_mint === token.metadata.copies) {
			return !token.token?.is_auction && isAuctionEnds ? (
				<div className="flex space-x-2">
					<Button size="md" onClick={() => changeActiveTab('owners')} isFullWidth>
						{localeLn('CheckOwners')}
					</Button>
					{!disableOfferContract && (
						<Button size="md" onClick={onClickOffer} isFullWidth variant="secondary">
							{`Place an offer`}
						</Button>
					)}
				</div>
			) : !isAuctionEnds ? (
				<div className="flex justify-center items-center gap-2 text-white text-center mt-2 rounded-md p-2">
					<svg
						className="animate-spin -mt-1 h-4 w-4 text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
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
			) : (
				<div className="flex justify-between items-center gap-2">
					<div className="flex items-baseline space-x-1 md:pl-2">
						<div>
							<p className="font-thin text-white text-xs">Next Bid</p>
							<div className="flex items-center gap-1">
								<div className="truncate text-white text-base font-bold">{`${checkNextPriceBid()} Ⓝ`}</div>
								{price !== '0' && store.nearUsdPrice !== 0 && (
									<div className="text-[9px] text-gray-400 truncate mt-1">
										~ $
										{prettyBalance(
											JSBI.BigInt(token?.token?.amount ? token?.token?.amount : price) *
												store.nearUsdPrice,
											24,
											2
										)}
									</div>
								)}
							</div>
						</div>
					</div>
					{token?.token.owner_id === currentUser &&
					token.token?.bidder_list &&
					token.token?.is_auction &&
					!isAuctionEnds ? (
						<Button size="md" className="px-14" onClick={'acceptbidauction'}>
							{`Accept Bid`}
						</Button>
					) : isCurrentBid() === currentUser ? (
						<Button size="md" isFullWidth variant="primary" isDisabled>
							{`You are currently bid`}
						</Button>
					) : token?.token.owner_id === currentUser &&
					  !token.token?.bidder_list &&
					  token.token?.is_auction &&
					  !isAuctionEnds ? (
						<Button size="md" className="px-14" isDisabled>
							{`No bid yet`}
						</Button>
					) : (
						<Button size="md" onClick={onClickAuction} className="px-14">
							{`Place a Bid`}
						</Button>
					)}
				</div>
			)
		} else if (isCreator()) {
			return (
				<div className="flex flex-wrap space-x-4">
					<div className="w-full flex-1">
						<Button size="md" onClick={onClickMint} isFullWidth>
							{localeLn('Mint')}
						</Button>
					</div>
					<div className="w-full flex-1">
						<Button size="md" onClick={onClickUpdatePrice} isFullWidth>
							{localeLn('UpdatePrice')}
						</Button>
					</div>
				</div>
			)
		} else if (token.price) {
			return (
				<>
					<div className="flex space-x-2">
						<Button size="md" onClick={onClickBuy} isFullWidth>
							{token.price === '0' ? 'Free' : `Buy for ${formatNearAmount(token.price)} Ⓝ`}
						</Button>
						{!disableOfferContract && (
							<Button size="md" onClick={onClickOffer} isFullWidth variant="secondary">
								{`Place an offer`}
							</Button>
						)}
					</div>
					{token.lowest_price &&
						parseFloat(formatNearAmount(token.price)) >
							parseFloat(formatNearAmount(token.lowest_price)) && (
							<Button
								size="md"
								className="mt-2"
								variant="secondary"
								onClick={() => setActiveTab('owners')}
								isFullWidth
							>
								{localeLn('BuyFor{price}On', {
									price: formatNearAmount(token.lowest_price),
								})}
							</Button>
						)}
				</>
			)
		} else {
			return (
				<Button size="md" onClick={onClickOffer} isFullWidth variant="secondary">
					{`Place an offer`}
				</Button>
			)
		}
	}

	return (
		<div className={`m-auto rounded-lg overflow-hidden ${className}`}>
			<div className="flex flex-col lg:flex-row h-90vh lg:h-80vh" style={{ background: '#202124' }}>
				<div className="w-full h-1/2 lg:h-full lg:w-3/5 relative">
					<div className="absolute inset-0 opacity-75 z-0">
						{token.metadata.blurhash && (
							<Blurhash
								hash={token.metadata.blurhash}
								width={`100%`}
								height={`100%`}
								resolutionX={32}
								resolutionY={32}
								punch={1}
							/>
						)}
					</div>
					<div className="w-full h-full flex items-center justify-center p-2 lg:p-12 relative z-10 ">
						{tokenDisplay === 'detail' ? (
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
							/>
						) : (
							<div className="w-1/2 h-full md:w-full m-auto flex items-center">
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
						renderView={(props) => <div {...props} id="TokenScroll" className="p-4" />}
					>
						<div>
							<div className="flex justify-between">
								<div>
									<div className="flex justify-between items-center">
										<p className="text-gray-300">
											{localeLn('SERIES')} {'// '}
											{token.metadata.copies
												? `Edition of ${token.metadata.copies}`
												: `Open Edition`}
										</p>
									</div>

									<h1 className="mt-2 text-xl md:text-2xl font-bold text-white tracking-tight pr-4 break-all">
										{token.metadata.title}
									</h1>
									<div className="mt-1 text-white flex">
										<p className="mr-1">by</p>
										<ArtistVerified token={token} />
									</div>
								</div>
								<div>
									<IconDots
										color="#ffffff"
										className="cursor-pointer"
										onClick={() => setShowModal('more')}
									/>
								</div>
							</div>
							<div className="flex mt-3 overflow-x-scroll space-x-4 flex-grow relative flex-nowrap disable-scrollbars md:-mb-4">
								{tabDetail('info')}
								{token?.token?.is_auction && isAuctionEnds && tabDetail('auction')}
								{tabDetail('owners')}
								{(!token?.token?.is_auction || !isAuctionEnds) && tabDetail('offers')}
								{tabDetail('history')}
								{tabDetail('publication')}
							</div>
							{activeTab === 'info' && <TabInfo localToken={token} />}
							{activeTab === 'auction' && <TabAuction localToken={token?.token} />}
							{activeTab === 'owners' && <TabOwners localToken={token} />}
							{activeTab === 'offers' && <TabOffers localToken={token} />}
							{activeTab === 'history' && <TabHistory localToken={token} />}
							{activeTab === 'publication' && <TabPublication localToken={token} />}
						</div>
					</Scrollbars>
					<div className="p-3">{tokenSeriesButton()}</div>
				</div>
			</div>
			<TokenSeriesBuyModal
				show={showModal === 'confirmBuy'}
				onClose={onDismissModal}
				data={token}
			/>
			<TokenSeriesMintModal
				show={showModal === 'confirmMint'}
				onClose={onDismissModal}
				data={token}
			/>
			<TokenSeriesUpdatePriceModal
				show={showModal === 'updatePrice'}
				onClose={onDismissModal}
				data={token}
			/>
			<TokenAuctionBidModal
				show={showModal === 'placeauction'}
				data={token?.token}
				onClose={onDismissModal}
				setShowModal={setShowModal}
			/>
			<TokenSeriesTransferBuyer
				show={showModal === 'buyerTransfer'}
				onClose={onDismissModal}
				data={token}
			/>
			<TokenSeriesBurnModal
				show={showModal === 'decreaseCopies'}
				onClose={onDismissModal}
				data={token}
			/>
			<TokenMoreModal
				show={showModal === 'more'}
				onClose={onDismissModal}
				listModalItem={[
					{ name: 'Share to...', onClick: onClickShare },
					isEnableTrade && {
						name: 'Offer Via NFT',
						onClick: onClickOfferNFT,
					},
					{ name: 'Transfer', onClick: onClickBuyerTransfer },
					isCreator() && { name: 'Reduce Copies', onClick: onClickDecreaseCopies },
					{ name: 'Report', onClick: () => setShowModal('report') },
				].filter((x) => x)}
			/>
			<TokenShareModal show={showModal === 'share'} onClose={onDismissModal} tokenData={token} />
			<PlaceBidModal
				show={showModal === 'placeoffer'}
				data={token}
				onClose={onDismissModal}
				tokenType={`tokenSeries`}
			/>
			<TradeNFTModal
				show={showModal === 'placeofferNFT'}
				data={token}
				onClose={onDismissModal}
				tokenType={`tokenSeries`}
				setShowModal={setShowModal}
			/>
			<ReportModal show={showModal === 'report'} data={token} onClose={onDismissModal} />
			<LoginModal show={showModal === 'notLogin'} onClose={onDismissModal} />
		</div>
	)
}

export default TokenSeriesDetail
