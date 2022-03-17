import { useEffect, useState } from 'react'
import { Blurhash } from 'react-blurhash'
import Scrollbars from 'react-custom-scrollbars'
import { useRouter } from 'next/router'

import Button from 'components/Common/Button'
import { IconDots } from 'components/Icons'
import TabInfo from 'components/Tabs/TabInfo'
import TabOwners from 'components/Tabs/TabOwners'

import TokenBuyModal from 'components/Modal/TokenBuyModal'
import { capitalize, parseImgUrl } from 'utils/common'
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

const TokenDetail = ({ token, className }) => {
	const [activeTab, setActiveTab] = useState('info')
	const [showModal, setShowModal] = useState(null)
	const [tokenDisplay, setTokenDisplay] = useState('detail')
	const currentUser = useStore((state) => state.currentUser)
	const { localeLn } = useIntl()
	const router = useRouter()

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

	const onClickBurn = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('burn')
	}

	const onClickOffer = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('placeoffer')
	}

	const isOwner = () => {
		if (!currentUser) {
			return false
		}
		return currentUser === token.owner_id
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
										className="cursor-pointer"
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
												className="bg-white mt-2 text-primary font-bold rounded-full px-2 text-xs"
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
								{tabDetail('owners')}
								{tabDetail('offers')}
								{tabDetail('history')}
								{tabDetail('publication')}
							</div>

							{activeTab === 'info' && <TabInfo localToken={token} isNFT={true} />}
							{activeTab === 'owners' && <TabOwners localToken={token} />}
							{activeTab === 'offers' && <TabOffers localToken={token} />}
							{activeTab === 'history' && <TabHistory localToken={token} />}
							{activeTab === 'publication' && <TabPublication localToken={token} />}
						</div>
					</Scrollbars>
					<div className="p-3">
						{token.owner_id === currentUser &&
							(token.is_staked ? (
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
							))}
						{token.owner_id !== currentUser && token.price && (
							<div className="flex space-x-2">
								<Button size="md" onClick={onClickBuy} isFullWidth>
									{localeLn('Buy')}
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
			<PlaceBidModal show={showModal === 'placeoffer'} data={token} onClose={onDismissModal} />
			<ReportModal show={showModal === 'report'} data={token} onClose={onDismissModal} />
			<LoginModal show={showModal === 'notLogin'} onClose={onDismissModal} />
		</div>
	)
}

export default TokenDetail
