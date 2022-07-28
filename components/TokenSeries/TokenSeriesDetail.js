import { Suspense, useEffect, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { formatNearAmount } from 'near-api-js/lib/utils/format'

import Button from 'components/Common/Button'
import { IconDots, IconLoader } from 'components/Icons'
import TabInfo from 'components/Tabs/TabInfo'
import TabOwners from 'components/Tabs/TabOwners'

import { capitalize, parseImgUrl, abbrNum, prettyTruncate } from 'utils/common'
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
import PlaceOfferModal from 'components/Modal/PlaceOfferModal'
import TabPublication from 'components/Tabs/TabPublication'
import ReportModal from 'components/Modal/ReportModal'
import Card from 'components/Card/Card'
import { useRouter } from 'next/router'
import TradeNFTModal from 'components/Modal/TradeNFTModal'
import IconLove from 'components/Icons/component/IconLove'
import axios from 'axios'
import WalletHelper from 'lib/WalletHelper'
import { mutate } from 'swr'
import { Canvas } from '@react-three/fiber'
import { Model1 } from 'components/Model3D/ThreeDModel'
import FileType from 'file-type/browser'
import { trackLikeToken, trackUnlikeToken } from 'lib/ga'

const TokenSeriesDetail = ({ token, className, isAuctionEnds }) => {
	const router = useRouter()
	const [activeTab, setActiveTab] = useState('info')
	const [showModal, setShowModal] = useState('creatorTransfer')
	const [isLiked, setIsLiked] = useState(false)
	const [defaultLikes, setDefaultLikes] = useState(0)
	const currentUser = useStore((state) => state.currentUser)
	const { localeLn } = useIntl()
	const changeActiveTab = (tab) => {
		setActiveTab(tab)
	}
	const [tokenDisplay, setTokenDisplay] = useState('detail')
	const [isEnableTrade, setIsEnableTrade] = useState(true)
	const [threeDUrl, setThreeDUrl] = useState('')
	const [showLove, setShowLove] = useState(false)
	const [fileType, setFileType] = useState(token?.metadata?.mime_type)

	useEffect(() => {
		if (!process.env.WHITELIST_CONTRACT_ID.split(';').includes(token?.contract_id)) {
			setIsEnableTrade(false)
		}
	}, [])

	useEffect(() => {
		setActiveTab('info')
		setTokenDisplay('detail')
	}, [router.query.id])

	useEffect(() => {
		if (token?.total_likes) {
			if (token.likes) {
				setIsLiked(true)
			}

			setDefaultLikes(token?.total_likes)
		}
		if (token?.metadata?.animation_url && token.metadata?.mime_type?.includes('model')) {
			get3DModel(token?.metadata?.animation_url)
		}
		if (token?.metadata?.animation_url && token.metadata?.mime_type?.includes('audio')) {
			getAudio(token?.metadata?.animation_url)
		}
		if (token?.metadata?.animation_url && token.metadata?.mime_type?.includes('iframe')) {
			getIframe()
		}
	}, [JSON.stringify(token)])

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
			return (
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
		if (res.status !== 200) {
			setIsLiked(true)
			setDefaultLikes(defaultLikes + 1)
			return
		}

		trackUnlikeToken(`${contract_id}::${token_series_id}`, source)
	}

	const get3DModel = async (url) => {
		const resp = await axios.get(`${parseImgUrl(url, undefined)}`, {
			responseType: `blob`,
		})
		const fileType = await FileType.fromBlob(resp.data)
		setFileType(fileType.mime)
		const objectUrl = URL.createObjectURL(resp.data)
		setThreeDUrl(objectUrl)
	}

	const onDoubleClickDetail = () => {
		if (currentUser) {
			setShowLove(true)
			!isLiked && likeToken(token.contract_id, token.token_series_id, 'double_click_detail')
			setTimeout(() => setShowLove(false), 1000)
		}
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
							<div className="relative w-full h-full" onDoubleClick={onDoubleClickDetail}>
								{token?.metadata.animation_url ? (
									<>
										{fileType && fileType.includes('audio') && (
											<div className="max-h-80 md:max-h-72 lg:max-h-96 w-full mx-2 md:mx-0">
												<div className="w-1/2 md:w-full h-full m-auto">
													<Media
														className="rounded-lg overflow-hidden max-h-80 md:max-h-72 lg:max-h-96"
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
										{fileType && fileType.includes('model') && threeDUrl && (
											<Suspense
												fallback={
													<div className="flex items-center justify-center w-full h-full">
														<IconLoader />
													</div>
												}
											>
												<Canvas>
													<Model1 threeDUrl={threeDUrl} />
												</Canvas>
											</Suspense>
										)}
										{fileType && fileType.includes('iframe') && (
											<iframe
												src={token?.metadata.animation_url}
												sandbox="allow-scripts"
												className="object-contain w-full h-5/6 md:h-full"
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
										videoPadding={true}
										mimeType={token?.metadata?.mime_type}
										seeDetails={true}
										isMediaCdn={token?.isMediaCdn}
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
					<div className="justify-between md:p-4 md:pb-2 hidden md:flex">
						<div>
							<div className="flex justify-between items-center">
								<p className="text-gray-300">
									{localeLn('SERIES')} {'// '}
									{token.metadata.copies ? `Edition of ${token.metadata.copies}` : `Open Edition`}
								</p>
							</div>

							<h1 className="mt-2 text-xl md:text-2xl font-bold text-white tracking-tight pr-4 break-all">
								{prettyTruncate(token.metadata.title, 28)}
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
							<div className="justify-between py-2 flex md:hidden">
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
										{prettyTruncate(token.metadata.title, 26)}
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
								</div>
							</div>
							<div className="bg-gray-700 flex md:sticky md:top-0 overflow-x-scroll space-x-4 flex-grow z-30 flex-nowrap disable-scrollbars md:-mb-4">
								{tabDetail('info')}
								{tabDetail('owners')}
								{tabDetail('offers')}
								{tabDetail('history')}
								{tabDetail('publication')}
							</div>
							{activeTab === 'info' && <TabInfo localToken={token} />}
							{activeTab === 'owners' && (
								<TabOwners localToken={token} isAuctionEnds={isAuctionEnds} />
							)}
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
			<PlaceOfferModal
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
