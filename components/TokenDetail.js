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
// import TabHistory from 'components/Tabs/TabHistory'

import TokenBuyModal from 'components/Modal/TokenBuyModal'
// import TokenMoreModal from 'components/Modal/TokenMoreModal'
// import TokenShareModal from 'components/Modal/TokenShareModal'
// import TokenDetailUpdateModal from 'components/Modal/TokenDetailUpdateModal'
import TokenType from './Card'
// import useStore from 'lib/store'
// import LoginModal from 'components/Modal/LoginModal'
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

const STORAGE_FEE = 8590000000000000000000

const TokenDetail = ({ token, metadata, className }) => {
	console.log(token)

	const [activeTab, setActiveTab] = useState('info')
	const [showModal, setShowModal] = useState(null)
	const [needDeposit, setNeedDeposit] = useState(true)
	const router = useRouter()
	const { currentUser } = useStore()

	console.log(currentUser)

	useEffect(() => {
		if (near.wallet.account) {
			checkStorageBalance()
		}
	}, [near.wallet])

	const checkStorageBalance = async () => {
		console.log(token)
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
					JSBI.BigInt(STORAGE_FEE)
				)

				console.log(currentStorage, usedStorage.toString())
				if (JSBI.greaterThanOrEqual(JSBI.BigInt(currentStorage), usedStorage)) {
					console.log('masih ada')
					setNeedDeposit(false)
				}
			} else {
				setNeedDeposit(false)
			}
		} catch (err) {
			console.log(err)
		}
	}

	// const isOwned = useStore((state) => state.isOwned)
	// const fetchOwned = useStore((state) => state.fetchOwned)

	// useEffect(() => {
	// 	fetchOwned(token.token_type)
	// }, [fetchOwned, token.token_type])

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
		setShowModal('confirmBuy')
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

	const onClickRead = () => {
		router.push({
			pathname: `/viewer/${token.comic_id}/${token.chapter_id}`,
		})
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
			<div
				className="flex flex-col lg:flex-row"
				style={{
					height: `85vh`,
				}}
			>
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
				<div className="h-1/2 lg:h-full flex flex-col w-full md:w-2/5 max-w-2xl">
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
							<div className="flex">
								<Button
									onClick={() => {
										console.log(needDeposit)
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
								<Button onClick={onClickTransfer} isFullWidth>
									Transfer
								</Button>
							</div>
						)}
						{token.owner_id !== currentUser && token.price && (
							<div className="flex">
								<Button
									onClick={() => {
										setShowModal('buy')
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
