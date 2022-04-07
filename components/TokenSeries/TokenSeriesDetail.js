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

const TokenSeriesDetail = ({ token, className }) => {
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

	const isShowButton =
		token.contract_id === process.env.NFT_CONTRACT_ID ||
		process.env.WHITELIST_CONTRACT_ID.split(',').includes(token.contract_id)

	const disableOfferContract = (process.env.DISABLE_OFFER_CONTRACT_ID || '')
		.split(',')
		.includes(token.contract_id)

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
		const totalNextBid = prettyBalance(nextBid, 24, 4)
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
			return !token.token?.is_auction ? (
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
					{token?.token.owner_id === currentUser ? (
						<Button size="md" className="px-14" isDisabled>
							{`Auction on going`}
						</Button>
					) : isCurrentBid() === currentUser ? (
						<Button size="md" isFullWidth variant="primary" isDisabled>
							{`You are currently bid`}
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
								{token?.token?.is_auction && tabDetail('auction')}
								{tabDetail('owners')}
								{!token?.token?.is_auction && tabDetail('offers')}
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
