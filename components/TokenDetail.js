import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Blurhash } from 'react-blurhash'
import Scrollbars from 'react-custom-scrollbars'
import { useRouter } from 'next/router'
import { formatNearAmount, parseNearAmount } from 'near-api-js/lib/utils/format'

import Button from 'components/Common/Button'
import { IconDots } from 'components/Icons'
import TabInfo from 'components/Tabs/TabInfo'
import TabOwners from 'components/Tabs/TabOwners'

import TokenBuyModal from 'components/Modal/TokenBuyModal'
import near from 'lib/near'
import { parseImgUrl } from '../utils/common'
import TokenMoreModal from './Modal/TokenMoreModal'
import TokenShareModal from './Modal/TokenShareModal'
import TokenUpdatePriceModal from './Modal/TokenUpdatePriceModal'
import JSBI from 'jsbi'
import TokenStorageModal from './Modal/TokenStorageModal'
import TokenBurnModal from './Modal/TokenBurnModal'
import TokenTransferModal from './Modal/TokenTransferModal'
import useStore from 'lib/store'
import { STORAGE_ADD_MARKET_FEE } from 'config/constants'

const TokenDetail = ({ token, className }) => {
	const [activeTab, setActiveTab] = useState('info')
	const [showModal, setShowModal] = useState(null)
	const [needDeposit, setNeedDeposit] = useState(true)
	const { currentUser } = useStore()

	useEffect(() => {
		if (currentUser) {
			setTimeout(() => {
				checkStorageBalance()
			}, 250)
		}
	}, [currentUser])

	const checkStorageBalance = async () => {
		try {
			if (!token.approval_id) {
				const currentStorage = await near.wallet
					.account()
					.viewFunction(
						process.env.MARKETPLACE_CONTRACT_ID,
						`storage_balance_of`,
						{
							account_id: currentUser,
						}
					)

				const supplyPerOwner = await near.wallet
					.account()
					.viewFunction(
						process.env.MARKETPLACE_CONTRACT_ID,
						`get_supply_by_owner_id`,
						{
							account_id: currentUser,
						}
					)

				const usedStorage = JSBI.multiply(
					JSBI.BigInt(parseInt(supplyPerOwner) + 1),
					JSBI.BigInt(STORAGE_ADD_MARKET_FEE)
				)

				if (JSBI.greaterThanOrEqual(JSBI.BigInt(currentStorage), usedStorage)) {
					setNeedDeposit(false)
				}
			} else {
				setNeedDeposit(false)
			}
		} catch (err) {
			console.log(err)
		}
	}

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

	const onClickMint = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('confirmMint')
	}

	const onClickBurn = () => {
		if (!currentUser) {
			setShowModal('notLogin')
			return
		}
		setShowModal('burn')
	}

	const isOwner = () => {
		if (!currentUser) {
			return false
		}
		return currentUser === token.owner_id
	}

	const getCreatorId = () => {
		return token.metadata.creator_id || token.contract_id
	}

	return (
		<div className={`m-auto ${className}`}>
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
											NFT // #{token.edition_id} of {token.metadata.copies}
										</p>
									</div>

									<h1 className="mt-2 text-xl md:text-2xl font-bold text-white tracking-tight pr-4 break-all">
										{token.metadata.title}
									</h1>
									<p className="mt-1 text-white">
										by{' '}
										<span className="font-semibold">
											<Link href={`/${getCreatorId()}`}>
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

							{activeTab === 'info' && (
								<TabInfo localToken={token} isNFT={true} />
							)}
							{activeTab === 'owners' && <TabOwners localToken={token} />}
							{activeTab === 'history' && <TabHistory localToken={token} />}
						</div>
					</Scrollbars>
					<div className="p-3">
						{token.owner_id === currentUser && (
							<div className="flex flex-wrap">
								<div className="w-full lg:w-1/2">
									<Button
										size="md"
										onClick={() => {
											if (needDeposit) {
												setShowModal('storage')
											} else {
												setShowModal('updatePrice')
											}
										}}
										isFullWidth
									>
										Update Listing
									</Button>
								</div>
								<div className="w-full lg:w-1/2 mt-4 lg:mt-0">
									<Button size="md" onClick={onClickTransfer} isFullWidth>
										Transfer
									</Button>
								</div>
							</div>
						)}
						{token.owner_id !== currentUser && token.price && (
							<div className="flex">
								<Button
									size="md"
									onClick={() => {
										onClickBuy()
									}}
									isFullWidth
								>
									Buy
								</Button>
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
					isOwner() && { name: 'Update Listing', onClick: onClickUpdate },
					isOwner() && { name: 'Transfer', onClick: onClickTransfer },
					isOwner() && { name: 'Burn Card', onClick: onClickBurn },
				].filter((x) => x)}
			/>
			<TokenShareModal show={showModal === 'share'} onClose={onDismissModal} />
			<TokenUpdatePriceModal
				show={showModal === 'updatePrice'}
				onClose={onDismissModal}
				data={token}
			/>
			<TokenStorageModal
				show={showModal === 'storage'}
				onClose={onDismissModal}
				data={token}
			/>
			<TokenBurnModal
				show={showModal === 'burn'}
				onClose={onDismissModal}
				data={token}
			/>
			<TokenBuyModal
				show={showModal === 'buy'}
				onClose={onDismissModal}
				data={token}
			/>
			<TokenTransferModal
				show={showModal === 'transfer'}
				onClose={onDismissModal}
				data={token}
			/>
			{/* <LoginModal show={showModal === 'notLogin'} onClose={onDismissModal} /> */}
		</div>
	)
}

export default TokenDetail
