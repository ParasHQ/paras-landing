import Link from 'next/link'
import { useState } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'

import Button from 'components/Common/Button'
import { IconDots } from 'components/Icons'
import TabInfo from 'components/Tabs/TabInfo'
import TabOwners from 'components/Tabs/TabOwners'

import { parseImgUrl } from '../utils/common'
import TokenSeriesTransferBuyer from './Modal/TokenSeriesTransferBuyer'
import TokenSeriesUpdatePriceModal from './Modal/TokenSeriesUpdatePriceModal'
import TokenSeriesBuyModal from './Modal/TokenSeriesBuyModal'
import TokenMoreModal from './Modal/TokenMoreModal'
import TokenSeriesMintModal from './Modal/TokenSeriesMintModal'
import TokenShareModal from './Modal/TokenShareModal'
import useStore from 'lib/store'
import TabHistory from './Tabs/TabHistory'
import TokenSeriesBurnModal from './Modal/TokenSeriesBurnModal'

const CardDetail = ({ token, className }) => {
	const [activeTab, setActiveTab] = useState('info')
	const [showModal, setShowModal] = useState('creatorTransfer')
	const { currentUser } = useStore()

	const changeActiveTab = (tab) => {
		setActiveTab(tab)
	}

	const tabDetail = (tab) => {
		return (
			<div
				className={`cursor-pointer relative text-center overflow-hidden ${
					activeTab === tab
						? 'text-gray-100 border-b-2 border-white font-semibold'
						: 'hover:bg-opacity-15 text-gray-100'
				}`}
				onClick={() => changeActiveTab(tab)}
			>
				<div className="capitalize">{tab}</div>
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

	const isCreator = () => {
		if (!currentUser) {
			return false
		}
		return (
			currentUser === token.metadata.creator_id ||
			(!token.metadata.creator_id && currentUser === token.contract_id)
		)
	}

	const getCreatorId = () => {
		return token.metadata.creator_id || token.contract_id
	}

	return (
		<div className={`m-auto bg-dark-primary-1 rounded-lg ${className}`}>
			<div className="flex flex-col lg:flex-row h-90vh lg:h-80vh">
				<div className="w-full h-1/2 lg:h-full">
					<div className="w-full h-full flex items-center justify-center p-2 lg:p-8">
						<img
							className="object-contain w-full h-full"
							src={parseImgUrl(token.metadata.media, null, {
								useOriginal: true,
							})}
						/>
					</div>
				</div>
				<div className="h-1/2 lg:h-full flex flex-col w-full lg:w-7/12 lg:max-w-2xl bg-dark-primary-6">
					<Scrollbars
						className="h-full"
						universal={true}
						renderView={(props) => (
							<div {...props} id="activityListScroll" className="p-4" />
						)}
					>
						<div>
							<div className="flex justify-between">
								<div>
									<div className="flex justify-between items-center">
										<p className="text-gray-300">
											SERIES //{' '}
											{token.metadata.copies
												? `Edition of ${token.metadata.copies}`
												: `Open Edition`}
										</p>
									</div>

									<h1 className="mt-2 text-xl md:text-2xl font-bold text-white tracking-tight pr-4 break-all">
										{token.metadata.title}
									</h1>
									<p className="mt-1 text-white">
										by{' '}
										<span className="font-semibold">
											<Link href={`/${getCreatorId()}}`}>
												<a className="text-white font-semibold border-b-2 border-transparent hover:border-white">
													{getCreatorId()}
												</a>
											</Link>
										</span>
									</p>
								</div>
								<div>
									<IconDots
										color="#ffffff"
										className="cursor-pointer"
										onClick={() => setShowModal('more')}
									/>
								</div>
							</div>
							<div className="flex mt-3 space-x-4">
								{tabDetail('info')}
								{tabDetail('owners')}
								{tabDetail('history')}
							</div>
							{activeTab === 'info' && <TabInfo localToken={token} />}
							{activeTab === 'owners' && <TabOwners localToken={token} />}
							{activeTab === 'history' && <TabHistory localToken={token} />}
						</div>
					</Scrollbars>
					<div className="p-3">
						{token.is_non_mintable ? (
							<div>
								<Button
									size="md"
									onClick={() => changeActiveTab('owners')}
									isFullWidth
								>
									Check Owners
								</Button>
							</div>
						) : isCreator() ? (
							<div className="flex flex-wrap space-x-4">
								<div className="w-full flex-1">
									<Button size="md" onClick={onClickMint} isFullWidth>
										Mint
									</Button>
								</div>
								<div className="w-full flex-1">
									<Button size="md" onClick={onClickUpdatePrice} isFullWidth>
										Update Price
									</Button>
								</div>
							</div>
						) : token.price ? (
							<Button size="md" onClick={onClickBuy} isFullWidth>
								{token.price === '0'
									? 'Free'
									: `Buy for ${formatNearAmount(token.price)} Ⓝ`}
							</Button>
						) : (
							<Button size="md" isFullWidth>
								Not for Sale
							</Button>
						)}
					</div>
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
					{ name: 'Transfer', onClick: onClickBuyerTransfer },
					isCreator()
						? { name: 'Reduce Copies', onClick: onClickDecreaseCopies }
						: null,
				].filter((x) => x)}
			/>
			<TokenShareModal
				show={showModal === 'share'}
				onClose={onDismissModal}
				tokenData={token}
			/>
			{/* <TokenDetailUpdateModal
				show={showModal === 'update'}
				onClose={onDismissModal}
			/>
			<LoginModal show={showModal === 'notLogin'} onClose={onDismissModal} /> */}
		</div>
	)
}

export default CardDetail
