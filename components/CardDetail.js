import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { Fragment, useEffect, useRef, useState } from 'react'
import Card from './Card'
import Modal from './Modal'
import near from '../lib/near'
import useStore from '../store'
import { parseDate, parseImgUrl, prettyBalance, timeAgo } from '../utils/common'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import JSBI from 'jsbi'
import axios from 'axios'
import { useToast } from '../hooks/useToast'
import {
	FacebookIcon,
	FacebookShareButton,
	TwitterIcon,
	TwitterShareButton,
} from 'react-share'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Blurhash } from 'react-blurhash'
import Scrollbars from 'react-custom-scrollbars'
import useSWR from 'swr'
import getConfig from '../config/near'
import LinkToProfile from './LinkToProfile'
import ReactLinkify from 'react-linkify'
import PublicationPreviewMini from './PublicationPreviewMini'
import TokenInfoCopy from './TokenInfoCopy'
import BidList from './BidList'
import { useRouter } from 'next/router'
import PlaceBidModal from './PlaceBidModal'

const Activity = ({ activity }) => {
	if (activity.type === 'marketUpdate') {
		return (
			<div className="border-2 border-dashed p-2 rounded-md">
				<p>
					<LinkToProfile accountId={activity.from} />
					<span>
						{' '}
						put on sale for {prettyBalance(activity.amount, 24, 4)} Ⓝ
					</span>
				</p>
				<p className="mt-1 text-sm">{timeAgo.format(activity.createdAt)}</p>
			</div>
		)
	}

	if (activity.type === 'marketDelete') {
		return (
			<div className="border-2 border-dashed p-2 rounded-md">
				<p>
					<LinkToProfile accountId={activity.from} />
					<span> remove from sale</span>
				</p>
				<p className="mt-1 text-sm">{timeAgo.format(activity.createdAt)}</p>
			</div>
		)
	}

	if (activity.type === 'marketBuy') {
		return (
			<div className="border-2 border-dashed p-2 rounded-md">
				<p>
					<LinkToProfile accountId={activity.from} />
					<span> bought {activity.quantity}pcs from </span>
					<LinkToProfile accountId={activity.to} />
					<span> for </span>
					{prettyBalance(activity.amount, 24, 4)} Ⓝ
				</p>
				<p className="mt-1 text-sm">{timeAgo.format(activity.createdAt)}</p>
			</div>
		)
	}

	if (activity.type === 'transfer' && activity.from === '') {
		return (
			<div className="border-2 border-dashed p-2 rounded-md">
				<p>
					<LinkToProfile accountId={activity.to} />
					<span> create with supply of {activity.quantity}pcs</span>
				</p>
				<p className="mt-1 text-sm">{timeAgo.format(activity.createdAt)}</p>
			</div>
		)
	}

	if (activity.type === 'transfer' && activity.to === '') {
		return (
			<div className="border-2 border-dashed p-2 rounded-md">
				<p>
					<LinkToProfile accountId={activity.from} />
					<span> burned {activity.quantity}pcs</span>
				</p>
				<p className="mt-1 text-sm">{timeAgo.format(activity.createdAt)}</p>
			</div>
		)
	}

	if (activity.type === 'transfer' && !activity.to) {
		return null
	}

	if (activity.type === 'bidMarketAdd') {
		return (
			<div className="border-2 border-dashed p-2 rounded-md">
				<p>
					<LinkToProfile accountId={activity.accountId} />
					<span> placed offer for </span>
					<span>{prettyBalance(activity.amount, 24, 4)} Ⓝ</span>
				</p>
				<p className="mt-1 text-sm">{timeAgo.format(activity.createdAt)}</p>
			</div>
		)
	}

	return (
		<div className="border-2 border-dashed p-2 rounded-md">
			<p>
				<LinkToProfile accountId={activity.from} />
				<span> transfer {activity.quantity}pcs to </span>
				<LinkToProfile accountId={activity.to} />
			</p>
			<p className="mt-1 text-sm">{timeAgo.format(activity.createdAt)}</p>
		</div>
	)
}

const Ownership = ({ ownership, onBuy, onUpdateListing }) => {
	const store = useStore()

	const fetcher = async (key) => {
		const resp = await axios.get(`${process.env.API_URL}/${key}`)
		if (resp.data.data.results.length > 0) {
			return resp.data.data.results[0]
		} else {
			return {}
		}
	}

	const { data: profile } = useSWR(
		`profiles?accountId=${ownership.ownerId}`,
		fetcher
	)

	return (
		<div className="border-2 border-dashed my-4 p-2 rounded-md">
			<div className="flex items-center justify-between">
				<div className="flex items-center overflow-hidden">
					<Link href={`/${ownership.ownerId}`}>
						<div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden cursor-pointer bg-primary">
							{profile && (
								<img
									className="object-cover"
									src={parseImgUrl(profile.imgUrl)}
								/>
							)}
						</div>
					</Link>
					<div className="px-2">
						<LinkToProfile accountId={ownership.ownerId} len={20} />
					</div>
				</div>
				<div>
					<span className="text-sm text-gray-800">owns </span>
					{ownership.quantity}
				</div>
			</div>
			{ownership.marketData ? (
				<div className="flex justify-between mt-2 items-center text-gray-900">
					<div>
						<p>
							On sale {prettyBalance(ownership.marketData.amount, 24, 4)} Ⓝ{' '}
							<span className="text-gray-800">
								($
								{prettyBalance(
									JSBI.BigInt(ownership.marketData.amount * store.nearUsdPrice),
									24,
									4
								)}
								)
							</span>
						</p>
						<p className="text-sm"></p>
					</div>
					<div>
						{store.currentUser && store.currentUser === ownership.ownerId ? (
							<button
								className="font-semibold w-24 rounded-md bg-primary text-white"
								onClick={onUpdateListing}
							>
								Update
							</button>
						) : (
							<button
								className="font-semibold w-24 rounded-md bg-primary text-white"
								onClick={onBuy}
							>
								Buy
							</button>
						)}
					</div>
				</div>
			) : (
				<div className="flex justify-between mt-2 items-center">
					<div>
						<p className="flex items-center">Not for sale</p>
					</div>
					{store.currentUser && store.currentUser === ownership.ownerId && (
						<button
							className="font-semibold w-24 rounded-md bg-primary text-white"
							onClick={onUpdateListing}
						>
							Update
						</button>
					)}
				</div>
			)}
		</div>
	)
}

const ActivityList = ({ token }) => {
	const [activityList, setActivityList] = useState([])
	const [page, setPage] = useState(0)
	const [isFetching, setIsFetching] = useState(false)
	const [hasMore, setHasMore] = useState(true)

	useEffect(() => {
		if (activityList.length === 0 && hasMore) {
			_fetchData()
		}
	}, [])

	const _fetchData = async () => {
		if (!hasMore || isFetching) {
			return
		}

		setIsFetching(true)
		const res = await axios(
			`${process.env.API_URL}/activities?tokenId=${token.tokenId}&__skip=${
				page * 10
			}&__limit=10`
		)
		const newData = await res.data.data

		const newActivityList = [...activityList, ...newData.results]
		setActivityList(newActivityList)
		setPage(page + 1)
		if (newData.results.length === 0) {
			setHasMore(false)
		} else {
			setHasMore(true)
		}
		setIsFetching(false)
	}

	return (
		<div>
			{activityList.length === 0 && !hasMore && (
				<div className="border-2 border-dashed my-4 p-2 rounded-md text-center">
					<p className="text-gray-300 py-8">No Transactions</p>
				</div>
			)}
			<InfiniteScroll
				dataLength={activityList.length}
				next={_fetchData}
				hasMore={hasMore}
				loader={
					<div className="border-2 border-dashed my-4 p-2 rounded-md text-center">
						<p className="my-2 text-center">Loading...</p>
					</div>
				}
				scrollableTarget="activityListScroll"
			>
				{activityList.map((act, idx) => {
					return (
						<div key={idx} className="mt-4 text-gray-900">
							<Activity activity={act} />
						</div>
					)
				})}
			</InfiniteScroll>
		</div>
	)
}

const CardDetail = ({ token }) => {
	const store = useStore()
	const toast = useToast()
	const router = useRouter()
	const copyLinkRef = useRef()
	const [localToken, setLocalToken] = useState(token)

	const { errors, register, handleSubmit, watch, getValues } = useForm({
		defaultValues: {
			buyQuantity: 1,
		},
	})

	const [activeTab, setActiveTab] = useState(router.query.tab || 'info')
	const [showModal, setShowModal] = useState('')
	const [isComponentMounted, setIsComponentMounted] = useState(false)

	const [isSubmitting, setIsSubmitting] = useState(false)
	const [chosenSeller, setChosenSeller] = useState(null)
	const [isCopied, setIsCopied] = useState(false)

	const [whitelist, setWhitelist] = useState([])
	const [bidMarketData, setBidMarketData] = useState(null)

	useEffect(() => {
		setIsComponentMounted(true)
		_changeSortBy('priceasc')
	}, [])

	useEffect(() => {
		setLocalToken(token)
	}, [token])

	useEffect(async () => {
		if (store.currentUser) {
			try {
				const resUserWhitelist = await near.contract.getUserPurchaseWhitelist({
					tokenId: localToken.tokenId,
					buyerId: store.currentUser,
				})
				const resBidMarketData = await near.contract.getBidMarketData({
					tokenId: localToken.tokenId,
					ownerId: store.currentUser,
				})
				setBidMarketData(resBidMarketData)
				setWhitelist(resUserWhitelist.split('::'))
			} catch (err) {
				console.log(err)
			}
		}
	}, [store.currentUser])

	const _buy = async (data) => {
		setIsSubmitting(true)
		const params = {
			ownerId: chosenSeller.ownerId,
			tokenId: chosenSeller.tokenId,
			quantity: data.buyQuantity,
		}

		if (
			localToken.metadata.collection.includes('card4card') &&
			data.buyQuantity > 1
		) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						You can only buy maximum 1 card
					</div>
				),
				type: 'error',
				duration: 2500,
			})
			setIsSubmitting(false)
			return
		}

		const attachedDeposit = JSBI.multiply(
			JSBI.BigInt(data.buyQuantity),
			JSBI.BigInt(chosenSeller.marketData.amount)
		)

		if (
			JSBI.lessThan(JSBI.BigInt(store.userBalance.available), attachedDeposit)
		) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						Insufficient Balance
						<p className="mt-2">
							Available {prettyBalance(store.userBalance.available, 24, 6)} Ⓝ
						</p>
					</div>
				),
				type: 'error',
				duration: 2500,
			})
			setIsSubmitting(false)
			return
		}

		try {
			await near.contract.buy(
				params,
				'50000000000000',
				attachedDeposit.toString()
			)
		} catch (err) {
			console.log(err)
		}
	}

	const _cancelBid = async () => {
		const params = {
			ownerId: store.currentUser,
			tokenId: localToken.tokenId,
		}
		try {
			await near.contract.deleteBidMarketData(params, '50000000000000')
		} catch (err) {
			console.log(err)
		}
	}

	const _placebid = async (data) => {
		setIsSubmitting(true)
		const params = {
			ownerId: store.currentUser,
			tokenId: localToken.tokenId,
			quantity: data.bidQuantity,
			amount: parseNearAmount(data.bidAmount),
		}

		const attachedDeposit = JSBI.add(
			JSBI.multiply(
				JSBI.BigInt(data.bidQuantity),
				JSBI.BigInt(parseNearAmount(data.bidAmount))
			),
			JSBI.BigInt(parseNearAmount('0.003'))
		)

		if (
			JSBI.lessThan(JSBI.BigInt(store.userBalance.available), attachedDeposit)
		) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						Insufficient Balance
						<p className="mt-2">
							Available {prettyBalance(store.userBalance.available, 24, 6)} Ⓝ
						</p>
					</div>
				),
				type: 'error',
				duration: 2500,
			})
			setIsSubmitting(false)
			return
		}
		try {
			bidMarketData && (await _cancelBid())
			await near.contract.addBidMarketData(
				params,
				'50000000000000',
				attachedDeposit.toString()
			)
		} catch (err) {
			console.log(err)
		}
	}

	const _transfer = async (data) => {
		// ownerId: AccountId,
		// newOwnerId: AccountId,
		// tokenId: TokenId,
		// quantity: u128

		setIsSubmitting(true)
		const params = {
			ownerId: store.currentUser,
			newOwnerId: data.newOwnerId,
			tokenId: token.tokenId,
			quantity: data.transferQuantity,
		}

		try {
			if (params.ownerId === params.newOwnerId) {
				throw new Error(`Cannot transfer to self`)
			}
			const nearConfig = getConfig(process.env.APP_ENV || 'development')
			if (showModal === 'confirmTransfer') {
				const resp = await axios.post(nearConfig.nodeUrl, {
					jsonrpc: '2.0',
					id: 'dontcare',
					method: 'query',
					params: {
						request_type: 'view_account',
						finality: 'final',
						account_id: data.newOwnerId,
					},
				})
				if (resp.data.error) {
					throw new Error(`Account ${data.newOwnerId} not exist`)
				}
			}

			await near.contract.transferFrom(params)

			// update local state
			const ownerIdx = localToken.ownerships.findIndex(
				(ownership) => ownership.ownerId === params.ownerId
			)
			const newOwnerIdx = localToken.ownerships.findIndex(
				(ownership) => ownership.ownerId === params.newOwnerId
			)
			const newLocalToken = { ...localToken }

			const ownerQuantity = parseInt(
				newLocalToken.ownerships[ownerIdx].quantity
			)

			newLocalToken.ownerships[ownerIdx].quantity =
				ownerQuantity - parseInt(params.quantity)

			// if owns 0, delete ownership
			if (newLocalToken.ownerships[ownerIdx].quantity === 0) {
				newLocalToken.ownerships.splice(ownerIdx, 1)
			}

			// if new owner already own some
			if (showModal === 'confirmTransfer') {
				if (newOwnerIdx > -1) {
					const newOwnerQuantity = parseInt(
						newLocalToken.ownerships[newOwnerIdx].quantity
					)
					newLocalToken.ownerships[newOwnerIdx].quantity =
						newOwnerQuantity + parseInt(params.quantity)
				} else {
					newLocalToken.ownerships.push({
						createdAt: new Date().getTime(),
						updatedAt: new Date().getTime(),
						id: `${params.tokenId}::${params.newOwnerId}`,
						ownerId: params.newOwnerId,
						quantity: params.quantity,
						tokenId: params.tokenId,
					})
				}
			}
			if (showModal === 'confirmBurn') {
				newLocalToken.supply -= params.quantity
			}

			setLocalToken(newLocalToken)
			if (showModal === 'confirmTransfer') {
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">
							Transfer success
						</div>
					),
					type: 'success',
					duration: 2500,
				})
			} else {
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">
							Burn success
						</div>
					),
					type: 'error',
					duration: 2500,
				})
			}

			setShowModal(false)
		} catch (err) {
			console.log(err)
			const message = err.message || 'Something went wrong, try again later'
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">{message}</div>
				),
				type: 'error',
				duration: 2500,
			})
		}

		setIsSubmitting(false)
	}

	const _updatePrice = async () => {
		// export function updateMarketData(
		//   ownerId: AccountId,
		//   tokenId: TokenId,
		//   quantity: u128,
		//   amount: u128

		setIsSubmitting(true)

		const params = {
			ownerId: store.currentUser,
			tokenId: token.tokenId,
			quantity: getValues('quantity'),
			amount: parseNearAmount(getValues('amount')),
		}

		try {
			await near.contract.updateMarketData(params)

			// update local state
			const idx = localToken.ownerships.findIndex(
				(ownership) => ownership.ownerId === store.currentUser
			)
			const newLocalToken = { ...localToken }

			if (params.quantity > 0) {
				newLocalToken.ownerships[idx].marketData = {
					quantity: params.quantity,
					amount: params.amount,
				}
			} else {
				delete newLocalToken.ownerships[idx].marketData
			}

			setLocalToken(newLocalToken)
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						Listing update success
					</div>
				),
				type: 'success',
				duration: 2500,
			})

			setShowModal(false)
		} catch (err) {
			console.log(err)
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						Something went wrong, try again later
					</div>
				),
				type: 'error',
				duration: 2500,
			})
		}

		setIsSubmitting(false)
	}

	const _removePrice = async () => {
		// 	 export function updateMarketData(
		//   ownerId: AccountId,
		//   tokenId: TokenId,
		//   quantity: u128,
		//   amount: u128
		const params = {
			ownerId: store.currentUser,
			tokenId: token.tokenId,
		}

		try {
			await near.contract.deleteMarketData(params)
		} catch (err) {
			console.log(err)
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						Something went wrong, try again later
					</div>
				),
				type: 'error',
				duration: 2500,
			})
		}
	}

	const _getUserOwnership = (userId) => {
		const ownership = localToken.ownerships.find(
			(ownership) => ownership.ownerId === userId
		)
		return ownership
	}

	const _getLowestPrice = (ownerships) => {
		const marketDataList = ownerships
			.filter((ownership) => ownership.marketData)
			.filter((ownership) => ownership.ownerId !== store.currentUser)
			.sort((a, b) => a.marketData.amount - b.marketData.amount)
		return marketDataList[0]
	}

	const _copyLink = () => {
		const copyText = copyLinkRef.current
		copyText.select()
		copyText.setSelectionRange(0, 99999)
		document.execCommand('copy')

		setIsCopied(true)

		setTimeout(() => {
			setShowModal(false)
			setIsCopied(false)
		}, 1500)
	}

	const _changeSortBy = (sortby) => {
		let _localToken = Object.assign({}, localToken)
		let saleOwner = _localToken.ownerships.filter(
			(ownership) => ownership.marketData
		)
		let nonSaleOwner = _localToken.ownerships.filter(
			(ownership) => !ownership.marketData
		)

		if (sortby === 'nameasc') {
			_localToken.ownerships.sort((a, b) => a.ownerId.localeCompare(b.ownerId))
		} else if (sortby === 'namedesc') {
			_localToken.ownerships.sort((a, b) => b.ownerId.localeCompare(a.ownerId))
		} else if (sortby === 'priceasc') {
			saleOwner = saleOwner.sort(
				(a, b) => a.marketData.amount - b.marketData.amount
			)
			_localToken.ownerships = [...saleOwner, ...nonSaleOwner]
		} else if (sortby === 'pricedesc') {
			saleOwner = saleOwner.sort(
				(a, b) => b.marketData.amount - a.marketData.amount
			)
			_localToken.ownerships = [...saleOwner, ...nonSaleOwner]
		}
		setLocalToken(_localToken)
	}

	const changeActiveTab = (tab) => {
		setActiveTab(tab)
	}

	const buttonActionCardDetail = () => {
		if (
			_getLowestPrice(localToken.ownerships) &&
			!_getUserOwnership(store.currentUser) &&
			activeTab !== 'bids'
		) {
			return (
				<div className="w-auto p-4">
					<div className="flex -mx-2">
						<div className="w-1/2 px-2">
							<button
								className="box-border font-semibold py-3 w-full rounded-md border-2 border-primary bg-primary text-white inline-block text-sm"
								onClick={() => {
									if (!store.currentUser) {
										setShowModal('redirectLogin')
									} else {
										if (whitelist[1] === 'user_whitelisted') {
											setChosenSeller(_getLowestPrice(localToken.ownerships))
											setShowModal('confirmBuy')
										} else {
											setShowModal('notAllowedBuy')
										}
									}
								}}
							>
								{`Buy for ${prettyBalance(
									_getLowestPrice(localToken.ownerships).marketData.amount,
									24,
									4
								)} Ⓝ`}
							</button>
						</div>
						<div className="w-1/2 px-2">
							<button
								className="box-border font-semibold py-3 w-full rounded-md border-2 border-primary text-primary inline-block text-sm"
								onClick={() => {
									if (!store.currentUser) {
										setShowModal('redirectLogin')
									} else {
										setShowModal('placeBid')
									}
								}}
							>
								Place a bid
							</button>
						</div>
					</div>
				</div>
			)
		} else if (
			store.currentUser &&
			_getUserOwnership(store.currentUser) &&
			activeTab !== 'bids'
		) {
			return (
				<div className="w-auto p-4">
					<div className="flex -mx-2">
						<div className="w-1/2 px-2">
							<button
								className="font-semibold py-3 w-full rounded-md border-2 border-primary text-primary text-sm"
								onClick={() => {
									if (
										whitelist[0] === 'token_whitelisted' &&
										store.currentUser !== localToken.creatorId
									) {
										setShowModal('notAllowedUpdate')
									} else {
										setShowModal('addUpdateListing')
									}
								}}
							>
								Update Listing
							</button>
						</div>
						<div className="w-1/2 px-2">
							<button
								className="font-semibold py-3 w-full rounded-md border-2 border-primary bg-primary text-white text-sm"
								onClick={() => setShowModal('confirmTransfer')}
							>
								Transfer
							</button>
						</div>
					</div>
				</div>
			)
		} else {
			return (
				<button
					className="box-border font-semibold m-4 py-3 w-auto rounded-md border-2 border-primary text-primary inline-block text-sm"
					onClick={() => {
						if (!store.currentUser) {
							setShowModal('redirectLogin')
						} else {
							setShowModal('placeBid')
						}
					}}
				>
					Place a bid
				</button>
			)
		}
	}

	return (
		<div className="w-full">
			{isComponentMounted && (
				<div
					className="absolute z-0 opacity-0"
					style={{
						top: `-1000`,
					}}
				>
					<input
						ref={copyLinkRef}
						readOnly
						type="text"
						value={window.location.href}
					/>
				</div>
			)}
			{showModal === 'options' && (
				<Modal close={() => setShowModal('')}>
					<div className="max-w-sm w-full px-4 py-2 bg-gray-100 m-auto rounded-md">
						<div className="py-2 cursor-pointer" onClick={() => _copyLink()}>
							{isCopied ? `Copied` : `Copy Link`}
						</div>
						<div
							className="py-2 cursor-pointer"
							onClick={() => {
								setShowModal('shareTo')
							}}
						>
							Share to...
						</div>
						{_getUserOwnership(store.currentUser) &&
							_getUserOwnership(store.currentUser).quantity > 0 && (
								<div
									className="py-2 cursor-pointer"
									onClick={() => {
										if (
											whitelist[0] === 'token_whitelisted' &&
											store.currentUser !== localToken.creatorId
										) {
											setShowModal('notAllowedUpdate')
										} else {
											setShowModal('addUpdateListing')
										}
									}}
								>
									Update Listing
								</div>
							)}
						{_getUserOwnership(store.currentUser) &&
							_getUserOwnership(store.currentUser).quantity > 0 && (
								<div
									className="py-2 cursor-pointer"
									onClick={() => setShowModal('confirmTransfer')}
								>
									Transfer Card
								</div>
							)}
						{_getUserOwnership(store.currentUser) &&
							_getUserOwnership(store.currentUser).quantity > 0 && (
								<div
									className="py-2 cursor-pointer"
									onClick={() => setShowModal('confirmBurn')}
								>
									Burn Card
								</div>
							)}
					</div>
				</Modal>
			)}
			{showModal === 'shareTo' && (
				<Modal close={() => setShowModal('')}>
					<div className="max-w-sm w-full px-4 py-2 bg-gray-100 m-auto rounded-md">
						<div className="py-2 cursor-pointer">
							<TwitterShareButton
								title={`Checkout ${localToken.metadata.name} from collection ${localToken.metadata.collection} on @ParasHQ\n\n#cryptoart #digitalart #tradingcards`}
								url={window.location.href}
								className="flex items-center w-full"
							>
								<TwitterIcon
									size={24}
									className="rounded-md"
									bgStyle={{
										fill: '#11111F',
									}}
								></TwitterIcon>
								<p className="pl-2">Twitter</p>
							</TwitterShareButton>
						</div>
						<div className="py-2 cursor-pointer">
							<FacebookShareButton
								url={window.location.href}
								className="flex items-center w-full"
							>
								<FacebookIcon
									size={24}
									className="rounded-md"
									bgStyle={{
										fill: '#11111F',
									}}
								></FacebookIcon>
								<p className="pl-2">Facebook</p>
							</FacebookShareButton>
						</div>
					</div>
				</Modal>
			)}
			{showModal === 'addUpdateListing' && (
				<Modal
					close={() => setShowModal('')}
					closeOnBgClick={false}
					closeOnEscape={false}
				>
					<div className="max-w-sm w-full p-4 bg-gray-100 m-auto rounded-md">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 tracking-tight">
								Card Listing
							</h1>
							<form onSubmit={handleSubmit(_updatePrice)}>
								<div className="mt-4">
									<label className="block text-sm">
										Sale quantity (Owned:{' '}
										{_getUserOwnership(store.currentUser)
											? _getUserOwnership(store.currentUser).quantity
											: 0}
										)
									</label>
									<input
										type="number"
										name="quantity"
										ref={register({
											required: true,
											validate: (value) => Number.isInteger(Number(value)),
											min: 0,
											max: _getUserOwnership(store.currentUser)
												? _getUserOwnership(store.currentUser).quantity
												: 0,
										})}
										className={`${errors.quantity && 'error'}`}
										placeholder="Number of card on sale"
									/>
									<div className="mt-2 text-sm text-red-500">
										{errors.quantity?.type === 'required' &&
											`Sale quantity is required`}
										{errors.quantity?.type === 'min' && `Minimum 0`}
										{errors.quantity?.type === 'max' &&
											`Must be less than owned`}
										{errors.quantity?.type === 'validate' &&
											'Only use rounded number'}
									</div>
									<div className="mt-2">
										<p className="text-gray-600 text-sm">
											Set sale quantity to <b>0</b> if you only want to remove
											this card from listing
										</p>
									</div>
								</div>
								<div className="mt-4">
									<label className="block text-sm">Sale price</label>
									<div
										className={`flex justify-between bg-gray-300 p-2 rounded-md focus:bg-gray-100 border-2 border-transparent focus:border-dark-primary-1 w-full ${
											errors.amount && 'error'
										}`}
									>
										<input
											type="number"
											name="amount"
											step="any"
											ref={register({
												required: true,
												min: 0,
											})}
											className="clear pr-2"
											placeholder="Card price per pcs"
										/>
										<div className="inline-block">Ⓝ</div>
									</div>
									<p className="text-sm mt-2">
										Receive:{' '}
										{prettyBalance(
											Number(
												watch('amount', 0) *
													(0.95 - (localToken.metadata.royalty || 0) / 100)
											)
												.toPrecision(4)
												.toString(),
											0,
											4
										)}{' '}
										Ⓝ (~$
										{prettyBalance(
											Number(
												store.nearUsdPrice *
													watch('amount', 0) *
													(0.95 - (localToken.metadata.royalty || 0) / 100)
											)
												.toPrecision(4)
												.toString(),
											0,
											4
										)}
										)
									</p>
									<p className="text-sm">
										Royalty:{' '}
										{prettyBalance(
											Number(
												watch('amount', 0) *
													((localToken.metadata.royalty || 0) / 100)
											)
												.toPrecision(4)
												.toString(),
											0,
											4
										)}{' '}
										Ⓝ (~$
										{prettyBalance(
											Number(
												store.nearUsdPrice *
													watch('amount', 0) *
													((localToken.metadata.royalty || 0) / 100)
											)
												.toPrecision(4)
												.toString(),
											0,
											4
										)}
										)
									</p>
									<p className="text-sm">
										Fee:{' '}
										{prettyBalance(
											Number(watch('amount', 0) * 0.05)
												.toPrecision(4)
												.toString(),
											0,
											4
										)}{' '}
										Ⓝ (~$
										{prettyBalance(
											Number(store.nearUsdPrice * watch('amount', 0) * 0.05)
												.toPrecision(4)
												.toString(),
											0,
											4
										)}
										)
									</p>
									<div className="mt-2 text-sm text-red-500">
										{errors.amount?.type === 'required' &&
											`Sale price is required`}
										{errors.amount?.type === 'min' && `Minimum 0`}
									</div>
								</div>
								<div className="">
									<button
										disabled={isSubmitting}
										className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
										type="submit"
									>
										{!isSubmitting ? 'Update' : 'Updating...'}
									</button>
									<button
										disabled={isSubmitting}
										className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary text-primary"
										onClick={() => setShowModal(false)}
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				</Modal>
			)}
			{showModal === 'removeListing' && (
				<Modal close={() => setShowModal('')}>
					<div className="max-w-sm w-full px-4 bg-gray-100 m-auto rounded-md">
						<div>
							<button onClick={_removePrice}>Remove Listing</button>
						</div>
					</div>
				</Modal>
			)}
			{showModal === 'redirectLogin' && (
				<Modal close={() => setShowModal('')}>
					<div className="max-w-sm text-center w-full p-4 bg-gray-100 m-auto rounded-md">
						<div className="flex justify-center items-center">
							<svg
								width="48"
								height="48"
								viewBox="0 0 256 256"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<rect width="256" height="256" rx="10" fill="#0000BA" />
								<path
									fillRule="evenodd"
									clipRule="evenodd"
									d="M80.9048 210L59 46L151.548 62.4C155.482 63.4335 159.124 64.2644 162.478 65.0295C175.091 67.9065 183.624 69.8529 188.238 78.144C194.079 88.5671 197 101.396 197 116.629C197 131.936 194.079 144.801 188.238 155.224C182.397 165.647 170.167 170.859 151.548 170.859H111.462L119.129 210H80.9048ZM92.9524 79.8933L142.899 88.6534C145.022 89.2055 146.988 89.6493 148.798 90.0579C155.605 91.5947 160.21 92.6343 162.7 97.0631C165.852 102.631 167.429 109.483 167.429 117.62C167.429 125.796 165.852 132.668 162.7 138.235C159.547 143.803 152.947 146.587 142.899 146.587H120.083L106.334 145.493L92.9524 79.8933Z"
									fill="white"
								/>
							</svg>
						</div>
						<h3 className="mt-4 text-2xl text-gray-900 font-semibold">
							Collect Digital Art Card that you can truly own.
						</h3>
						<p className="mt-1 text-gray-800">Login to buy this card</p>
						<div className="mt-4">
							<Link href="/login">
								<a>
									<button className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100">
										Go to Login
									</button>
								</a>
							</Link>
						</div>
					</div>
				</Modal>
			)}
			{showModal === 'confirmBuy' && (
				<Modal
					close={() => setShowModal('')}
					closeOnBgClick={false}
					closeOnEscape={false}
				>
					<div className="max-w-sm w-full p-4 bg-gray-100 m-auto rounded-md">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 tracking-tight">
								Confirm Buy
							</h1>
							<p className="text-gray-900 mt-2">
								You are about to purchase <b>{localToken.metadata.name}</b> from{' '}
								<b>{chosenSeller.ownerId}</b>.
							</p>
							<form onSubmit={handleSubmit(_buy)}>
								<div className="mt-4">
									<label className="block text-sm">
										Buy quantity (Available for buy:{' '}
										{chosenSeller.marketData.quantity})
									</label>
									<input
										type="number"
										name="buyQuantity"
										ref={register({
											required: true,
											min: 1,
											max:
												whitelist[0] === 'token_whitelisted'
													? 3
													: chosenSeller.marketData.quantity,
										})}
										className={`${errors.buyQuantity && 'error'}`}
										placeholder="Number of card(s) to buy"
									/>
									<div className="mt-2 text-sm text-red-500">
										{errors.buyQuantity?.type === 'required' &&
											`Buy quantity is required`}
										{errors.buyQuantity?.type === 'min' && `Minimum 1`}
										{whitelist[0] === 'token_whitelisted' &&
											errors.buyQuantity?.type === 'max' &&
											`You can only buy maximum 3 cards per purchase`}
										{whitelist[0] === 'token_not_whitelisted' &&
											errors.buyQuantity?.type === 'max' &&
											`Must be less than available`}
									</div>
								</div>
								<div className="mt-4 text-center">
									<p className="text-gray-800 text-xs">Total</p>
									<div className="text-2xl">
										<p>
											{prettyBalance(
												chosenSeller.marketData.amount *
													watch('buyQuantity' || 0),
												24,
												6
											)}{' '}
											Ⓝ
										</p>
									</div>
									<p className="text-sm">
										~$
										{prettyBalance(
											JSBI.BigInt(
												store.nearUsdPrice *
													chosenSeller.marketData.amount *
													watch('buyQuantity' || 0)
											),
											24,
											6
										)}
									</p>
								</div>
								<p className="text-gray-900 mt-4 text-sm text-center">
									You will be redirected to NEAR Web Wallet to confirm your
									transaction
								</p>
								<div className="">
									<button
										disabled={isSubmitting}
										className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
										type="submit"
									>
										{isSubmitting ? 'Redirecting...' : 'Buy'}
									</button>
									<button
										disabled={isSubmitting}
										className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary text-primary"
										onClick={() => {
											setChosenSeller(null)
											setShowModal(false)
										}}
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				</Modal>
			)}
			{showModal === 'placeBid' && (
				<PlaceBidModal
					bidAmount={bidMarketData && prettyBalance(bidMarketData.price, 24, 4)}
					bidQuantity={bidMarketData && bidMarketData.quantity}
					localToken={localToken}
					onSubmitForm={_placebid}
					onCancel={() => setShowModal('')}
					isSubmitting={isSubmitting}
				/>
			)}
			{showModal === 'confirmTransfer' && (
				<Modal
					close={() => setShowModal('')}
					closeOnBgClick={false}
					closeOnEscape={false}
				>
					<div className="max-w-sm w-full p-4 bg-gray-100 m-auto rounded-md">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 tracking-tight">
								Confirm Transfer
							</h1>
							<form onSubmit={handleSubmit(_transfer)}>
								<div className="mt-4">
									<label className="block text-sm">Address (Account ID)</label>
									<input
										type="text"
										name="newOwnerId"
										ref={register({
											required: true,
										})}
										className={`${errors.newOwnerId && 'error'}`}
										placeholder="New Owner Address"
									/>
									<div className="mt-2 text-sm text-red-500">
										{errors.newOwnerId?.type === 'required' &&
											`Address is required`}
									</div>
								</div>
								<div className="mt-4">
									<label className="block text-sm">
										Quantity (Available for transfer:{' '}
										{_getUserOwnership(store.currentUser)
											? _getUserOwnership(store.currentUser).quantity -
											  (_getUserOwnership(store.currentUser).marketData
													?.quantity || 0)
											: 0}
										, owns: {_getUserOwnership(store.currentUser)?.quantity})
									</label>
									<input
										type="number"
										name="transferQuantity"
										ref={register({
											required: true,
											min: 1,
											max: _getUserOwnership(store.currentUser)
												? _getUserOwnership(store.currentUser).quantity -
												  (_getUserOwnership(store.currentUser).marketData
														?.quantity || 0)
												: 0,
										})}
										className={`${errors.transferQuantity && 'error'}`}
										placeholder="Number of card(s) to transfer"
									/>
									<div className="mt-2 text-sm text-red-500">
										{errors.transferQuantity?.type === 'required' &&
											`Quantity is required`}
										{errors.transferQuantity?.type === 'min' && `Minimum 1`}
										{errors.transferQuantity?.type === 'max' &&
											`Must be less than available`}
									</div>
								</div>
								<p className="mt-4 text-sm text-center">
									You will be transfering {watch('transferQuantity') || '-'}{' '}
									card(s) to {watch('newOwnerId') || '-'}
								</p>
								<div className="">
									<button
										disabled={isSubmitting}
										className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
										type="submit"
									>
										Transfer
									</button>
									<button
										disabled={isSubmitting}
										className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary text-primary"
										onClick={() => {
											setChosenSeller(null)
											setShowModal(false)
										}}
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				</Modal>
			)}
			{showModal === 'confirmBurn' && (
				<Modal
					close={() => setShowModal('')}
					closeOnBgClick={false}
					closeOnEscape={false}
				>
					<div className="max-w-sm w-full p-4 bg-gray-100 m-auto rounded-md">
						<div>
							<h1 className="text-2xl font-bold text-gray-900 tracking-tight">
								Confirm Burn
							</h1>
							<form onSubmit={handleSubmit(_transfer)}>
								<div className="hidden">
									<input
										type="text"
										name="newOwnerId"
										ref={register()}
										className={`${errors.newOwnerId && 'error'}`}
										placeholder="New Owner Address"
									/>
								</div>
								<div className="mt-4">
									<label className="block text-sm">
										Quantity (Available for Burn:{' '}
										{_getUserOwnership(store.currentUser)
											? _getUserOwnership(store.currentUser).quantity -
											  (_getUserOwnership(store.currentUser).marketData
													?.quantity || 0)
											: 0}
										, owns: {_getUserOwnership(store.currentUser)?.quantity})
									</label>
									<input
										type="number"
										name="transferQuantity"
										ref={register({
											required: true,
											min: 1,
											max: _getUserOwnership(store.currentUser)
												? _getUserOwnership(store.currentUser).quantity -
												  (_getUserOwnership(store.currentUser).marketData
														?.quantity || 0)
												: 0,
										})}
										className={`${errors.transferQuantity && 'error'}`}
										placeholder="Number of card(s) to transfer"
									/>
									<div className="mt-2 text-sm text-red-500">
										{errors.transferQuantity?.type === 'required' &&
											`Quantity is required`}
										{errors.transferQuantity?.type === 'min' && `Minimum 1`}
										{errors.transferQuantity?.type === 'max' &&
											`Must be less than available`}
									</div>
								</div>
								<p className="mt-4 text-sm text-center">
									You will be burning {watch('transferQuantity') || '-'} card(s)
								</p>
								<div className="">
									<button
										disabled={isSubmitting}
										className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
										type="submit"
									>
										Burn
									</button>
									<button
										disabled={isSubmitting}
										className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary text-primary"
										onClick={() => {
											setShowModal(false)
										}}
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				</Modal>
			)}
			{showModal === 'notAllowedBuy' && (
				<Modal close={() => setShowModal('')}>
					<div className="max-w-xs text-center w-full p-4 bg-gray-100 m-auto rounded-md">
						<p className="mt-1 text-gray-900">
							You are not allowed to buy this card at the moment. Only
							whitelisted account can buy this card
						</p>
						<div className="mt-4">
							<button
								onClick={() => setShowModal('')}
								className="w-full outline-none h-12 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
							>
								Ok
							</button>
						</div>
					</div>
				</Modal>
			)}
			{showModal === 'notAllowedUpdate' && (
				<Modal close={() => setShowModal('')}>
					<div className="max-w-xs text-center w-full p-4 bg-gray-100 m-auto rounded-md">
						<p className="mt-1 text-gray-900">
							You are not allowed to list this card at the moment
						</p>
						<div className="mt-4">
							<button
								onClick={() => setShowModal('')}
								className="w-full outline-none h-12 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
							>
								Ok
							</button>
						</div>
					</div>
				</Modal>
			)}
			<div>
				<div
					className="flex flex-wrap h-full rounded-md overflow-hidden"
					style={{
						height: `85vh`,
					}}
				>
					<div className="w-full h-1/2 lg:h-full lg:w-3/5 bg-dark-primary-1 p-12 relative">
						<div className="absolute inset-0 opacity-75">
							<Blurhash
								hash={
									localToken.metadata.blurhash ||
									'UZ9ZtPzmpHv;R]ONJ6bKQ-l7Z.S_bow5$-nh'
								}
								width={`100%`}
								height={`100%`}
								resolutionX={32}
								resolutionY={32}
								punch={1}
							/>
						</div>
						<div className="h-full flex items-center">
							<Card
								imgUrl={parseImgUrl(localToken.metadata.image, null, {
									width: `0.8`,
								})}
								imgBlur={localToken.metadata.blurhash}
								token={{
									name: localToken.metadata.name,
									collection: localToken.metadata.collection,
									description: localToken.metadata.description,
									creatorId: localToken.creatorId,
									supply: localToken.supply,
									tokenId: localToken.tokenId,
									createdAt: localToken.createdAt,
								}}
								initialRotate={{
									x: 15,
									y: 15,
								}}
							/>
						</div>
					</div>
					<div className="flex flex-col w-full h-1/2 lg:h-full lg:w-2/5 bg-gray-100">
						<Scrollbars
							style={{
								height: `100%`,
							}}
							universal={true}
							renderView={(props) => (
								<div {...props} id="activityListScroll" className="p-4" />
							)}
						>
							<div>
								<div className="flex justify-between">
									<div>
										<h1
											className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight pr-4"
											style={{
												wordBreak: 'break-word',
											}}
										>
											{localToken.metadata.name}
										</h1>
										<p>
											by{' '}
											<span className="font-semibold">
												<Link href={`/${localToken.creatorId}`}>
													<a className="text-black font-semibold border-b-2 border-transparent hover:border-black">
														{localToken.creatorId}
													</a>
												</Link>
											</span>
										</p>
									</div>
									<div>
										<svg
											className="cursor-pointer"
											onClick={() => setShowModal('options')}
											width="18"
											height="18"
											viewBox="0 0 29 7"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<rect
												width="6.78723"
												height="6.78723"
												rx="2"
												transform="matrix(1 0 0 -1 0 6.78711)"
												fill="black"
											/>
											<rect
												width="6.78723"
												height="6.78723"
												rx="2"
												transform="matrix(1 0 0 -1 11.1064 6.78711)"
												fill="black"
											/>
											<rect
												width="6.78723"
												height="6.78723"
												rx="2"
												transform="matrix(1 0 0 -1 22.2126 6.78711)"
												fill="black"
											/>
										</svg>
									</div>
								</div>
								<div className="flex mt-2 text-sm space-x-1 overflow-x-scroll disable-scrollbars -mb-4">
									<div>
										<div
											className={`px-3 cursor-pointer relative text-center font-semibold overflow-hidden rounded-md ${
												activeTab === 'info'
													? 'text-gray-100 bg-dark-primary-1'
													: 'hover:bg-opacity-15 hover:bg-dark-primary-1'
											}`}
											onClick={() => changeActiveTab('info')}
										>
											<div>Info</div>
										</div>
									</div>
									<div>
										<div
											className={`px-3 cursor-pointer relative text-center font-semibold overflow-hidden rounded-md ${
												activeTab === 'owners'
													? 'text-gray-100 bg-dark-primary-1'
													: 'hover:bg-opacity-15 hover:bg-dark-primary-1'
											}`}
											onClick={() => changeActiveTab('owners')}
										>
											<div>Owners</div>
										</div>
									</div>
									<div>
										<div
											className={`px-3 cursor-pointer relative text-center font-semibold overflow-hidden rounded-md ${
												activeTab === 'bids'
													? 'text-gray-100 bg-dark-primary-1'
													: 'hover:bg-opacity-15 hover:bg-dark-primary-1'
											}`}
											onClick={() => changeActiveTab('bids')}
										>
											<div>Bids</div>
										</div>
									</div>
									<div>
										<div
											className={`px-3 cursor-pointer relative text-center font-semibold overflow-hidden rounded-md ${
												activeTab === 'history'
													? 'text-gray-100 bg-dark-primary-1'
													: 'hover:bg-opacity-15 hover:bg-dark-primary-1'
											}`}
											onClick={() => changeActiveTab('history')}
										>
											<div>History</div>
										</div>
									</div>
									<div>
										<div
											className={`px-3 cursor-pointer relative text-center font-semibold overflow-hidden rounded-md ${
												activeTab === 'publication'
													? 'text-gray-100 bg-dark-primary-1'
													: 'hover:bg-opacity-15 hover:bg-dark-primary-1'
											}`}
											onClick={() => changeActiveTab('publication')}
										>
											<div>Publication</div>
										</div>
									</div>
								</div>

								{activeTab === 'info' && (
									<div>
										<div className="flex border-2 border-dashed mt-4 p-2 rounded-md">
											<div>
												<p className="text-sm text-black font-medium">
													Collection
												</p>
												{token.metadata.collection.includes('card4card') ? (
													<Link
														href={{
															pathname: '/event/card4card',
														}}
													>
														<a className="text-black font-semibold border-b-2 border-transparent hover:border-black">
															{localToken.metadata.collection}
														</a>
													</Link>
												) : (
													<Link
														href={{
															pathname: '/[id]/collection/[collectionName]',
															query: {
																collectionName: encodeURIComponent(
																	localToken.metadata.collection
																),
																id: localToken.creatorId,
															},
														}}
													>
														<a className="text-black font-semibold border-b-2 border-transparent hover:border-black">
															{localToken.metadata.collection}
														</a>
													</Link>
												)}
											</div>
										</div>
										<div className="flex items-center -mx-2">
											<div className="flex-1 w-1/2 px-2">
												<div className="border-2 border-dashed mt-4 p-2 rounded-md">
													<p className="text-sm text-black font-medium">
														Royalty
													</p>
													<p className="text-gray-900">
														{localToken.metadata.royalty &&
														parseInt(localToken.metadata.royalty) > 0
															? `${localToken.metadata.royalty}%`
															: `No`}
													</p>
												</div>
											</div>
											<div className="flex-1 w-1/2 px-2">
												<div className="border-2 border-dashed mt-4 p-2 rounded-md">
													<p className="text-sm text-black font-medium">View</p>
													<div className="flex">
														<svg
															width="16"
															height="20"
															viewBox="0 0 511 350"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																d="M0 177.231C80.9998 -42.769 401 -73.769 510.5 174.231C437.936 394.703 101.751 420.866 0 177.231Z"
																fill="black"
															/>
															<circle
																cx="255"
																cy="175"
																r="116"
																fill="#E5E5E5"
															/>
															<circle cx="255" cy="175" r="70" fill="black" />
														</svg>
														<p className="text-gray-900 ml-1">
															{localToken.view}
														</p>
													</div>
												</div>
											</div>
										</div>
										<div className="border-2 border-dashed mt-4 p-2 rounded-md">
											<p className="text-sm text-black font-medium">
												Description
											</p>
											<ReactLinkify
												componentDecorator={(
													decoratedHref,
													decoratedText,
													key
												) => (
													<a target="blank" href={decoratedHref} key={key}>
														{decoratedText}
													</a>
												)}
											>
												<p
													className="text-gray-900 whitespace-pre-line"
													style={{
														wordBreak: 'break-word',
													}}
												>
													{localToken.metadata.description.replace(
														/\n\s*\n\s*\n/g,
														'\n\n'
													)}
												</p>
											</ReactLinkify>
										</div>
										{localToken.categories &&
											localToken.categories?.length !== 0 && (
												<div className="border-2 border-dashed mt-4 p-2 rounded-md">
													<p className="text-sm text-black font-medium">
														Featured in
													</p>
													{localToken.categories.map(
														({ _id, name, categoryId }, idx) => (
															<Fragment key={_id}>
																<span
																	onClick={() =>
																		router.push(`/market/${categoryId}`)
																	}
																	className="cursor-pointer text-black font-semibold border-b-2 border-transparent hover:border-black"
																>
																	{name}
																</span>
																{idx !== localToken.categories.length - 1 && (
																	<span>, </span>
																)}
															</Fragment>
														)
													)}
												</div>
											)}
										<div className="flex items-center -mx-2">
											<div className="w-1/2 px-2">
												<div className="border-2 border-dashed mt-4 p-2 rounded-md">
													<p className="text-sm text-black font-medium">
														Created
													</p>
													<p className="text-gray-900">
														{parseDate(localToken.metadata.createdAt)}
													</p>
												</div>
											</div>
											<div className="w-1/2 px-2">
												<div className="border-2 border-dashed mt-4 p-2 rounded-md">
													<p className="text-sm text-black font-medium">
														Supply
													</p>
													<p className="text-gray-900">
														{localToken.supply}pcs
													</p>
												</div>
											</div>
										</div>
										<div className="border-2 border-dashed mt-4 p-2 rounded-md">
											<p className="text-sm text-black font-medium mb-2">
												Token Info
											</p>
											<div className="flex justify-between text-sm">
												<p>Token ID</p>
												<TokenInfoCopy text={localToken.tokenId} />
											</div>
											<div className="flex justify-between text-sm">
												<p>Smart Contract</p>
												<TokenInfoCopy text={process.env.CONTRACT_NAME} small />
											</div>
											<div className="flex justify-between text-sm">
												<p>Image Link</p>
												<TokenInfoCopy
													text={parseImgUrl(localToken.metadata.image, null, {
														useOriginal: true,
													})}
												/>
											</div>
										</div>
									</div>
								)}

								{activeTab === 'owners' && (
									<div className="text-gray-900">
										<div className="flex border-2 justify-between border-dashed mt-4 p-2 rounded-md">
											<p className="text-sm my-auto text-black font-medium">
												Sort By
											</p>
											<select
												className="py-1 rounded-md bg-transparent outline-none"
												onChange={(e) => _changeSortBy(e.target.value)}
												defaultValue="priceasc"
											>
												<option value="nameasc">Name A-Z</option>
												<option value="namedesc">Name Z-A</option>
												<option value="priceasc">Price Low-High</option>
												<option value="pricedesc">Price High-Low</option>
											</select>
										</div>
										{localToken.ownerships.map((ownership, idx) => {
											return (
												<Ownership
													onUpdateListing={() => {
														if (
															whitelist[0] === 'token_whitelisted' &&
															store.currentUser !== localToken.creatorId
														) {
															setShowModal('notAllowedUpdate')
														} else {
															setShowModal('addUpdateListing')
														}
													}}
													onBuy={() => {
														if (
															store.currentUser === ownership.ownerId ||
															!store.currentUser
														) {
															setShowModal('redirectLogin')
														} else {
															if (whitelist[1] === 'user_whitelisted') {
																setChosenSeller(ownership)
																setShowModal('confirmBuy')
															} else {
																setShowModal('notAllowedBuy')
															}
														}
													}}
													ownership={ownership}
													key={idx}
													whitelist={whitelist}
												/>
											)
										})}
									</div>
								)}

								{activeTab === 'bids' && (
									<BidList
										token={localToken}
										userOwnership={_getUserOwnership(store.currentUser)}
									/>
								)}

								{activeTab === 'history' && <ActivityList token={token} />}

								{activeTab === 'publication' && (
									<PublicationPreviewMini tokenId={token.tokenId} />
								)}
							</div>
						</Scrollbars>
						{buttonActionCardDetail()}
					</div>
				</div>
			</div>
		</div>
	)
}

export default CardDetail
