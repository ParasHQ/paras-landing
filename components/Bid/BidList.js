import { useEffect, useState } from 'react'
import Axios from 'axios'
import LinkToProfile from './LinkToProfile'
import { parseImgUrl, prettyBalance, timeAgo } from 'utils/common'
import useSWR from 'swr'
import Link from 'next/link'
import useStore from 'lib/store'
import Modal from 'components/Modal'
import near from 'lib/near'
import PlaceBidModal from 'components/Modal/PlaceBidModal'
import JSBI from 'jsbi'
import { parseNearAmount } from 'near-api-js/lib/utils/format'
import { useToast } from 'hooks/useToast'
import AcceptBidModal from 'components/Modal/AcceptBidModal'
import { useIntl } from 'hooks/useIntl'
import { sentryCaptureException } from 'lib/sentry'

const BidItem = ({ data, userOwnership, token, fetchBid }) => {
	const store = useStore()
	const toast = useToast()
	const [showModal, setShowModal] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const { localeLn } = useIntl()
	const fetcher = async (key) => {
		const resp = await Axios.get(`${process.env.API_URL}/${key}`)
		if (resp.data.data.results.length > 0) {
			return resp.data.data.results[0]
		} else {
			return {}
		}
	}

	const { data: profile } = useSWR(`profiles?accountId=${data.accountId}`, fetcher)

	const acceptBid = async () => {
		const quantity =
			data.bidMarketData.quantity > userOwnership.quantity
				? userOwnership.quantity.toString()
				: data.bidMarketData.quantity.toString()
		const params = {
			ownerId: data.accountId,
			tokenId: token.tokenId,
			quantity: quantity,
		}

		if (
			userOwnership.marketData &&
			quantity > userOwnership.quantity - parseInt(userOwnership.marketData.quantity)
		) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">{localeLn('MakeSureNotOnSale')}</div>
				),
				type: 'error',
				duration: 2500,
			})
			return
		}

		setIsLoading(true)
		try {
			await near.contract.acceptBidMarketData(params, '50000000000000')

			const balance = await near.wallet.account().getAccountBalance()
			store.setUserBalance(balance)

			setIsLoading(false)
			setShowModal('')
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						{localeLn('SuccessfullyAcceptedBid')} {data.accountId}.
					</div>
				),
				type: 'success',
				duration: 2500,
			})
			fetchBid()
		} catch (err) {
			sentryCaptureException(err)
			const msg = err.response?.data?.message || 'Something went wrong, try again later.'

			toast.show({
				text: <div className="font-semibold text-center text-sm">{msg}</div>,
				type: 'error',
				duration: 2500,
			})
			setIsLoading(false)
		}
	}

	const updateBid = async (data) => {
		const params = {
			ownerId: store.currentUser,
			tokenId: token.tokenId,
			quantity: data.bidQuantity,
			amount: parseNearAmount(data.bidAmount),
		}

		const attachedDeposit = JSBI.add(
			JSBI.multiply(JSBI.BigInt(data.bidQuantity), JSBI.BigInt(parseNearAmount(data.bidAmount))),
			JSBI.BigInt(parseNearAmount('0.003'))
		)

		if (JSBI.lessThan(JSBI.BigInt(store.userBalance.available), attachedDeposit)) {
			toast.show({
				text: (
					<div className="font-semibold text-center text-sm">
						{localeLn('InsufficientBalance')}
						<p className="mt-2">
							{localeLn('Available')} {prettyBalance(store.userBalance.available, 24, 6)} Ⓝ
						</p>
					</div>
				),
				type: 'error',
				duration: 2500,
			})
			setIsLoading(false)
			return
		}

		setIsLoading(true)
		await cancelBid(false)
		try {
			await near.contract.addBidMarketData(params, '50000000000000', attachedDeposit.toString())
		} catch (err) {
			sentryCaptureException(err)
			const msg = err.response?.data?.message || 'Something went wrong, try again later.'
			toast.show({
				text: <div className="font-semibold text-center text-sm">{msg}</div>,
				type: 'error',
				duration: 2500,
			})
		}
	}

	const cancelBid = async (fetchAfterCancel = true) => {
		const params = {
			ownerId: data.accountId,
			tokenId: token.tokenId,
		}
		setIsLoading(true)
		try {
			await near.contract.deleteBidMarketData(params, '50000000000000')
			fetchAfterCancel && setIsLoading(false)
			fetchAfterCancel && fetchBid()
			fetchAfterCancel &&
				toast.show({
					text: (
						<div className="font-semibold text-center text-sm">{localeLn('BidHasDeleted')}</div>
					),
					type: 'success',
					duration: 2500,
				})
			const balance = await near.wallet.account().getAccountBalance()
			store.setUserBalance(balance)
		} catch (err) {
			sentryCaptureException(err)
			const msg = err.response?.data?.message || 'Something went wrong, try again later.'

			toast.show({
				text: <div className="font-semibold text-center text-sm">{msg}</div>,
				type: 'error',
				duration: 2500,
			})
			setIsLoading(false)
		}
	}

	return (
		<>
			{showModal === 'acceptBid' && (
				<AcceptBidModal
					data={data}
					isLoading={isLoading}
					onClose={() => setShowModal('')}
					onSubmitForm={acceptBid}
					token={token}
					userOwnership={userOwnership}
				/>
			)}
			{showModal === 'updateBid' && (
				<PlaceBidModal
					bidAmount={prettyBalance(data.bidMarketData.amount, 24, 4)}
					bidQuantity={data.bidMarketData.quantity}
					isSubmitting={isLoading}
					localToken={token}
					onCancel={() => setShowModal('')}
					onSubmitForm={updateBid}
				/>
			)}
			{showModal === 'cancelBid' && (
				<Modal close={() => setShowModal('')} closeOnBgClick={false} closeOnEscape={false}>
					<div className="w-full max-w-xs p-4 m-auto bg-gray-100 rounded-md overflow-y-auto max-h-screen">
						<div className="w-full">{localeLn('AreSureDeleteBids')}</div>
						<div className="flex space-x-4">
							<button
								disabled={isLoading}
								className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
								onClick={cancelBid}
							>
								{isLoading ? 'Deleting...' : 'Delete'}
							</button>
							<button
								disabled={isLoading}
								className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-white text-primary"
								onClick={() => setShowModal('')}
							>
								{localeLn('Cancel')}
							</button>
						</div>
					</div>
				</Modal>
			)}
			<div className="m-auto border-2 border-dashed my-4 p-2 rounded-md">
				<div className="flex justify-between items-center">
					<div className="flex items-center overflow-hidden">
						<Link href={`/${data.accountId}`}>
							<div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden cursor-pointer bg-primary">
								{profile && (
									<img
										className="object-cover"
										src={parseImgUrl(profile.imgUrl, null, {
											width: `300`,
										})}
									/>
								)}
							</div>
						</Link>
						<div className="px-2">
							<LinkToProfile accountId={data.accountId} len={20} />
						</div>
					</div>
					<p className="mt-1 text-sm">{timeAgo.format(data.createdAt)}</p>
				</div>
				<div className="flex items-center justify-between mt-2">
					<div>
						<span>
							{localeLn('Bid')} {prettyBalance(data.bidMarketData.amount, 24, 4)} Ⓝ
						</span>
						<span>
							{' '}
							{localeLn('for')} {data.bidMarketData.quantity} pcs
						</span>
					</div>
					{userOwnership && store.currentUser !== data.accountId && (
						<button
							className="font-semibold w-24 rounded-md bg-primary text-white"
							onClick={() => setShowModal('acceptBid')}
						>
							{localeLn('Accept')}
						</button>
					)}
					{store.currentUser === data.accountId && (
						<div className="flex space-x-1">
							<button
								onClick={() => setShowModal('updateBid')}
								className="font-semibold w-24 rounded-md border-primary border-2 text-primary"
							>
								Update
							</button>
							<div
								onClick={() => setShowModal('cancelBid')}
								className="border-2 border-red-700 px-1 flex items-center justify-center rounded-md"
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 16 16"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										clipRule="evenodd"
										d="M8.00008 9.41423L3.70718 13.7071L2.29297 12.2929L6.58586 8.00001L2.29297 3.70712L3.70718 2.29291L8.00008 6.5858L12.293 2.29291L13.7072 3.70712L9.41429 8.00001L13.7072 12.2929L12.293 13.7071L8.00008 9.41423Z"
										fill="#c53030"
									/>
								</svg>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	)
}

const BidList = ({ userOwnership, token }) => {
	const [bidList, setBidList] = useState([])
	const [isFetching, setIsFetching] = useState(true)
	const { localeLn } = useIntl()
	useEffect(() => {
		_fetchData()
	}, [])

	const _fetchData = async () => {
		const res = await Axios(`${process.env.API_URL}/bids?tokenId=${token.tokenId}`)
		const newData = await res.data.data

		setBidList(newData.results)
		setIsFetching(false)
	}

	return (
		<div>
			{bidList.length === 0 && !isFetching && (
				<div className="border-2 border-dashed my-4 p-2 rounded-md text-center">
					<p className="text-gray-500 py-8 px-8">{localeLn('NoBiddingYet')}</p>
				</div>
			)}
			{isFetching && (
				<div className="border-2 border-dashed my-4 p-2 rounded-md text-center">
					<p className="my-2 text-center">{localeLn('LoadingLoading')}</p>
				</div>
			)}
			{bidList.length !== 0 &&
				bidList.map((bid) => {
					return (
						<BidItem
							key={bid._id}
							data={bid}
							userOwnership={userOwnership}
							token={token}
							fetchBid={_fetchData}
						/>
					)
				})}
		</div>
	)
}

export default BidList
